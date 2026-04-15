import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Generator",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00FFFF",
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Neural Pulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#FF00FF",
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "Synth Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39FF14",
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleEnded = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full flex items-center justify-between px-8 py-2 font-pixel">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />
      
      {/* Music Info (Left) */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-16 h-16 bg-black border-2 border-[#00ffff] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,255,255,0.3)] group relative">
          <div className="absolute inset-0 bg-[#ff00ff]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          🎹
        </div>
        <div className="track-details">
          <h3 className="text-xl font-bold text-[#00ffff] mb-0 tracking-widest truncate max-w-[180px]">{currentTrack.title}</h3>
          <p className="text-[10px] text-[#ff00ff] uppercase tracking-[0.2em]">{currentTrack.artist} // NODE_01</p>
        </div>
      </div>

      {/* Playback Controls (Center) */}
      <div className="flex items-center gap-10 justify-center w-1/3">
        <button 
          onClick={skipBackward}
          className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-[#00ffff] flex items-center justify-center text-black hover:bg-[#ff00ff] hover:text-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)] border-b-4 border-r-4 border-black active:border-0"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        <button 
          onClick={skipForward}
          className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Visualizer (Right) */}
      <div className="flex items-end gap-1 h-12 w-1/3 justify-end opacity-80">
        {[0.8, 0.4, 0.95, 0.6, 0.85, 0.3, 0.7, 0.5, 0.9, 0.4].map((height, i) => (
          <motion.div
            key={i}
            animate={{ height: isPlaying ? [`${height * 100}%`, `${(height * 0.3) * 100}%`, `${height * 100}%`] : `${height * 100}%` }}
            transition={{ duration: 0.3 + (i * 0.05), repeat: Infinity }}
            className="w-1.5 bg-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.5)]"
          />
        ))}
      </div>
    </div>
  );
};


