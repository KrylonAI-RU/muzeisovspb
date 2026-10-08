import React, { useState } from 'react';
import { Droplets, RotateCcw, Check } from 'lucide-react';

interface GazirovkaSimulatorProps {
  coins: number;
  onUseCoin: () => void;
}

type SyrupType = 'none' | 'tarhun' | 'duches' | 'kremsoda' | 'barbaris';

interface SyrupOption {
  id: SyrupType;
  name: string;
  price: string;
  color: string;
}

const SYRUPS: SyrupOption[] = [
  { id: 'tarhun', name: 'Тархун', price: '3 коп.', color: 'rgba(16, 185, 129, 0.75)' },
  { id: 'duches', name: 'Дюшес', price: '3 коп.', color: 'rgba(234, 179, 8, 0.75)' },
  { id: 'kremsoda', name: 'Крем-Сода', price: '3 коп.', color: 'rgba(245, 158, 11, 0.75)' },
  { id: 'barbaris', name: 'Барбарис', price: '3 коп.', color: 'rgba(239, 68, 68, 0.75)' },
  { id: 'none', name: 'Без сиропа', price: '1 коп.', color: 'rgba(224, 242, 254, 0.5)' },
];

export const GazirovkaSimulator: React.FC<GazirovkaSimulatorProps> = ({
  coins,
  onUseCoin,
}) => {
  const [selectedSyrup, setSelectedSyrup] = useState<SyrupType>('tarhun');
  const [glassRinsed, setGlassRinsed] = useState(false);
  const [isRinsing, setIsRinsing] = useState(false);
  const [fillLevel, setFillLevel] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [drinkReady, setDrinkReady] = useState(false);

  const handleRinseGlass = () => {
    setIsRinsing(true);
    setTimeout(() => {
      setIsRinsing(false);
      setGlassRinsed(true);
    }, 800);
  };

  const handlePourSoda = () => {
    if (coins <= 0) {
      alert('Возьмите монеты в кассе музея (нажмите на коробок в шапке).');
      return;
    }

    onUseCoin();
    setIsPouring(true);
    setFillLevel(0);
    setDrinkReady(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setFillLevel(progress);
      if (progress >= 85) {
        clearInterval(interval);
        setIsPouring(false);
        setDrinkReady(true);
      }
    }, 80);
  };

  const currentSyrupInfo = SYRUPS.find((s) => s.id === selectedSyrup) || SYRUPS[0];

  return (
    <div className="rounded-xl bg-stone-900 border border-stone-800 p-6 shadow-xl text-stone-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-soviet-mono text-xs">
              ПЕРОВСКИЙ ЗАВОД · 1965
            </span>
            <span className="text-xs text-stone-400">Модель: АТ-114</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
            Автомат газированной воды АТ-114
          </h3>
        </div>
        <div className="text-xs text-stone-300 bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-lg">
          Классический гранёный стакан 200 мл · Мойка давлением
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-center">
        {/* Machine Front Face Illustration */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-xl bg-gradient-to-b from-[#a81c1c] to-[#7f1d1d] p-5 border-2 border-red-700 shadow-xl text-stone-100">
            {/* Header Banner */}
            <div className="text-center py-2 px-3 rounded-lg bg-[#fef2f2] text-red-900 mb-4">
              <div className="font-display text-lg tracking-widest uppercase font-bold">
                ГАЗИРОВАННАЯ ВОДА
              </div>
              <div className="text-[10px] tracking-wider uppercase text-red-800 font-sans font-semibold">
                Торгово-бытовой автомат
              </div>
            </div>

            {/* Dispensing Niche */}
            <div className="relative h-60 bg-stone-950 rounded-lg border border-stone-800 p-4 flex flex-col justify-end items-center overflow-hidden">
              {/* Tap Nozzle */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                <div className="w-5 h-3 bg-stone-400 rounded-t"></div>
                <div className="w-2.5 h-4 bg-stone-300"></div>
                {isPouring && (
                  <div
                    style={{ backgroundColor: currentSyrupInfo.color }}
                    className="w-1.5 h-28"
                  ></div>
                )}
              </div>

              {/* Rinse Spray effect */}
              {isRinsing && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="w-10 h-16 bg-cyan-200/30 rounded-full animate-ping"></div>
                  <div className="text-[10px] font-soviet-mono text-cyan-300 bg-black/80 px-1 rounded">
                    ПРОМЫВКА СТАКАНА
                  </div>
                </div>
              )}

              {/* Faceted Glass */}
              <div className="relative w-24 h-32 border-2 border-cyan-100/40 rounded-b-lg bg-white/5 backdrop-blur-xs flex flex-col justify-end overflow-hidden z-10">
                <div className="absolute inset-0 flex justify-between px-2 opacity-20 pointer-events-none">
                  <div className="w-px h-full bg-white"></div>
                  <div className="w-px h-full bg-white"></div>
                  <div className="w-px h-full bg-white"></div>
                  <div className="w-px h-full bg-white"></div>
                </div>

                <div
                  style={{
                    height: `${fillLevel}%`,
                    backgroundColor: currentSyrupInfo.color,
                  }}
                  className="w-full transition-all duration-75 relative"
                ></div>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/40"></div>
              </div>

              {/* Washer Grill */}
              <div className="w-32 h-2.5 bg-stone-700 rounded border border-stone-600 mt-1 flex items-center justify-center">
                <div className="w-24 h-0.5 bg-stone-900 rounded"></div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-red-100/90 text-center font-soviet-mono">
              {!glassRinsed
                ? '1. Ополосните стакан на мойке'
                : !drinkReady
                ? '2. Выберите вкус и опустите монету'
                : 'Напиток готов!'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                1. Промывка стакана
              </span>
              {glassRinsed && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Стакан чистый
                </span>
              )}
            </div>
            <button
              onClick={handleRinseGlass}
              disabled={isRinsing || isPouring}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Droplets className="w-4 h-4 text-cyan-400" />
              {isRinsing ? 'Идёт ополаскивание водой...' : 'Нажать и промыть стакан'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
              2. Выбор вкуса
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SYRUPS.map((syrup) => {
                const isSelected = selectedSyrup === syrup.id;
                return (
                  <button
                    key={syrup.id}
                    onClick={() => setSelectedSyrup(syrup.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      isSelected
                        ? 'border-amber-400 bg-stone-800 text-amber-200'
                        : 'border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: syrup.color }}
                      ></span>
                      <span>{syrup.name}</span>
                    </div>
                    <span className="font-soviet-mono text-stone-400">{syrup.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={handlePourSoda}
              disabled={isPouring || isRinsing}
              className={`w-full py-3.5 rounded-xl font-display text-sm uppercase tracking-widest transition-colors font-semibold ${
                isPouring
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-red-700 hover:bg-red-600 text-white'
              }`}
            >
              {isPouring ? (
                'Идёт налив...'
              ) : (
                <>Опустить монету и налить «{currentSyrupInfo.name}»</>
              )}
            </button>

            {drinkReady && (
              <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-stone-800 border border-stone-700 text-xs">
                <span className="text-emerald-400 font-medium">
                  Стакан наполнен газировкой «{currentSyrupInfo.name}».
                </span>
                <button
                  onClick={() => {
                    setFillLevel(0);
                    setDrinkReady(false);
                  }}
                  className="text-stone-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" /> Очистить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
