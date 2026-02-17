
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypingStats } from '../types';

interface TypingAreaProps {
  targetText: string;
  onComplete: (stats: TypingStats) => void;
  onAbort: () => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ targetText, onComplete, onAbort }) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateStats = useCallback((currentInput: string, currentStartTime: number): TypingStats => {
    const timeInMinutes = (Date.now() - currentStartTime) / 60000;
    const totalChars = currentInput.length;
    let correctChars = 0;
    
    for (let i = 0; i < totalChars; i++) {
      if (currentInput[i] === targetText[i]) {
        correctChars++;
      }
    }

    const wpm = timeInMinutes > 0 ? Math.round((correctChars / 5) / timeInMinutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    return {
      wpm,
      accuracy,
      timeTaken: Math.round(timeInMinutes * 60),
      correctChars,
      totalChars,
      mistakes
    };
  }, [targetText, mistakes]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      if (e.key === 'Escape') onAbort();
      return;
    }

    // Ignore non-character keys
    if (e.key.length > 1 && e.key !== 'Backspace') return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(prev => {
      let nextInput = prev;
      if (e.key === 'Backspace') {
        nextInput = prev.slice(0, -1);
      } else if (prev.length < targetText.length) {
        const char = e.key;
        if (char !== targetText[prev.length]) {
          setMistakes(m => m + 1);
        }
        nextInput = prev + char;
      }

      if (nextInput.length === targetText.length && startTime) {
        onComplete(calculateStats(nextInput, startTime));
      }

      return nextInput;
    });
  }, [startTime, targetText, calculateStats, onComplete, onAbort]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const stats = startTime ? calculateStats(userInput, startTime) : { wpm: 0, accuracy: 100 };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-10">
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Speed</span>
            <span className="text-4xl font-bold text-sky-400 mono">{stats.wpm} <span className="text-sm">WPM</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Accuracy</span>
            <span className="text-4xl font-bold text-emerald-400 mono">{stats.accuracy}%</span>
          </div>
        </div>
        <button 
          onClick={onAbort}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors text-sm"
        >
          Esc to Exit
        </button>
      </div>

      <div 
        ref={containerRef}
        className="mono text-2xl leading-relaxed relative min-h-[200px] select-none outline-none"
      >
        {targetText.split('').map((char, index) => {
          let className = "text-slate-500";
          if (index < userInput.length) {
            className = userInput[index] === char ? "text-slate-100" : "text-red-500 bg-red-500/20 rounded-sm";
          }
          
          return (
            <span key={index} className={`${className} transition-colors duration-75`}>
              {index === userInput.length && <span className="caret-custom" />}
              {char}
            </span>
          );
        })}
      </div>
      
      <div className="mt-8 text-slate-500 text-sm text-center italic">
        Keep typing. Your speed and accuracy are calculated in real-time.
      </div>
    </div>
  );
};

export default TypingArea;
