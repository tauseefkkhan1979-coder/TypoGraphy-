
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TypingArea from './components/TypingArea';
import { AppState, TypingStats, HistoryItem } from './types';
import { LESSONS, TEST_TEXTS } from './constants';
import { generateCustomScript, getAIPerformanceFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.HOME);
  const [activeText, setActiveText] = useState('');
  const [activeTitle, setActiveTitle] = useState('');
  const [lastStats, setLastStats] = useState<TypingStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('typing_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleComplete = async (stats: TypingStats) => {
    setLastStats(stats);
    const newHistoryItem: HistoryItem = {
      ...stats,
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      source: activeTitle
    };
    
    const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('typing_history', JSON.stringify(updatedHistory));
    
    setCurrentScreen(AppState.RESULTS);
    
    // Get AI Feedback
    const feedback = await getAIPerformanceFeedback(stats.wpm, stats.accuracy, stats.mistakes);
    setAiFeedback(feedback);
  };

  const startLesson = (id: string) => {
    const lesson = LESSONS.find(l => l.id === id);
    if (lesson) {
      setActiveText(lesson.content);
      setActiveTitle(lesson.title);
      setCurrentScreen(AppState.PRACTICE);
    }
  };

  const startRandomTest = () => {
    const text = TEST_TEXTS[Math.floor(Math.random() * TEST_TEXTS.length)];
    setActiveText(text);
    setActiveTitle("Random Test");
    setCurrentScreen(AppState.PRACTICE);
  };

  const generateAI = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    const script = await generateCustomScript(aiTopic, 'Intermediate');
    setActiveText(script);
    setActiveTitle(`AI Lab: ${aiTopic}`);
    setIsGenerating(false);
    setCurrentScreen(AppState.PRACTICE);
  };

  const renderContent = () => {
    switch (currentScreen) {
      case AppState.HOME:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header>
              <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
              <p className="text-slate-400">Track your progress and keep sharpening your skills.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Average Speed</p>
                <p className="text-4xl font-bold text-sky-400">
                  {history.length ? Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length) : 0} <span className="text-lg">WPM</span>
                </p>
              </div>
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Top Speed</p>
                <p className="text-4xl font-bold text-emerald-400">
                  {history.length ? Math.max(...history.map(h => h.wpm)) : 0} <span className="text-lg">WPM</span>
                </p>
              </div>
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Tests Taken</p>
                <p className="text-4xl font-bold text-purple-400">{history.length}</p>
              </div>
            </div>

            <section>
              <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-slate-400 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Session</th>
                      <th className="px-6 py-4 font-medium">Speed</th>
                      <th className="px-6 py-4 font-medium">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">No history yet. Start your first lesson!</td>
                      </tr>
                    ) : (
                      history.map(item => (
                        <tr key={item.id} className="hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 text-slate-300 text-sm">{item.date}</td>
                          <td className="px-6 py-4 text-slate-100 font-medium">{item.source}</td>
                          <td className="px-6 py-4 text-sky-400 font-bold mono">{item.wpm} WPM</td>
                          <td className="px-6 py-4 text-emerald-400 font-bold mono">{item.accuracy}%</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        );

      case AppState.LEARN:
        const categories = Array.from(new Set(LESSONS.map(l => l.category)));
        return (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-3xl font-bold mb-2">Tutorials & Lessons</h2>
              <p className="text-slate-400">Master the keyboard one row at a time.</p>
            </header>

            {categories.map(cat => (
              <div key={cat} className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-300 border-b border-slate-800 pb-2">{cat}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LESSONS.filter(l => l.category === cat).map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => startLesson(lesson.id)}
                      className="p-5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all text-left group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 text-xs rounded font-bold uppercase">{lesson.level}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">🚀</span>
                      </div>
                      <h4 className="font-bold text-lg mb-1">{lesson.title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-2">{lesson.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case AppState.TEST:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-sky-500/10 rounded-full flex items-center justify-center text-5xl mb-6">⏱️</div>
            <h2 className="text-4xl font-bold mb-4">Quick Typing Test</h2>
            <p className="text-slate-400 max-w-md mb-10">Test your speed with a randomly selected paragraph. Aim for high accuracy first, then speed.</p>
            <button 
              onClick={startRandomTest}
              className="px-10 py-4 bg-sky-500 hover:bg-sky-600 rounded-2xl font-bold text-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              Start 1-Minute Test
            </button>
          </div>
        );

      case AppState.AI_GEN:
        return (
          <div className="max-w-2xl mx-auto py-20 animate-in fade-in duration-500">
            <header className="text-center mb-10">
              <div className="inline-block p-4 bg-purple-500/10 rounded-2xl text-4xl mb-6">✨</div>
              <h2 className="text-4xl font-bold mb-4">AI Script Generator</h2>
              <p className="text-slate-400">Generate a custom typing script on any topic you like. Want to practice medical terms? Coding syntax? Historical facts?</p>
            </header>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">What do you want to type about?</label>
                <input 
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., Space Exploration, JavaScript, Recipe for Pasta..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <button 
                onClick={generateAI}
                disabled={isGenerating || !aiTopic.trim()}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isGenerating || !aiTopic.trim() 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20'
                }`}
              >
                {isGenerating ? 'Generating Script...' : 'Generate & Start Typing'}
              </button>
            </div>
          </div>
        );

      case AppState.PRACTICE:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <h2 className="text-2xl font-bold mb-6 text-slate-400">{activeTitle}</h2>
            <TypingArea 
              targetText={activeText} 
              onComplete={handleComplete}
              onAbort={() => setCurrentScreen(AppState.HOME)}
            />
          </div>
        );

      case AppState.RESULTS:
        return (
          <div className="max-w-3xl mx-auto py-10 animate-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl font-bold mb-10 text-center">Session Results</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
                <p className="text-slate-500 text-sm mb-1">SPEED</p>
                <p className="text-4xl font-bold text-sky-400 mono">{lastStats?.wpm} <span className="text-sm">WPM</span></p>
              </div>
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
                <p className="text-slate-500 text-sm mb-1">ACCURACY</p>
                <p className="text-4xl font-bold text-emerald-400 mono">{lastStats?.accuracy}%</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
                <p className="text-slate-500 text-sm mb-1">TIME</p>
                <p className="text-4xl font-bold text-purple-400 mono">{lastStats?.timeTaken}s</p>
              </div>
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
                <p className="text-slate-500 text-sm mb-1">ERRORS</p>
                <p className="text-4xl font-bold text-red-500 mono">{lastStats?.mistakes}</p>
              </div>
            </div>

            <div className="p-8 bg-sky-500/10 rounded-3xl border border-sky-500/20 mb-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🤖</div>
               <h4 className="text-sky-400 font-bold uppercase text-sm tracking-widest mb-3">AI Instructor Feedback</h4>
               <p className="text-xl text-slate-200 leading-relaxed italic">
                 {aiFeedback || "Analyzing your performance..."}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setCurrentScreen(AppState.PRACTICE)}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all"
              >
                Try Again
              </button>
              <button 
                onClick={() => setCurrentScreen(AppState.HOME)}
                className="px-8 py-3 bg-sky-500 hover:bg-sky-600 rounded-xl font-bold transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar current={currentScreen} onNavigate={setCurrentScreen} />
      <main className="flex-1 p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
