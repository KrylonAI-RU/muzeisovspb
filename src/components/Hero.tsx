import React from 'react';
import { Eye, MapPin, Clock, Ticket, Coins, Compass, Gamepad2 } from 'lucide-react';

interface HeroProps {
  coins: number;
  onDropCoin?: () => void;
  onOpenMatchbox: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  coins,
  onOpenMatchbox,
}) => {
  return (
    <section className="relative pt-10 sm:pt-14 pb-16 border-b border-stone-800 bg-[#121418] text-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Curatorial Header Stamp */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-soviet-mono text-stone-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-amber-400 font-bold uppercase tracking-wider">
            ★ СССР · ЛЕНИНГРАД
          </span>
          <span className="text-stone-600 hidden sm:inline">·</span>
          <span className="text-stone-300 uppercase tracking-wider hidden sm:inline">КОНЮШЕННАЯ ПЛОЩАДЬ, 2В</span>
          <span className="text-stone-600 hidden sm:inline">·</span>
          <span className="text-stone-400 uppercase tracking-wider">ФОНД ДЕЙСТВУЮЩИХ ЭКСПОНАТОВ 1970–1991</span>
        </div>

        {/* Grand Soviet Title */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <h1 className="text-3xl xs:text-4xl sm:text-6xl font-bold font-display uppercase tracking-tight text-white leading-tight sm:leading-none">
            Музей советских <br />
            <span className="text-amber-400">игровых автоматов</span>
          </h1>

          <p className="text-xs xs:text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-normal">
            Интерактивный историко-технический музей в историческом центре Санкт-Петербурга. 
            Более 50 подлинных действующих аппаратов, собранных на оборонных предприятиях СССР. 
            Каждому посетителю на кассе выдаётся спичечный коробок с настоящими 15-копеечными монетами для игры.
          </p>
        </div>

        {/* Authentic Soviet Museum Pass Plaque (Unified, Clean, No Pill Clutter) */}
        <div className="rounded-xl bg-stone-900/90 border border-stone-700/80 p-3.5 sm:p-6 shadow-xl relative overflow-hidden">
          {/* Subtle industrial corner stamp */}
          <div className="absolute top-3 right-3 text-[10px] font-soviet-mono text-stone-500 uppercase tracking-widest hidden sm:block">
            ГОСТ 28243-89 · БЕЗ ВЫХОДНЫХ
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 items-center">
            {/* Column 1: Museum Hours & Location */}
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-amber-400 font-soviet-mono font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>РЕЖИМ РАБОТЫ МУЗЕЯ</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">Ежедневно 11:00 — 21:00</div>
              <div className="text-xs text-stone-400">Конюшенная площадь, 2В (у Спаса на Крови)</div>
            </div>

            {/* Column 2: Ticket Price */}
            <div className="space-y-0.5 sm:space-y-1 sm:border-l sm:border-stone-800 sm:pl-6">
              <div className="text-[10px] uppercase tracking-wider text-amber-400 font-soviet-mono font-bold flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                <span>ВХОДНОЙ БИЛЕТ</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-300">1 250 ₽ <span className="text-xs text-stone-400 font-normal">/ 1 100 ₽ льготный</span></div>
              <div className="text-xs text-stone-400">Включает 15 оригинальных монет СССР и экскурсию</div>
            </div>

            {/* Column 3: Interactive Matchbox Button (Refined & concise) */}
            <div className="sm:border-l sm:border-stone-800 sm:pl-6">
              <button
                type="button"
                onClick={onOpenMatchbox}
                className="w-full p-2.5 sm:p-3 rounded-lg bg-stone-950 border border-amber-600/40 hover:border-amber-500 transition-all text-left flex items-center justify-between group cursor-pointer shadow-inner active:scale-98 touch-manipulation"
                title="Нажмите, чтобы открыть ваш билетный коробок"
              >
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Coins className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="text-[9px] sm:text-[10px] font-soviet-mono text-stone-400 uppercase tracking-wider">
                      Билетный коробок
                    </div>
                    <div className="text-xs sm:text-sm font-bold font-soviet-mono text-amber-300">
                      {coins} коп. <span className="text-[10px] sm:text-xs font-normal text-stone-400">({coins} шт.)</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                  Открыть ↵
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Clean, Decisive Action Bar (Mobile-first grid & touch-friendly) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
          <a
            href="#simulators"
            className="col-span-2 sm:col-span-1 px-6 py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white font-display text-xs uppercase tracking-widest transition-colors font-bold shadow-md active:scale-95 text-center touch-manipulation"
          >
            Играть в симуляторы
          </a>

          <a
            href="#exhibits"
            className="px-4 sm:px-6 py-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-display text-xs uppercase tracking-wider transition-colors font-semibold text-center touch-manipulation"
          >
            Каталог автоматов
          </a>

          <a
            href="#hall-plan"
            className="px-4 sm:px-5 py-3 rounded-lg bg-stone-900/60 hover:bg-stone-800 text-stone-300 border border-stone-800 font-display text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 text-center touch-manipulation"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Схема залов</span>
          </a>

          <a
            href="#location-map"
            className="px-4 py-3 text-stone-400 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ml-auto hidden sm:flex"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>3D-Панорама Конюшенной →</span>
          </a>
        </div>

        {/* Quiet Stamped Technical Specification Ribbon (Decluttered single line) */}
        <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-y-2 text-xs font-soviet-mono text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-stone-300 font-bold">50+ ДЕЙСТВУЮЩИХ АППАРАТОВ</span>
          </div>
          <div>·</div>
          <div>ЕДИНЫЙ НОМИНАЛ: 15 КОПЕЕК (МОНЕТЫ 1961–1991)</div>
          <div className="hidden sm:block">·</div>
          <div className="hidden sm:block">ОБОРОННАЯ КОНВЕРСИЯ ПРЕДПРИЯТИЙ СССР</div>
          <div className="hidden sm:block">·</div>
          <div className="hidden sm:block">ЗДАНИЕ XVIII ВЕКА</div>
        </div>
      </div>
    </section>
  );
};
