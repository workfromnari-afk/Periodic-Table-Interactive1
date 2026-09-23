import React from 'react';
import { Sparkles, HelpCircle, Shuffle, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'table' | 'quiz' | 'memorize' | 'compare';
  setActiveTab: (tab: 'table' | 'quiz' | 'memorize' | 'compare') => void;
  onRandomElement: () => void;
  onOpenLegend: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRandomElement,
  onOpenLegend,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 font-bold text-white shadow-sm shadow-cyan-500/20">
            <span className="font-mono text-sm tracking-tighter">Pt</span>
          </div>
          <div className="flex flex-col">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('table');
              }}
              className="text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors sm:text-lg whitespace-nowrap"
            >
              Periodic Table Interactive
            </a>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'table'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            ตารางธาตุ 118 ธาตุ
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            แบบทดสอบเคมี
          </button>
          <button
            onClick={() => setActiveTab('memorize')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'memorize'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            โหมดท่องจำ
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-slate-800 text-purple-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            เปรียบเทียบธาตุ
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRandomElement}
            title="สุ่มเปิดดูธาตุ 1 ธาตุ"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-500/50 hover:bg-slate-800 hover:text-white"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">สุ่มธาตุ</span>
          </button>

          <button
            onClick={onOpenLegend}
            title="คู่มือสัญลักษณ์และการอ่านตารางธาตุ"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">วิธีอ่านตารางธาตุ</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-slate-950 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('table')}
          className={`flex-1 min-w-[80px] py-1 text-xs text-center font-medium rounded transition-colors whitespace-nowrap ${
            activeTab === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
          }`}
        >
          ตารางธาตุ
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[80px] py-1 text-xs text-center font-medium rounded transition-colors whitespace-nowrap ${
            activeTab === 'quiz' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
          }`}
        >
          แบบทดสอบ
        </button>
        <button
          onClick={() => setActiveTab('memorize')}
          className={`flex-1 min-w-[80px] py-1 text-xs text-center font-medium rounded transition-colors whitespace-nowrap ${
            activeTab === 'memorize' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
          }`}
        >
          โหมดท่องจำ
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 min-w-[80px] py-1 text-xs text-center font-medium rounded transition-colors whitespace-nowrap ${
            activeTab === 'compare' ? 'bg-slate-800 text-purple-400' : 'text-slate-400'
          }`}
        >
          เปรียบเทียบ
        </button>
      </div>
    </header>
  );
};
