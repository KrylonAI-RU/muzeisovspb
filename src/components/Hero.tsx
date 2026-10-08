import React from 'react';
import { Eye, MapPin, Clock, Ticket, Coins, Compass } from 'lucide-react';

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
    <section className="relative pt-12 pb-20 border-b border-stone-800 bg-[#121419] text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Curatorial Header Tag */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-soviet-mono text-stone-400">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 border border-stone-700 text-amber-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            САНКТ-ПЕТЕРБУРГ · КОНЮШЕННАЯ ПЛОЩАДЬ, 2В
          </span>
          <span className="text-stone-600">·</span>
          <span>ИСТОРИЧЕСКИЙ ЦЕНТР У СПАСА НА КРОВИ</span>
          <span className="text-stone-600">·</span>
          <span className="text-stone-300">ОСНОВАН В 2007 ГОДУ</span>
        </div>

        {/* Grand Expanded Hero Title & Description */}
        <div className="max-w-4xl space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display uppercase tracking-tight text-white leading-none">
            Музей советских <br />
            <span className="text-amber-400">
              игровых автоматов
            </span>
          </h1>

          <p className="text-base sm:text-xl text-stone-300 leading-relaxed font-normal">
            Крупнейший интерактивный историко-технический музей в Санкт-Петербурге. 
            Коллекция объединяет более 50 действующих игровых автоматов 1970–1990 годов, 
            сконструированных на советских оборонных предприятиях. 
            Каждый гость получает входной билет в виде спичечного коробка с 15 настоящими 
            советскими 15-копеечными монетами для игры на экспонатах.
          </p>

          {/* Operational Utility Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 font-soviet-mono">Время работы</div>
                <div className="font-semibold text-stone-200">Ежедневно 11:00 — 21:00</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
              <Ticket className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 font-soviet-mono">Полный билет</div>
                <div className="font-semibold text-amber-300">1 250 ₽ (15 монет СССР)</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
              <Ticket className="w-4 h-4 text-stone-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 font-soviet-mono">Льготный билет</div>
                <div className="font-semibold text-stone-200">1 100 ₽ (студенты, школьники)</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 cursor-pointer hover:border-amber-500/40 transition-colors" onClick={onOpenMatchbox}>
              <Coins className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 font-soviet-mono">Ваш билетный коробок</div>
                <div className="font-semibold text-amber-300 font-soviet-mono">{coins} монет по 15 коп.</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href="#exhibits"
              className="px-6 py-3.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-display text-xs uppercase tracking-widest transition-colors font-semibold"
            >
              Каталог автоматов
            </a>

            <a
              href="#simulators"
              className="px-6 py-3.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-display text-xs uppercase tracking-wider transition-colors"
            >
              Игровые симуляторы
            </a>

            <a
              href="#location-map"
              className="px-6 py-3.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-display text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              3D-Панорама Конюшенной
            </a>

            <a
              href="#about"
              className="px-4 py-3.5 text-stone-400 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              История создания музея →
            </a>
          </div>
        </div>

        {/* 4 Quantitative Facts Cards across the width */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-800">
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-2xl lg:text-3xl font-bold font-display text-amber-400">50+</div>
            <div className="text-xs text-stone-300 font-semibold mt-0.5">Действующих аппаратов</div>
            <div className="text-[11px] text-stone-500 mt-1">Все автоматы рабочие и готовы к игре</div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-2xl lg:text-3xl font-bold font-display text-white">15 копеек</div>
            <div className="text-xs text-stone-300 font-semibold mt-0.5">Единый номинал игры</div>
            <div className="text-[11px] text-stone-500 mt-1">Оригинальные монеты чеканки 1961–1991</div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-2xl lg:text-3xl font-bold font-display text-white">1970–1990</div>
            <div className="text-xs text-stone-300 font-semibold mt-0.5">Эпоха оборонной конверсии</div>
            <div className="text-[11px] text-stone-500 mt-1">Производство на закрытых военных заводах</div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-2xl lg:text-3xl font-bold font-display text-white">XVIII век</div>
            <div className="text-xs text-stone-300 font-semibold mt-0.5">Конюшенная площадь, 2В</div>
            <div className="text-[11px] text-stone-500 mt-1">Историческое здание Придворного ведомства</div>
          </div>
        </div>
      </div>
    </section>
  );
};
