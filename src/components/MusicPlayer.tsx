import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "DATA_STREAM_01",
    artist: "MACHINE_MIND",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-[#00FFFF]",
    bg: "bg-[#00FFFF]"
  },
  {
    id: 2,
    title: "CORRUPTED_SECTOR",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "text-[#FF00FF]",
    bg: "bg-[#FF00FF]"
  },
  {
    id: 3,
    title: "VOID_RESONANCE",
    artist: "SYS_ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "text-[#00FFFF]",
    bg: "bg-[#00FFFF]"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full flex flex-col items-center bg-black">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="w-full mb-6 border-2 border-[#00FFFF] p-4 relative">
        <div className={`absolute top-0 left-0 w-2 h-full ${currentTrack.bg} ${isPlaying ? 'animate-pulse' : ''}`} />
        <div className="pl-4">
          <h3 className={`text-2xl font-bold tracking-widest ${currentTrack.color} glitch-text`} data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#FF00FF] text-lg tracking-widest mt-1">AUTH: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 border-2 border-[#FF00FF] bg-black mb-6 relative">
        <div 
          className={`h-full ${currentTrack.bg}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col w-full space-y-4">
        <div className="flex justify-between w-full">
          <button 
            onClick={skipBackward}
            className="px-4 py-2 border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors text-xl"
          >
            [ &lt;&lt; ]
          </button>
          
          <button 
            onClick={togglePlay}
            className={`px-8 py-2 border-2 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-colors text-2xl font-bold ${isPlaying ? 'screen-tear' : ''}`}
          >
            {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
          </button>
          
          <button 
            onClick={skipForward}
            className="px-4 py-2 border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors text-xl"
          >
            [ &gt;&gt; ]
          </button>
        </div>
        
        <button 
          onClick={toggleMute}
          className="w-full py-2 border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-colors text-xl"
        >
          {isMuted ? 'AUDIO: MUTED' : 'AUDIO: ACTIVE'}
        </button>
      </div>
    </div>
  );
}
