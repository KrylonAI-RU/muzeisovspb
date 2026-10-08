import React, { useState } from 'react';
import { Coins, Menu, X } from 'lucide-react';
import { SovietStarIcon } from './SovietStarIcon';

interface HeaderProps {
  coins: number;
  onOpenMatchbox: () => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ coins, onOpenMatchbox }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#121418] border-b border-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand wordmark - Soviet museum styling with authentic ruby star */}
        <a 
          href="#" 
          className="flex items-center gap-2 xs:gap-2.5 group mr-2 shrink min-w-0"
        >
          {/* Authentic Ruby Kremlin Star emblem */}
          <div className="w-8 h-8 rounded-lg bg-stone-900/90 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-md group-hover:border-amber-400/60 transition-colors p-1">
            <SovietStarIcon className="w-full h-full filter drop-shadow group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] xs:text-xs sm:text-sm font-bold tracking-wider text-white group-hover:text-amber-400 transition-colors uppercase font-display leading-tight truncate">
              Музей советских автоматов
            </span>
            <span className="text-[9px] sm:text-[10px] font-soviet-mono text-stone-400 hidden sm:block tracking-widest uppercase truncate">
              Санкт-Петербург · Конюшенная пл., 2В
            </span>
          </div>
        </a>

        {/* Navigation links - Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-300">
          <a href="#about" className="hover:text-amber-400 transition-colors py-1">О музее</a>
          <a href="#exhibits" className="hover:text-amber-400 transition-colors py-1">Экспозиция</a>
          <a href="#simulators" className="hover:text-amber-400 transition-colors py-1">Симуляторы</a>
          <a href="#hall-plan" className="hover:text-amber-400 transition-colors py-1">План залов</a>
          <a href="#location-map" className="hover:text-amber-400 transition-colors py-1">3D-Панорама</a>
          <a href="#visit" className="hover:text-amber-400 transition-colors py-1">Посещение</a>
        </nav>

        {/* Action button & Mobile menu toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Matchbox counter - Concise Soviet coin counter */}
          <button
            type="button"
            onClick={onOpenMatchbox}
            className="flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 text-amber-300 text-xs font-semibold tracking-wide transition-all shadow cursor-pointer active:scale-95 touch-manipulation"
            title="Открыть спичечный коробок с монетами"
          >
            <Coins className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-400 shrink-0" />
            <div className="flex items-center gap-0.5 sm:gap-1 font-soviet-mono">
              <span className="text-xs xs:text-sm font-bold text-amber-300">{coins}</span>
              <span className="text-[10px] xs:text-xs text-stone-400 font-normal">коп.</span>
            </div>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer touch-manipulation"
            aria-label="Меню навигации"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-amber-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#161a22] border-b border-stone-800 px-4 py-3 space-y-1 text-xs font-soviet-mono uppercase tracking-wider animate-in slide-in-from-top-2 duration-150">
          <a
            href="#simulators"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg bg-stone-900 text-amber-300 border border-stone-800 font-bold"
          >
            🕹️ Симуляторы советских автоматов
          </a>
          <a
            href="#exhibits"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-stone-300 hover:bg-stone-900 hover:text-white"
          >
            Каталог автоматов (50+ экспонатов)
          </a>
          <a
            href="#hall-plan"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-stone-300 hover:bg-stone-900 hover:text-white"
          >
            Архитектурный план залов (1 и 2 этажи)
          </a>
          <a
            href="#location-map"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-stone-300 hover:bg-stone-900 hover:text-white"
          >
            3D-Панорама и расположение
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-stone-300 hover:bg-stone-900 hover:text-white"
          >
            О музее и оборонной конверсии
          </a>
          <a
            href="#visit"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-stone-300 hover:bg-stone-900 hover:text-white"
          >
            Билеты, часы работы и советский буфет
          </a>
        </div>
      )}
    </header>
  );
};
