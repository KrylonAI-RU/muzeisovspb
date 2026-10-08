import React from 'react';
import { Coins } from 'lucide-react';

interface HeaderProps {
  coins: number;
  onOpenMatchbox: () => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({ coins, onOpenMatchbox }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#16181d] border-b border-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <a 
          href="#" 
          className="text-sm sm:text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap font-display uppercase flex items-center gap-2 truncate mr-2"
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
          <span className="hidden sm:inline">Музей советских игровых автоматов</span>
          <span className="inline sm:hidden">Музей автоматов</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-300">
          <a href="#about" className="hover:text-amber-400 transition-colors">О музее</a>
          <a href="#exhibits" className="hover:text-amber-400 transition-colors">Экспонаты</a>
          <a href="#simulators" className="hover:text-amber-400 transition-colors">Симуляторы</a>
          <a href="#hall-plan" className="hover:text-amber-400 transition-colors">План залов</a>
          <a href="#location-map" className="hover:text-amber-400 transition-colors">3D-Панорама</a>
          <a href="#visit" className="hover:text-amber-400 transition-colors">Посещение</a>
        </nav>

        {/* Zone 3: Matchbox counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMatchbox}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 text-xs font-semibold tracking-wide transition-colors"
            title="Открыть коробок с 15-копеечными монетами"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-soviet-mono text-sm font-bold text-amber-300">{coins}</span>
            <span className="hidden sm:inline text-stone-300 font-sans text-xs">монет</span>
          </button>
        </div>
      </div>
    </header>
  );
};
