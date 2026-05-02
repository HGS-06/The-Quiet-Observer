import React, { useState, useEffect, useRef } from 'react';
import { 
  User,
  X, 
  Cloud, 
  Clock, 
  Tag, 
  Plus, 
  Menu, 
  BookOpen, 
  Edit3, 
  BarChart2, 
  Search, 
  Settings, 
  Lock, 
  Fingerprint, 
  Delete, 
  Unlock, 
  Hourglass, 
  CheckCircle, 
  Wind,
  Heart,
  TrendingUp,
  Brain,
  Info,
  Calendar,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import { MOCK_ENTRIES, MOCK_CAPSULES, MOOD_TREND_DATA, MOOD_DISTRIBUTION } from './data';
import { Screen, Mood, JournalEntry } from './types';

// --- Components ---

const TopBar = ({ 
  title, 
  onClose, 
  showSaved = false, 
  onMenu,
  userName = '',
  userImage = ''
}: { 
  title: string; 
  onClose?: () => void; 
  showSaved?: boolean; 
  onMenu?: () => void;
  userName?: string;
  userImage?: string;
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-indigo-800/80 backdrop-blur-xl border-b border-white/5 w-full sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-[680px] mx-auto">
        <div className="flex items-center gap-4">
          {onClose && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="text-indigo-300 hover:bg-white/5 transition-all p-2 rounded-full"
            >
              <X size={20} />
            </motion.button>
          )}
          {onMenu && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMenu} 
              className="text-indigo-300 hover:bg-white/5 transition-all p-2 rounded-full"
            >
              <Menu size={20} />
            </motion.button>
          )}
          {!isSearchActive && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-indigo-100 text-lg font-medium tracking-wide"
            >
              {title}
            </motion.h1>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isSearchActive && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 150, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-white/5 border-none rounded-full px-4 py-1 text-xs text-indigo-100 focus:outline-none focus:ring-1 ring-indigo-400/30"
                autoFocus
              />
            )}
          </AnimatePresence>

          {showSaved && !isSearchActive && (
            <div className="flex items-center gap-2">
              <Cloud className="text-indigo-400/60" size={14} />
              <span className="font-sans text-indigo-400/60 uppercase tracking-[0.2em] text-[10px] font-bold">Saved</span>
            </div>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchActive(!isSearchActive)}
            className={cn(
              "text-indigo-300 hover:bg-white/5 transition-all p-2 rounded-full",
              isSearchActive && "bg-white/10"
            )}
          >
            {isSearchActive ? <X size={20} /> : <Search size={20} />}
          </motion.button>

          {userName && !isSearchActive && (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-500/20 bg-indigo-600/40 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
              {userImage ? (
                <img 
                  src={userImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(userName)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ activeScreen, setScreen }: { activeScreen: Screen; setScreen: (s: Screen) => void }) => {
  const tabs: { screen: Screen; icon: any; label: string }[] = [
    { screen: 'CHRONICLE', icon: BookOpen, label: 'History' },
    { screen: 'WRITING', icon: Edit3, label: 'New' },
    { screen: 'INSIGHTS', icon: BarChart2, label: 'Insights' },
    { screen: 'CAPSULES', icon: Hourglass, label: 'Capsules' },
    { screen: 'REFRAMING', icon: Brain, label: 'Tools' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-indigo-800/90 backdrop-blur-2xl border-t border-white/5 rounded-t-[32px] md:max-w-[680px] md:mx-auto">
      <div className="flex justify-around items-center px-4 pb-8 pt-4">
        {tabs.map(({ screen, icon: Icon, label }) => (
          <button
            key={screen}
            onClick={() => setScreen(screen)}
            className={cn(
              "p-3 transition-all duration-300 rounded-full",
              activeScreen === screen 
                ? "text-indigo-100 bg-white/5 shadow-[0_0_15px_rgba(165,180,252,0.2)]" 
                : "text-indigo-400/40 hover:text-indigo-200"
            )}
          >
            <Icon size={24} fill={activeScreen === screen ? "currentColor" : "none"} />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// --- Screens ---

const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [pin, setPin] = useState<string>('');
  
  const handleNum = (n: number) => {
    if (pin.length < 4) setPin(prev => prev + n);
  };

  useEffect(() => {
    if (pin === '1234') {
      onUnlock();
    } else if (pin.length === 4) {
      setTimeout(() => setPin(''), 500);
    }
  }, [pin, onUnlock]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-2xl mx-auto mb-6 border border-white/10">
          <Lock className="text-primary" fill="currentColor" size={24} />
        </div>
        <h1 className="font-serif text-3xl mb-1">The Quiet Observer</h1>
        <p className="text-indigo-300/60 uppercase tracking-widest text-xs font-bold">Your thoughts are private</p>
      </motion.div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              pin.length > i ? "bg-primary shadow-[0_0_8px_rgba(193,195,237,0.5)]" : "bg-indigo-700"
            )} 
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button 
            key={n}
            onClick={() => handleNum(n)}
            className="w-16 h-16 text-2xl font-serif text-primary bg-indigo-700/30 rounded-full flex items-center justify-center transition-all active:scale-90"
          >
            {n}
          </button>
        ))}
        <button className="w-16 h-16 bg-indigo-700/30 rounded-full flex items-center justify-center text-primary active:scale-90">
          <Fingerprint size={24} />
        </button>
        <button 
          onClick={() => handleNum(0)}
          className="w-16 h-16 text-2xl font-serif text-primary bg-indigo-700/30 rounded-full flex items-center justify-center active:scale-90"
        >
          0
        </button>
        <button 
          onClick={() => setPin(prev => prev.slice(0, -1))}
          className="w-16 h-16 bg-indigo-700/30 rounded-full flex items-center justify-center text-primary active:scale-90"
        >
          <Delete size={24} />
        </button>
      </div>

      <button 
        onClick={() => alert('Hint: The default PIN is 1234')}
        className="mt-12 text-indigo-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
      >
        Forgot PIN?
      </button>
    </div>
  );
};

const Chronicle = ({ entries, onAddEntry }: { entries: JournalEntry[], onAddEntry: () => void }) => (
  <div className="pb-32 px-6 pt-10">
    <section className="mb-10">
      <p className="text-secondary tracking-widest uppercase font-bold text-xs mb-2">Chronicle</p>
      <h2 className="font-serif text-3xl mb-4">Your Journey</h2>
      <p className="text-on-surface-variant font-sans leading-relaxed">
        Reflect on the evolution of your thoughts. Every entry is a step toward clarity.
      </p>
    </section>

    <div className="space-y-6">
      {entries.map((entry, idx) => (
        <React.Fragment key={entry.id}>
          {idx === 2 && (
            <div className="py-6 flex items-center gap-4">
              <div className="h-[1px] flex-grow bg-white/5"></div>
              <span className="text-indigo-400/40 uppercase tracking-[0.2em] text-[10px] font-bold whitespace-nowrap">Earlier this month</span>
              <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
          )}
          <motion.article 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => alert(`Entry: ${entry.title}\n\n${entry.content}`)}
            className="group glass-panel p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700/60 cursor-pointer border-l-4 border-emerald-400/40"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-indigo-300/60 font-bold text-[10px]">{entry.date}</span>
                <h3 className="font-serif text-xl mt-1 text-indigo-100">{entry.title}</h3>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
            <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">
              {entry.content}
            </p>
            <div className="mt-4 flex gap-2">
              {entry.tags.map(tag => (
                <span key={tag} className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold lowercase">#{tag}</span>
              ))}
            </div>
          </motion.article>
        </React.Fragment>
      ))}
    </div>

    <button 
      onClick={onAddEntry}
      className="fixed bottom-28 right-8 md:right-[calc(50%-320px)] w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
    >
      <Plus size={28} />
    </button>
  </div>
);

const WritingRoom = ({ onCommit }: { onCommit: (content: string, mood: Mood) => void }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('calm');
  
  const moods: { type: Mood; color: string }[] = [
    { type: 'calm', color: 'bg-indigo-400' },
    { type: 'joy', color: 'bg-yellow-400' },
    { type: 'melancholy', color: 'bg-blue-500' },
    { type: 'energy', color: 'bg-rose-400' },
    { type: 'balance', color: 'bg-emerald-400' },
  ];

  return (
    <div className="pb-40 px-8 pt-10">
      <section className="mb-10 text-center md:text-left">
        <p className="text-primary/60 uppercase tracking-widest font-bold text-xs mb-2">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <h2 className="font-serif text-3xl mb-12">Midnight Reflections</h2>
        
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="text-primary/40 uppercase tracking-widest text-[9px] font-bold">Current Resonance</span>
          <div className="flex gap-4 items-center">
            {moods.map(m => (
              <button 
                key={m.type}
                onClick={() => setMood(m.type)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 border",
                  mood === m.type ? "border-white/20 bg-white/5" : "border-transparent opacity-40"
                )}
              >
                <div className={cn("w-3 h-3 rounded-full", m.color, mood === m.type && "shadow-[0_0_10px_currentColor]")} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12 relative h-full">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How are you feeling today?"
          className="writing-area w-full min-h-[400px] bg-transparent border-none p-0 font-serif text-2xl leading-relaxed resize-none focus:outline-none placeholder:italic"
          spellCheck={false}
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 text-secondary rounded-full text-[10px] font-bold">
          <Tag size={12} /> SOLITUDE
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 text-secondary rounded-full text-[10px] font-bold">
          <Tag size={12} /> CREATIVITY
        </div>
        <button 
          onClick={() => {
            const tag = prompt('Enter a new theme:');
            if (tag) alert(`Theme #${tag} added (visual only for now)`);
          }}
          className="flex items-center gap-1 px-3 py-1 border border-primary/20 text-primary/40 rounded-full text-[10px] font-bold hover:bg-white/5 transition-all"
        >
          <Plus size={12} /> ADD THEME
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="w-full max-w-[680px] mx-auto px-6 pb-12 flex justify-between items-end">
          <div className="flex items-center gap-6 text-indigo-400/40 text-[10px] font-bold uppercase tracking-[0.2em] pointer-events-auto">
            <div className="flex flex-col">
              <span className="text-[8px] opacity-50">Words</span>
              <span className="text-xs">{content.split(/\s+/).filter(Boolean).length}</span>
            </div>
            <div className="flex flex-col border-l border-white/5 pl-6">
              <span className="text-[8px] opacity-50">Read Time</span>
              <span className="text-xs">{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min</span>
            </div>
          </div>
          <button 
            onClick={() => onCommit(content, mood)}
            disabled={!content.trim()}
            className="pointer-events-auto group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-full shadow-2xl hover:shadow-indigo-500/20 transition-all font-bold tracking-widest text-[11px] text-white overflow-hidden disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">COMMIT TO HISTORY</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Insights = ({ trendData, distData }: { trendData: any[], distData: any[] }) => (
  <div className="px-6 pt-10 pb-32">
    <section className="mb-10">
      <h2 className="font-serif text-3xl mb-4">Weekly Reflections</h2>
      <div className="glass-panel p-6 rounded-3xl shadow-xl">
        <p className="text-primary italic font-serif leading-relaxed italic">"You felt calm most days this week."</p>
        <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">
          Your emotional baseline is centering around tranquility, showing a 12% increase from last week.
        </p>
      </div>
    </section>

    <section className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-tertiary uppercase tracking-widest font-bold text-[10px]">Mood Trend</span>
          <h3 className="font-serif text-2xl mt-1 text-indigo-100">Past 7 Days</h3>
        </div>
        <div className="text-right">
          <span className="text-secondary text-2xl font-serif">Stability</span>
        </div>
      </div>
      <div className="glass-panel p-8 rounded-[32px] h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c1c3ed" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#c1c3ed" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1B2E', border: 'none', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ color: '#c1c3ed' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#c1c3ed" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#moodGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-between px-2 mt-4 text-[9px] uppercase font-bold tracking-tighter text-indigo-400/40">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-[32px] md:col-span-2">
        <div className="mb-6">
          <span className="text-tertiary uppercase tracking-widest font-bold text-[10px]">Distribution</span>
          <h3 className="font-serif text-2xl mt-1 text-indigo-100">Monthly Balance</h3>
        </div>
        <div className="flex items-end justify-between h-32 gap-3 px-4">
          {distData.map(m => (
            <div key={m.name} className="flex flex-col items-center flex-1 group">
              <div 
                className={cn("w-full rounded-t-xl transition-all duration-700 opacity-20 group-hover:opacity-60", m.color)} 
                style={{ height: `${m.value}%` }} 
              />
              <span className="text-[9px] mt-2 text-indigo-400/60 font-bold uppercase tracking-widest">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[32px] space-y-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Brain className="text-primary" size={20} />
        </div>
        <p className="text-sm leading-relaxed text-indigo-100">
          Writing about <span className="text-tertiary font-bold">#nature</span> correlates with your highest focus scores.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-[32px] space-y-4 flex flex-col justify-between">
        <div>
          <span className="text-tertiary uppercase tracking-widest font-bold text-[10px]">Flow</span>
          <p className="font-serif text-2xl mt-1 text-indigo-100">128 Days</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border border-indigo-700 flex items-center justify-center">
              <CheckCircle size={14} className="text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Capsules = ({ capsules, onUnlock, onSeal }: { capsules: TimeCapsule[], onUnlock: (id: string) => void, onSeal: () => void }) => (
  <div className="px-6 pt-10 pb-32">
    <section className="mb-10 text-center">
      <h2 className="font-serif text-3xl text-primary mb-2">Time Capsules</h2>
      <p className="text-on-surface-variant text-sm max-w-xs mx-auto">Patient reflections preserved for your future self.</p>
    </section>

    <div className="grid gap-6">
      {capsules.filter(c => c.isUnlocked).map(c => (
        <motion.div 
          key={c.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-8 relative overflow-hidden border-emerald-400/20"
        >
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-emerald-400 text-emerald-950 rounded-full font-bold text-[10px] uppercase">Unlocked</span>
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <h3 className="font-serif text-2xl mb-2">{c.title}</h3>
            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">{c.description}</p>
            <div className="p-4 bg-white/5 rounded-xl italic text-indigo-200/80 text-sm">
              "This is where your past self's message would appear..."
            </div>
          </div>
        </motion.div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capsules.filter(c => !c.isUnlocked).map(c => (
          <div key={c.id} className="glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                  <Lock size={16} className="text-indigo-400" />
                </div>
                <span className="text-tertiary font-bold text-[10px]">{c.theme}</span>
              </div>
              <h4 className="font-serif text-lg text-indigo-100">{c.title}</h4>
              <p className="text-[10px] text-indigo-400/40 uppercase tracking-widest font-bold mt-1">Locked</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5">
              <p className="text-indigo-300 text-sm font-bold">{c.unlockDate.includes('days') || c.unlockDate.includes('In') ? c.unlockDate : `Opens on ${c.unlockDate}`}</p>
              <button 
                onClick={() => onUnlock(c.id)}
                className="mt-4 w-full py-2 bg-indigo-600/50 hover:bg-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Attempt Unlock
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-10 flex flex-col items-center text-center mt-6">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Edit3 size={28} className="text-primary" />
        </div>
        <h4 className="font-serif text-2xl text-indigo-100 mb-3">Leave a Message for the Future</h4>
        <p className="text-on-surface-variant text-sm mb-8 leading-relaxed max-w-sm">Capture a feeling or a hope. We'll keep it safe until you're ready to remember.</p>
        <button 
          onClick={onSeal}
          className="px-8 py-3 rounded-full border border-indigo-400/30 text-indigo-300 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
        >
          Seal New Memory
        </button>
      </div>
    </div>
  </div>
);

const ReframingTool = ({ onCommit }: { onCommit: (thought: string, reframed: string) => void }) => {
  const [thought, setThought] = useState("I feel like I'm not making enough progress and everyone is ahead of me...");
  const [reframed, setReframed] = useState("");

  return (
    <div className="px-6 pt-10 pb-32">
      <section className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/30 text-primary mb-6">
          <Brain size={16} />
          <span className="font-bold text-[10px] uppercase tracking-widest">Cognitive Tools</span>
        </div>
        <h2 className="font-serif text-3xl mb-4 text-indigo-100">Reframing a Thought</h2>
        <p className="text-on-surface-variant leading-relaxed">
          Examine a difficult thought through different lenses. This practice helps soften the edges of our internal narrative.
        </p>
      </section>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
          <label className="text-tertiary uppercase tracking-widest font-bold text-[10px] block mb-4">The Initial Thought</label>
          <textarea 
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            className="w-full bg-indigo-900/50 rounded-xl p-4 italic text-on-surface-variant leading-relaxed focus:outline-none focus:ring-1 ring-primary/30 min-h-[100px]"
          />
        </div>

        <div className="flex items-center justify-between mb-4 mt-8">
          <h3 className="font-serif text-xl text-indigo-100">Alternative Perspectives</h3>
          <span className="text-indigo-400/40 text-[10px] font-bold">3 AVAILABLE</span>
        </div>

        {[
          { title: 'Future You', prompt: '"What would you tell yourself from a year in the future? How important will this moment feel then?"', color: 'bg-indigo-400' },
          { title: 'A Close Friend', prompt: '"If your dearest friend came to you with this thought, what kind words would you offer them?"', color: 'bg-secondary' },
          { title: 'Neutral Observer', prompt: '"Stripping away the emotion, what are the objective facts of this situation?"', color: 'bg-tertiary' }
        ].map((p, i) => (
          <div key={p.title} className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className={cn("absolute top-0 left-0 w-1 h-full", p.color)} />
            <div className="flex flex-col gap-4">
              <h4 className={cn("font-serif text-xl", i === 0 ? "text-indigo-200" : i === 1 ? "text-secondary" : "text-tertiary")}>{p.title}</h4>
              <p className="text-sm italic opacity-60 leading-relaxed">{p.prompt}</p>
              <textarea 
                placeholder="Write your response..." 
                className="w-full bg-transparent border-b border-white/10 p-0 py-2 focus:outline-none focus:border-primary/50 text-sm"
                onChange={(e) => {
                  if (i === 0) setReframed(e.target.value);
                }}
              />
            </div>
          </div>
        ))}

        <div className="pt-8 flex flex-col items-center">
          <button 
            onClick={() => onCommit(thought, reframed || "I am growing at my own pace.")}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold tracking-widest uppercase text-[11px] shadow-xl shadow-indigo-950/20 active:scale-95 transition-all"
          >
            Commit to New Narrative
          </button>
          <p className="mt-6 text-indigo-400/40 text-[10px] font-bold text-center max-w-[400px]">Reframing expands the context. Well done for taking this step.</p>
        </div>
      </div>
    </div>
  );
};

const BreathingSpace = ({ bpm, onEnd }: { bpm: number, onEnd: () => void }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const pTimer = setInterval(() => {
      setPhase(p => p === 'Inhale' ? 'Hold' : p === 'Hold' ? 'Exhale' : 'Inhale');
    }, 4000);
    
    const sTimer = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => {
      clearInterval(pTimer);
      clearInterval(sTimer);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-20 w-full max-w-[500px]">
        <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
              <Info size={20} />
            </div>
            <div>
              <p className="text-red-400 uppercase tracking-widest font-bold text-[9px]">Stress Detected</p>
              <p className="text-xs text-on-surface-variant">Elevated heart rate. Let's breathe.</p>
            </div>
          </div>
          <button 
            onClick={onEnd}
            className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all active:scale-95"
          >
            I'm Okay
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[400px] aspect-square">
        <motion.div 
          animate={{ scale: phase === 'Inhale' ? 1.5 : phase === 'Hold' ? 1.5 : 0.8 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ scale: phase === 'Inhale' ? 1.2 : phase === 'Hold' ? 1.2 : 0.6 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="z-10 text-center"
        >
          <span className="font-serif text-5xl text-primary block mb-4">{phase}</span>
          <div className="w-2 h-2 rounded-full bg-primary/40 mx-auto" />
        </motion.div>
        
        <div className="absolute bottom-4 opacity-40 uppercase tracking-widest text-[10px] font-bold text-indigo-400">
          4 - 7 - 8 Technique
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[400px] mt-12">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
          <Heart size={20} className="text-rose-400 mb-2" />
          <span className="text-[9px] text-indigo-400/40 uppercase font-bold tracking-widest">Heart Rate</span>
          <span className="font-serif text-2xl">{bpm} BPM</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
          <Clock size={20} className="text-tertiary mb-2" />
          <span className="text-[9px] text-indigo-400/40 uppercase font-bold tracking-widest">Session</span>
          <span className="font-serif text-2xl">{formatTime(timer)}</span>
        </div>
      </div>
    </div>
  );
};

const ProfileScreen = ({ 
  userName, 
  setUserName, 
  userImage, 
  setUserImage,
  entryCount
}: { 
  userName: string, 
  setUserName: (n: string) => void,
  userImage: string,
  setUserImage: (i: string) => void,
  entryCount: number
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="px-8 pt-10 pb-32 flex flex-col items-center">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/20 mb-6 shadow-2xl bg-indigo-900 flex items-center justify-center text-3xl font-serif text-white uppercase">
          {userImage ? (
            <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span>{getInitials(userName)}</span>
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
        >
          <Edit3 size={20} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageChange}
        />
      </div>

      <div className="flex items-center gap-3 mb-2">
        {isEditing ? (
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="bg-white/5 border-b border-indigo-400 text-center font-serif text-3xl text-indigo-100 focus:outline-none"
            autoFocus
          />
        ) : (
          <h2 className="font-serif text-3xl text-indigo-100">{userName || 'Set Name'}</h2>
        )}
        <button onClick={() => setIsEditing(!isEditing)} className="text-indigo-400 hover:text-white">
          <Edit3 size={16} />
        </button>
      </div>
      
      <p className="text-indigo-400 uppercase tracking-widest text-[10px] font-bold mb-12">
        Quiet Observer since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      </p>
      
      <div className="w-full space-y-4">
        <div className="glass-panel p-6 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-[10px] text-indigo-400/40 uppercase font-bold tracking-widest">Total Reflections</p>
            <p className="font-serif text-2xl">{entryCount}</p>
          </div>
          <BookOpen className="text-indigo-400/20" size={32} />
        </div>
        <div className="glass-panel p-6 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-[10px] text-indigo-400/40 uppercase font-bold tracking-widest">Mindfulness Streak</p>
            <p className="font-serif text-2xl">{entryCount > 0 ? '1 Day' : '0 Days'}</p>
          </div>
          <TrendingUp className="text-indigo-400/20" size={32} />
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = () => (
  <div className="px-8 pt-10 pb-32">
    <h2 className="font-serif text-3xl mb-8 text-indigo-100">Settings</h2>
    <div className="space-y-6">
      {[
        { label: 'Appearance', desc: 'Dark Mode, Glassmorphism level', icon: Waves },
        { label: 'Security', desc: 'Change PIN, Biometric lock', icon: Lock },
        { label: 'Notifications', desc: 'Reminder to reflect, Breath prompts', icon: Clock },
        { label: 'Data', desc: 'Export reflections, Sync status', icon: Cloud }
      ].map(s => (
        <button key={s.label} className="w-full glass-panel p-6 rounded-2xl flex items-center gap-6 hover:bg-white/5 transition-all text-left">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-300">
            <s.icon size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-indigo-100">{s.label}</p>
            <p className="text-xs text-indigo-400/60 mt-1">{s.desc}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const AboutScreen = () => (
  <div className="px-8 pt-10 pb-32 text-center">
    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/10">
      <Hourglass className="text-primary" size={32} />
    </div>
    <h2 className="font-serif text-3xl mb-2 text-indigo-100">The Quiet Observer</h2>
    <p className="text-indigo-400/60 text-xs mb-12 italic">v1.2.4 "Midnight Solitude"</p>
    <div className="glass-panel p-8 rounded-3xl text-left space-y-6 leading-relaxed">
      <p className="text-sm text-indigo-200/80">
        This space is designed for the modern seeker. In a world of constant noise, we provide a sanctuary for your most private thoughts.
      </p>
      <p className="text-sm text-indigo-200/80">
        Your data is encrypted and remains strictly yours. We believe that true reflection requires a sense of complete safety.
      </p>
      <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-indigo-400/40 uppercase tracking-widest">
        <span>Google DeepMind Agentic Coding</span>
        <span>2026</span>
      </div>
    </div>
  </div>
);

const PrivacyScreen = () => (
  <div className="px-8 pt-10 pb-32">
    <h2 className="font-serif text-3xl mb-8 text-indigo-100">Privacy & Safety</h2>
    <div className="glass-panel p-8 rounded-3xl space-y-8">
      <div className="flex gap-6">
        <Fingerprint className="text-indigo-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-sm text-indigo-100 mb-2 uppercase tracking-wide">End-to-End Encryption</h4>
          <p className="text-xs text-indigo-300/60 leading-relaxed">Every word you write is encrypted on your device. Not even we can read your reflections.</p>
        </div>
      </div>
      <div className="flex gap-6">
        <Lock className="text-indigo-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-sm text-indigo-100 mb-2 uppercase tracking-wide">Auto-Lock Timer</h4>
          <p className="text-xs text-indigo-300/60 leading-relaxed">The app automatically locks after 2 minutes of inactivity to ensure your privacy in any environment.</p>
        </div>
      </div>
      <div className="flex gap-6">
        <Cloud className="text-indigo-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-sm text-indigo-100 mb-2 uppercase tracking-wide">Private Sync</h4>
          <p className="text-xs text-indigo-300/60 leading-relaxed">Cloud synchronization uses your own private drive space, ensuring third-party access is impossible.</p>
        </div>
      </div>
    </div>
  </div>
);

const SideMenu = ({ isOpen, onClose, onNavigate }: { isOpen: boolean, onClose: () => void, onNavigate: (s: Screen) => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        />
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 bottom-0 w-[280px] bg-indigo-900 shadow-2xl z-[101] p-8 flex flex-col"
        >
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-2xl">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
          </div>
          
          <nav className="flex flex-col gap-6">
            {[
              { icon: User, label: 'Profile', screen: 'PROFILE' },
              { icon: Settings, label: 'Settings', screen: 'SETTINGS' },
              { icon: Lock, label: 'Privacy', screen: 'PRIVACY' },
              { icon: Info, label: 'About', screen: 'ABOUT' }
            ].map(item => (
              <button 
                key={item.label}
                className="flex items-center gap-4 text-indigo-200 hover:text-white transition-colors group"
                onClick={() => {
                  onNavigate(item.screen as Screen);
                  onClose();
                }}
              >
                <div className="p-2 bg-white/5 rounded-xl group-hover:bg-indigo-600/30 transition-all">
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-sm tracking-wide uppercase">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-auto pt-8 border-t border-white/5">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 hover:text-red-400 transition-all"
            >
              Lock Application
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function App() {
  const [screen, setScreen] = useState<Screen>('LOCK');
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [capsules, setCapsules] = useState(MOCK_CAPSULES);
  const [moodTrend, setMoodTrend] = useState(MOOD_TREND_DATA);
  const [moodDist, setMoodDist] = useState(MOOD_DISTRIBUTION);
  const [bpm, setBpm] = useState(82);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('User Name');
  const [userImage, setUserImage] = useState('');

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update mood trend with random fluctuations
      setMoodTrend(prev => prev.map(d => ({
        ...d,
        value: Math.max(10, Math.min(100, d.value + (Math.random() * 10 - 5)))
      })));

      // Update mood distribution slightly
      setMoodDist(prev => prev.map(d => ({
        ...d,
        value: Math.max(5, Math.min(95, d.value + (Math.random() * 4 - 2)))
      })));

      // Update BPM
      setBpm(prev => Math.floor(70 + Math.random() * 20));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addEntry = (entry: JournalEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const unlockCapsule = (id: string) => {
    setCapsules(prev => prev.map(c => c.id === id ? { ...c, isUnlocked: true } : c));
  };

  if (screen === 'LOCK') {
    return <LockScreen onUnlock={() => setScreen('CHRONICLE')} />;
  }

  if (screen === 'BREATHING') {
    return <BreathingSpace bpm={bpm} onEnd={() => setScreen('CHRONICLE')} />;
  }

  return (
    <div className="min-h-screen pb-40">
      <TopBar 
        title={
          screen === 'PROFILE' ? 'Your Profile' :
          screen === 'SETTINGS' ? 'Preferences' :
          screen === 'ABOUT' ? 'The Story' :
          screen === 'PRIVACY' ? 'Privacy' :
          'The Quiet Observer'
        } 
        showSaved={screen === 'WRITING'} 
        onMenu={() => setIsMenuOpen(true)}
        onClose={['PROFILE', 'SETTINGS', 'ABOUT', 'PRIVACY'].includes(screen) ? () => setScreen('CHRONICLE') : undefined}
        userName={userName}
        userImage={userImage}
      />
      
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={setScreen} />
      
      <main className="max-w-[680px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {screen === 'CHRONICLE' && <Chronicle entries={entries} onAddEntry={() => setScreen('WRITING')} />}
            {screen === 'WRITING' && (
              <WritingRoom 
                onCommit={(content, mood) => {
                  const newEntry: JournalEntry = {
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
                    title: 'New Reflection',
                    content,
                    mood,
                    tags: ['New'],
                    wordCount: content.split(/\s+/).filter(Boolean).length,
                    readTime: Math.ceil(content.split(/\s+/).filter(Boolean).length / 200),
                  };
                  addEntry(newEntry);
                  setScreen('CHRONICLE');
                }} 
              />
            )}
            {screen === 'INSIGHTS' && <Insights trendData={moodTrend} distData={moodDist} />}
            {screen === 'CAPSULES' && (
              <Capsules 
                capsules={capsules} 
                onUnlock={unlockCapsule} 
                onSeal={() => {
                  const title = prompt('Enter a title for your new memory:');
                  if (title) {
                    const newCapsule = {
                      id: `c${Date.now()}`,
                      title,
                      sealedDate: new Date().toLocaleDateString(),
                      unlockDate: 'In 30 days',
                      isUnlocked: false,
                      theme: '#New',
                      description: 'A newly sealed memory.',
                    };
                    setCapsules(prev => [...prev, newCapsule]);
                  }
                }}
              />
            )}
            {screen === 'REFRAMING' && (
              <ReframingTool 
                onCommit={(thought, reframed) => {
                  const newEntry: JournalEntry = {
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
                    title: 'Reframed Thought',
                    content: `Original: ${thought}\n\nReframed: ${reframed}`,
                    mood: 'balance',
                    tags: ['Reframing'],
                    wordCount: reframed.split(/\s+/).filter(Boolean).length,
                    readTime: 1,
                  };
                  addEntry(newEntry);
                  setScreen('CHRONICLE');
                }}
              />
            )}
            {screen === 'PROFILE' && (
              <ProfileScreen 
                userName={userName} 
                setUserName={setUserName} 
                userImage={userImage} 
                setUserImage={setUserImage}
                entryCount={entries.length}
              />
            )}
            {screen === 'SETTINGS' && <SettingsScreen />}
            {screen === 'ABOUT' && <AboutScreen />}
            {screen === 'PRIVACY' && <PrivacyScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeScreen={screen} setScreen={setScreen} />

      {/* Decorative texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[999]">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw2HjakACcML-TwTo7V3432DOWwCdnC2awufX9Kf4gHMLUT6tEQhiRDxuqzDhYoarpeajGQ1Swu8m5nXGdRYNqBIiR6JnUU6vxxYm9q9QzMywsbSJRnTZ81AoZcVBLqUlhaObI0wv7Y3YC34piBXylVl56fyIBt1lSFioonLvhZ8E8cHtSIKgp3WS6uwP3h2vndIWu7B8WPPxuqG9JbtY9Ep6rO_LnAWiffsrxwguD_98IiZ-ncIbQqSQ1cgNfhRh4s2CrGRxwDXk" 
          alt="Paper texture" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Optional stress prompt simulation button for demo */}
      {screen === 'CHRONICLE' && (
        <button 
          onClick={() => setScreen('BREATHING')}
          className="fixed top-24 left-6 p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all z-50 md:left-[calc(50%-420px)]"
          title="Simulate Stress Detection"
        >
          <Waves size={16} />
        </button>
      )}
    </div>
  );
}
