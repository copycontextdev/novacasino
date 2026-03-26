import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SlotMachineLoaderProps {
  appName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

const SYMBOLS = ['🎲', '♠️', '♥️', '🪙', '⭐', '✨', '7', '🎰', '💎', '🃏'];

const Reel = ({ 
  spinning, 
  delay, 
  targetSymbol,
  primaryColor,
  secondaryColor 
}: { 
  spinning: boolean; 
  delay: number; 
  targetSymbol: string;
  primaryColor: string;
  secondaryColor: string;
}) => {
  const [displaySymbols, setDisplaySymbols] = useState<string[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 60 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    setDisplaySymbols(initial);
  }, []);

  return (
    <div className="relative flex-1 min-w-[25px] max-w-[60px] h-20 sm:h-32 md:h-44 bg-[#050505] overflow-hidden flex flex-col items-center border-x border-white/5">
      {/* Scanline Effect */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 overflow-hidden">
        <div className="w-full h-1 bg-white/30 animate-scanline" />
      </div>

      <motion.div
        animate={spinning ? { y: [-3000, 0] } : { y: 0 }}
        transition={{
          duration: 1.2,
          repeat: spinning ? Infinity : 0,
          ease: "linear",
          delay: delay
        }}
        className="flex flex-col gap-4 sm:gap-10 py-4 sm:py-8"
      >
        {displaySymbols.map((s, i) => (
          <div key={i} className="text-lg sm:text-2xl md:text-3xl h-8 sm:h-12 md:h-16 flex items-center justify-center opacity-10 grayscale">
            {s}
          </div>
        ))}
      </motion.div>
      
      {!spinning && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-10"
        >
          <span 
            className="text-xl sm:text-4xl md:text-6xl font-black text-center leading-tight italic"
            style={{ 
              background: `linear-gradient(to right, ${primaryColor} 45%, ${secondaryColor} 55%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 10px ${primaryColor})`
            }}
          >
            {targetSymbol}
          </span>
        </motion.div>
      )}

      {/* Curved Glass Effect */}
      <div className="absolute inset-0 pointer-events-none glass-curve z-30" />
      
      {/* Neon Glow Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 z-25"
        style={{ background: `linear-gradient(to bottom, ${primaryColor}33, transparent, ${secondaryColor}33)` }}
      />
    </div>
  );
};

const CosmicBackground = ({ primaryColor, secondaryColor, accentColor }: { primaryColor: string; secondaryColor: string; accentColor: string }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Glowing Planet/Moon */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full blur-[60px] sm:blur-[80px]" 
        style={{ background: `radial-gradient(circle, ${accentColor}4D, ${primaryColor}1A, transparent)` }}
      />
      
      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-star"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2}px`,
            height: `${Math.random() * 2}px`,
            '--duration': `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`
          } as React.CSSProperties}
        />
      ))}

      {/* Floating Logo Elements */}
      <div className="hidden sm:block">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] text-4xl md:text-6xl opacity-20 blur-[1px]"
        >
          🃏
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[15%] text-5xl md:text-7xl opacity-15 blur-[2px]"
        >
          🎲
        </motion.div>
      </div>

      {/* Cosmic Dust/Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 blur-[80px] sm:blur-[120px] rounded-full opacity-20" style={{ backgroundColor: secondaryColor }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 blur-[80px] sm:blur-[120px] rounded-full opacity-20" style={{ backgroundColor: primaryColor }} />
    </div>
  );
};

export const SlotMachineLoader = ({
  appName = "NovaCasino",
  primaryColor = "#ff00ff",
  secondaryColor = "#00ffff",
  accentColor = "#9d00ff"
}: SlotMachineLoaderProps) => {
  const [phase, setPhase] = useState<'idle' | 'pulling' | 'spinning' | 'revealing' | 'done'>('idle');
  const targetChars = appName.split("");

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setPhase('idle');
        await new Promise(r => setTimeout(r, 1000));
        setPhase('pulling');
        await new Promise(r => setTimeout(r, 600));
        setPhase('spinning');
        await new Promise(r => setTimeout(r, 2500));
        setPhase('revealing');
        await new Promise(r => setTimeout(r, 2000));
        setPhase('done');
        await new Promise(r => setTimeout(r, 1500));
      }
    };
    sequence();
  }, [appName]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden p-2 sm:p-4">
      <CosmicBackground primaryColor={primaryColor} secondaryColor={secondaryColor} accentColor={accentColor} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={phase === 'done' ? 
          { opacity: 0, scale: 1.1, filter: 'blur(20px)' } : 
          { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-5xl flex justify-center"
      >
        {/* The Machine Body */}
        <div 
          className="relative machine-case p-1 sm:p-2 rounded-xl w-full"
          style={{ 
            boxShadow: `0 0 100px ${accentColor}33`,
            border: `2px solid ${accentColor}66`
          }}
        >
          
          {/* Reels Section */}
          <div className="relative flex p-1 sm:p-3 bg-black rounded-lg border-[4px] sm:border-[8px] border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Rivets */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: secondaryColor }} />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: primaryColor }} />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: primaryColor }} />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: secondaryColor }} />

            {targetChars.map((char, index) => (
              <React.Fragment key={index}>
                <Reel 
                  spinning={phase === 'spinning'} 
                  delay={index * 0.05} 
                  targetSymbol={char}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
                {index < targetChars.length - 1 && (
                  <div className="relative w-1 sm:w-2 md:w-4 flex flex-col justify-between py-2 z-30">
                    <div className="absolute inset-0 metal-gradient border-x border-black/60" />
                    <div className="absolute inset-0 opacity-10 blur-md pointer-events-none" style={{ backgroundColor: accentColor }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Handlebar */}
          <div className="absolute -right-6 sm:-right-16 md:-right-24 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div 
              className="w-2 sm:w-6 md:w-10 h-16 sm:h-32 md:h-48 bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-black rounded-full border border-white/10"
              style={{ borderColor: `${accentColor}4D` }}
            />
            <motion.div
              animate={phase === 'pulling' ? { y: [0, 30, 0] } : {}}
              transition={{ duration: 0.6, ease: "backInOut" }}
              className="absolute top-0 -translate-y-1/2"
            >
              <div 
                className="w-6 h-6 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-gradient-to-br rounded-full border sm:border-4 border-white/20 flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, ${accentColor})`,
                  boxShadow: `0 0 30px ${primaryColor}99`
                }}
              >
                <div className="w-3 h-3 sm:w-6 sm:h-6 md:w-10 md:h-10 bg-white/30 rounded-full blur-sm" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Jackpot Flash Effect */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.3, repeat: 3 }}
              className="absolute inset-0 bg-white z-50 pointer-events-none rounded-xl mix-blend-overlay"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 1, 0],
              x: `${(Math.random() * 40 - 20) + (i * 100/15)}vw`
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute w-1 h-1 rounded-full blur-[1px]"
            style={{ 
              backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
              boxShadow: `0 0 10px ${i % 2 === 0 ? primaryColor : secondaryColor}`
            }}
          />
        ))}
      </div>
    </div>
  );
};
