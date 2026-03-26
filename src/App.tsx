import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-sans selection:bg-[#FF00FF] selection:text-black flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative uppercase">
      <div className="scanlines" />
      <div className="static-noise" />
      
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 z-10 border-b-4 border-[#FF00FF] pb-4 screen-tear">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#00FFFF] glitch-text" data-text="SYS.SNAKE_PROTOCOL">
          SYS.SNAKE_PROTOCOL
        </h1>
        <div className="text-[#FF00FF] text-2xl animate-pulse">
          STATUS: ONLINE
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 flex-1">
        <div className="lg:col-span-8 flex flex-col items-center justify-center border-4 border-[#00FFFF] p-2 relative bg-black">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FF00FF] -translate-x-3 -translate-y-3 pointer-events-none mix-blend-screen" />
          <SnakeGame />
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center lg:justify-start pt-4 lg:pt-0">
          <div className="w-full sticky top-8 border-4 border-[#FF00FF] p-6 bg-black relative">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#00FFFF] translate-x-3 translate-y-3 pointer-events-none mix-blend-screen" />
            <h2 className="text-3xl font-bold tracking-widest text-[#00FFFF] mb-6 border-b-4 border-[#00FFFF] pb-2 glitch-text" data-text="AUDIO_SUBSYSTEM">
              AUDIO_SUBSYSTEM
            </h2>
            <MusicPlayer />
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto mt-12 text-center text-[#FF00FF] text-xl z-10 border-t-4 border-[#00FFFF] pt-4">
        <p>CONNECTION_SECURE // DATA_STREAM_ACTIVE</p>
      </footer>
    </div>
  );
}
