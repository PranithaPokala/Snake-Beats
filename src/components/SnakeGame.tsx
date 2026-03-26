import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // UP

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted) {
      setIsPaused(prev => !prev);
      return;
    }

    if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
      setHasStarted(true);
    }

    const currentDir = directionRef.current;
    
    switch (e.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'arrowdown':
      case 's':
        if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'arrowleft':
      case 'a':
        if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'arrowright':
      case 'd':
        if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isGameOver, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(currentDir);
        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 8);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [food, isGameOver, isPaused, hasStarted, score, generateFood]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setHighScore(prev => Math.max(prev, score));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto bg-black">
      {/* Score Header */}
      <div className="flex justify-between w-full mb-4 border-b-4 border-[#FF00FF] pb-4 px-2">
        <div className="flex flex-col">
          <span className="text-[#FF00FF] text-xl tracking-widest font-bold">MEM_ALLOC</span>
          <span className="text-4xl font-black text-[#00FFFF]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#FF00FF] text-xl tracking-widest font-bold">PEAK_MEM</span>
          <span className="text-4xl font-black text-[#00FFFF]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameAreaRef}
        className={`relative bg-black border-4 border-[#00FFFF] w-full max-w-[500px] aspect-square outline-none ${isGameOver ? 'screen-tear' : ''}`}
        tabIndex={0}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #00FFFF 1px, transparent 1px), linear-gradient(to bottom, #00FFFF 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-[#FF00FF] animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-[#FFFFFF]' : 'bg-[#00FFFF]'}`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
              }}
            />
          );
        })}

        {/* Overlays */}
        {!hasStarted && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#FF00FF] m-4">
            <h2 className="text-5xl font-black text-[#00FFFF] tracking-widest mb-4 glitch-text" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
            <p className="text-[#FF00FF] text-2xl animate-pulse">[ PRESS ANY KEY ]</p>
          </div>
        )}

        {isPaused && !isGameOver && hasStarted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 border-4 border-[#00FFFF] m-4">
            <h2 className="text-5xl font-black text-[#FF00FF] tracking-widest glitch-text" data-text="SYS_PAUSED">SYS_PAUSED</h2>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 border-4 border-[#FF00FF] m-4">
            <h2 className="text-5xl font-black text-[#FF00FF] tracking-widest mb-2 glitch-text" data-text="TERMINAL_FAILURE">TERMINAL_FAILURE</h2>
            <p className="text-[#00FFFF] text-2xl mb-8">FINAL_MEM: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-black border-4 border-[#00FFFF] text-[#00FFFF] text-2xl font-bold tracking-widest hover:bg-[#00FFFF] hover:text-black transition-colors"
            >
              [ REBOOT_SYS ]
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#FF00FF] text-xl flex gap-8">
        <span>INPUT: [W A S D] / [ARROWS]</span>
        <span>HALT: [SPACE]</span>
      </div>
    </div>
  );
}
