import React, { useState } from 'react';
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

  return (
    <section id="simulators" className="py-16 bg-[#13161c] border-t border-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-soviet-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Интерактивный зал действующих автоматов</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1 uppercase">
              Игровые симуляторы советских автоматов
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-2xl">
              Точные алгоритмические модели культовых советских аппаратов. 
              Опускайте 15 копеек из своего спичечного коробка и управляйте настоящим перископом, 
              пружинными катапультами баскетбола или рулём гоночного болида.
            </p>
          </div>

          {/* Simulator switcher tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-stone-900 border border-stone-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveSim('morskoi-boi')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer touch-manipulation ${
                activeSim === 'morskoi-boi'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>«Морской бой»</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSim('basketball')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer touch-manipulation ${
                activeSim === 'basketball'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>«Баскетбол»</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSim('magistral')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer touch-manipulation ${
                activeSim === 'magistral'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>«Магистраль»</span>
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
