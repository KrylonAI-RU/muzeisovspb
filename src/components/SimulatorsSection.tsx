import React, { useState, useEffect } from 'react';
import { MorskoiBoiSimulator } from './MorskoiBoiSimulator';
import { BasketballSimulator } from './BasketballSimulator';
import { MagistralSimulator } from './MagistralSimulator';
import { Play, Gauge, Trophy, Gamepad2 } from 'lucide-react';

interface SimulatorsSectionProps {
  coins: number;
  onUseCoin: () => void;
  initialSimulator?: 'morskoi-boi' | 'basketball' | 'magistral';
}

export const SimulatorsSection: React.FC<SimulatorsSectionProps> = ({
  coins,
  onUseCoin,
  initialSimulator = 'morskoi-boi',
}) => {
  const [activeSim, setActiveSim] = useState<'morskoi-boi' | 'basketball' | 'magistral'>(initialSimulator);

  // Keep state in sync if user clicks from catalog or technical passport modal
  useEffect(() => {
    if (initialSimulator) {
      setActiveSim(initialSimulator);
    }
  }, [initialSimulator]);

  return (
    <section id="simulators" className="py-10 sm:py-16 bg-[#13161c] border-t border-stone-800 text-stone-200">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-2">
          <div>
            <div className="text-[10px] sm:text-xs font-soviet-mono text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>ИНТЕРАКТИВНЫЙ ЗАЛ · ДЕЙСТВУЮЩИЕ АППАРАТЫ</span>
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-4xl font-bold font-display text-white mt-1 uppercase tracking-tight">
              Симуляторы советских автоматов
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Точные алгоритмические модели культовых аппаратов. 
              Опускайте 15 копеек из спичечного коробка для пуска торпед, бросков мяча или скоростного заезда.
            </p>
          </div>

          {/* Soviet Mechanical Machine Selector Panel - Responsive grid on mobile, flex on desktop */}
          <div className="bg-stone-900 border border-stone-700/80 p-1 sm:p-1.5 rounded-xl shadow-lg grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveSim('morskoi-boi')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-2 sm:py-2 rounded-lg text-[11px] sm:text-xs font-display uppercase tracking-wider transition-all cursor-pointer touch-manipulation border ${
                activeSim === 'morskoi-boi'
                  ? 'bg-stone-800 text-white border-red-500 shadow-md font-bold'
                  : 'bg-stone-950/60 text-stone-400 border-transparent hover:text-stone-200'
              }`}
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0 ${activeSim === 'morskoi-boi' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-stone-600'}`}></span>
              <span className="truncate">«Морской бой»</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSim('basketball')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-2 sm:py-2 rounded-lg text-[11px] sm:text-xs font-display uppercase tracking-wider transition-all cursor-pointer touch-manipulation border ${
                activeSim === 'basketball'
                  ? 'bg-stone-800 text-white border-amber-500 shadow-md font-bold'
                  : 'bg-stone-950/60 text-stone-400 border-transparent hover:text-stone-200'
              }`}
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0 ${activeSim === 'basketball' ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-stone-600'}`}></span>
              <span className="truncate">«Баскетбол»</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSim('magistral')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-2 sm:py-2 rounded-lg text-[11px] sm:text-xs font-display uppercase tracking-wider transition-all cursor-pointer touch-manipulation border ${
                activeSim === 'magistral'
                  ? 'bg-stone-800 text-white border-emerald-500 shadow-md font-bold'
                  : 'bg-stone-950/60 text-stone-400 border-transparent hover:text-stone-200'
              }`}
            >
              <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0 ${activeSim === 'magistral' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-stone-600'}`}></span>
              <span className="truncate">«Магистраль»</span>
            </button>
          </div>
        </div>

        {/* Active Simulator */}
        <div>
          {activeSim === 'morskoi-boi' && (
            <MorskoiBoiSimulator coins={coins} onUseCoin={onUseCoin} />
          )}
          {activeSim === 'basketball' && (
            <BasketballSimulator coins={coins} onUseCoin={onUseCoin} />
          )}
          {activeSim === 'magistral' && (
            <MagistralSimulator coins={coins} onUseCoin={onUseCoin} />
          )}
        </div>
      </div>
    </section>
  );
};
