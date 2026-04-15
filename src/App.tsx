import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Trophy, Gamepad2, Zap, Activity, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] font-pixel p-4 flex flex-col gap-4 relative overflow-hidden">
      {/* CRT Overlay Effects */}
      <div className="scanline"></div>
      <div className="scanline-move"></div>
      
      {/* App Header */}
      <header className="flex justify-between items-center px-4 py-2 border-b-2 border-[#00ffff] bg-black/40 backdrop-blur-sm z-50">
        <div className="flex items-center gap-4">
          <Terminal className="w-6 h-6 animate-pulse" />
          <h1 className="text-3xl font-black tracking-widest uppercase italic glitch-text" data-text="NEON_RHYTHM.EXE">
            NEON_RHYTHM.EXE
          </h1>
        </div>
        <div className="flex items-center gap-6 text-xl">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#39ff14]" />
            <span className="uppercase tracking-widest">LINK_STABLE</span>
          </div>
          <div className="font-mono text-sm opacity-50">0x7F-22-B1</div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-12 gap-4 z-10">
        
        {/* Left Panel - Stats */}
        <aside className="col-span-3 flex flex-col gap-4">
          <div className="bg-black/80 border-2 border-[#00ffff] p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff]/20 group-hover:bg-[#ff00ff]/40 transition-colors"></div>
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#888899] mb-4 flex items-center gap-2">
              <Trophy className="w-3 h-3" /> DATA_NODE_01
            </h2>
            <div className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#888899]">CURRENT_SCORE</div>
                <div className="text-5xl font-bold text-[#ff00ff] drop-shadow-[0_0_10px_#ff00ff]">
                  {score.toString().padStart(4, '0')}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-[#888899]">MAX_CAPACITY</div>
                <div className="text-5xl font-bold text-[#00ffff] drop-shadow-[0_0_10px_#00ffff]">
                  {highScore.toString().padStart(4, '0')}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/80 border-2 border-[#39ff14] p-4 flex-1">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#39ff14] mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3" /> SYSTEM_LOG
            </h2>
            <div className="text-xs font-mono space-y-2 opacity-80">
              <p className="text-[#39ff14]">&gt; INITIALIZING NEURAL_LINK...</p>
              <p className="text-[#39ff14]">&gt; SYNCING RHYTHM_CORE...</p>
              <p className="text-[#39ff14]">&gt; VELOCITY: {(1 + (score / 100)).toFixed(2)}x</p>
              <p className="text-[#ff00ff] animate-pulse">&gt; WARNING: BUFFER_OVERFLOW_NEAR</p>
              <div className="mt-4 pt-4 border-t border-[#39ff14]/20">
                <p className="uppercase tracking-widest mb-2">Instructions:</p>
                <p>ARROW_KEYS: NAVIGATE</p>
                <p>SPACE: REBOOT_SEQUENCE</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel - Game */}
        <main className="col-span-6 bg-black border-2 border-[#ff00ff] relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(255,0,255,0.2)]">
          {/* Static Noise Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <SnakeGame 
            onScoreChange={handleScoreChange} 
            isGameOver={isGameOver}
            setIsGameOver={setIsGameOver}
          />
        </main>

        {/* Right Panel - Music */}
        <aside className="col-span-3 flex flex-col gap-4">
          <div className="bg-black/80 border-2 border-[#00ffff] p-4 flex-1 flex flex-col">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[#888899] mb-4 flex items-center gap-2">
              <Gamepad2 className="w-3 h-3" /> AUDIO_STREAM
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {[
                { id: '01', title: 'NEON_DREAMS.WAV', status: 'PLAYING', color: '#ff00ff' },
                { id: '02', title: 'CYBER_DRIFT.WAV', status: 'QUEUED', color: '#00ffff' },
                { id: '03', title: 'DIGITAL_RAIN.WAV', status: 'QUEUED', color: '#39ff14' },
                { id: '04', title: 'MATRIX_GLITCH.WAV', status: 'LOCKED', color: '#888899' },
              ].map(track => (
                <div key={track.id} className="border border-white/10 p-2 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] opacity-40">{track.id}</span>
                    <span className="text-xs truncate max-w-[120px]">{track.title}</span>
                  </div>
                  <span className="text-[8px] px-1 border" style={{ borderColor: track.color, color: track.color }}>
                    {track.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#00ffff]/20">
              <div className="flex justify-between items-end">
                <div className="text-[10px] uppercase tracking-widest opacity-40">Visualizer_01</div>
                <div className="flex gap-1 h-8 items-end">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 24, 8, 32, 4] }}
                      transition={{ duration: 0.5 + (i * 0.1), repeat: Infinity }}
                      className="w-1 bg-[#ff00ff]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Control Bar */}
      <footer className="h-24 bg-black border-2 border-[#00ffff] z-50 relative">
        <MusicPlayer />
      </footer>

      {/* Screen Tearing Decoration */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-[#ff00ff]/30 animate-[glitch-anim_10s_infinite]"></div>
      <div className="absolute top-3/4 left-0 w-full h-[1px] bg-[#00ffff]/30 animate-[glitch-anim_15s_infinite_reverse]"></div>
    </div>
  );
}


