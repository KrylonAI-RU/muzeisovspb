import React, { useState } from 'react';
import { Layers, Compass, Info, Check, ArrowRight } from 'lucide-react';
import { EXHIBITS_DATA, Exhibit } from '../data/exhibits';

interface MuseumHallPlanProps {
  onSelectExhibit: (exhibit: Exhibit) => void;
}

interface Zone {
  id: string;
  name: string;
  floor: 1 | 2;
  code: string;
  borderColor: string;
  bgActive: string;
  textLight: string;
  description: string;
  exhibits: string[];
}

const ZONES: Zone[] = [
  {
    id: 'naval',
    name: 'Зал «Морской рубеж»',
    floor: 1,
    code: 'ЗОНА 01',
    borderColor: '#0284c7',
    bgActive: 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    textLight: 'text-cyan-300',
    description: 'Оптические симуляторы торпедных атак с аутентичными перископами боевых подлодок СССР.',
    exhibits: ['morskoi-boi'],
  },
  {
    id: 'racing',
    name: 'Зал «Советское автошоссе»',
    floor: 1,
    code: 'ЗОНА 02',
    borderColor: '#dc2626',
    bgActive: 'bg-red-950/60 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    textLight: 'text-red-300',
    description: 'Электронные гоночные аппараты 70-х годов с механическими рулями, коробками передач и педалями.',
    exhibits: ['magistral'],
  },
  {
    id: 'buffet',
    name: 'Советский ретро-буфет',
    floor: 1,
    code: 'ЗОНА 03',
    borderColor: '#ea580c',
    bgActive: 'bg-amber-950/60 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    textLight: 'text-amber-300',
    description: 'Действующие автоматы газированной воды АТ-114, молочные коктейли «Воронеж-2» и фотокабина.',
    exhibits: ['at-114'],
  },
  {
    id: 'sports',
    name: 'Зал «Спорт и меткость»',
    floor: 2,
    code: 'ЗОНА 04',
    borderColor: '#16a34a',
    bgActive: 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    textLight: 'text-emerald-300',
    description: 'Тир «Снайпер», купольный «Баскетбол» и электронные «Городки» на базе микроконтроллеров.',
    exhibits: ['gorodki', 'sniper-2', 'basketball'],
  },
  {
    id: 'workshop',
    name: 'Мастерская инженеров-реставраторов',
    floor: 2,
    code: 'ЗОНА 05',
    borderColor: '#a855f7',
    bgActive: 'bg-purple-950/60 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    textLight: 'text-purple-300',
    description: 'Открытая лаборатория, где мастера восстанавливают релейные блоки и оптику 50-летней давности.',
    exhibits: [],
  },
];

export const MuseumHallPlan: React.FC<MuseumHallPlanProps> = ({ onSelectExhibit }) => {
  const [selectedFloor, setSelectedFloor] = useState<1 | 2>(1);
  const [activeZoneId, setActiveZoneId] = useState<string>('naval');

  const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];
  const activeExhibits = EXHIBITS_DATA.filter((e) => activeZone.exhibits.includes(e.id));
  const currentFloorZones = ZONES.filter((z) => z.floor === selectedFloor);

  return (
    <section id="hall-plan" className="py-12 sm:py-16 bg-[#14171d] border-t border-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>Интерактивная карта экспозиции</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1 uppercase">
              Схема залов музея на Конюшенной
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1.5 max-w-2xl leading-relaxed">
              Нажмите на зону экспозиции или выберите этаж, чтобы узнать точное расположение 
              автоматов и посмотреть их паспорта.
            </p>
          </div>

          {/* Floor Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedFloor(1);
                setActiveZoneId('naval');
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold font-soviet-mono transition-all cursor-pointer touch-manipulation ${
                selectedFloor === 1
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              1-й ЭТАЖ (ОСНОВНОЙ)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedFloor(2);
                setActiveZoneId('sports');
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold font-soviet-mono transition-all cursor-pointer touch-manipulation ${
                selectedFloor === 2
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              2-й ЭТАЖ (ГАЛЕРЕЯ)
            </button>
          </div>
        </div>

        {/* Quick Room Selector Chips for fast mobile selection */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] font-soviet-mono uppercase text-stone-400 hidden sm:inline">
            Залы этажа:
          </span>
          {currentFloorZones.map((z) => {
            const isCurrent = activeZoneId === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setActiveZoneId(z.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer touch-manipulation border ${
                  isCurrent
                    ? 'bg-stone-800 text-white border-amber-500 shadow-sm'
                    : 'bg-stone-950/80 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <span className="font-soviet-mono text-[10px]" style={{ color: z.borderColor }}>
                  {z.code}
                </span>
                <span>{z.name}</span>
                {isCurrent && <Check className="w-3 h-3 text-amber-400 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Main Floor Plan Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Architectural Blueprint View */}
          <div className="lg:col-span-8 p-3 sm:p-5 rounded-xl bg-stone-900 border border-stone-800 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-[11px] sm:text-xs font-soviet-mono text-stone-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                АРХИТЕКТУРНЫЙ ПЛАН: ЭТАЖ #{selectedFloor}
              </span>
              <span className="hidden sm:inline">КОНЮШЕННАЯ ПЛОЩАДЬ, 2В</span>
            </div>

            {/* Blueprint Grid Container */}
            <div className="relative my-3 sm:my-4 w-full bg-[#0a0e17] rounded-lg border border-stone-800 p-2 sm:p-4 overflow-hidden">
              {/* Background Technical Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              ></div>

              {selectedFloor === 1 ? (
                /* FLOOR 1 LAYOUT: Adaptive for Mobile and Desktop */
                <div className="relative z-10 space-y-2.5 sm:space-y-3">
                  {/* Top Rooms: Naval + Racing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {/* Zone 1: Naval */}
                    <div
                      onClick={() => setActiveZoneId('naval')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] sm:min-h-[140px] touch-manipulation ${
                        activeZoneId === 'naval'
                          ? ZONES[0].bgActive
                          : 'border-cyan-950 bg-stone-900/90 hover:border-cyan-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-soviet-mono font-bold text-cyan-400">
                          ЗОНА 01: МОРСКОЙ РУБЕЖ
                        </span>
                        {activeZoneId === 'naval' && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        )}
                      </div>
                      <div className="my-1.5 space-y-0.5">
                        <div className="text-sm sm:text-base font-bold text-white">«Морской бой» (1973)</div>
                        <div className="text-[11px] text-stone-400">Перископы · Торпедные аппараты</div>
                      </div>
                      <div className="text-[10px] font-soviet-mono text-cyan-300/80 flex items-center justify-between">
                        <span>1 ключевой симулятор</span>
                        <span className="text-amber-400">Нажмите для выбора ↵</span>
                      </div>
                    </div>

                    {/* Zone 2: Racing */}
                    <div
                      onClick={() => setActiveZoneId('racing')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] sm:min-h-[140px] touch-manipulation ${
                        activeZoneId === 'racing'
                          ? ZONES[1].bgActive
                          : 'border-red-950 bg-stone-900/90 hover:border-red-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-soviet-mono font-bold text-red-400">
                          ЗОНА 02: АВТОШОССЕ
                        </span>
                        {activeZoneId === 'racing' && (
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                        )}
                      </div>
                      <div className="my-1.5 space-y-0.5">
                        <div className="text-sm sm:text-base font-bold text-white">«Магистраль» & «Авторалли»</div>
                        <div className="text-[11px] text-stone-400">Рули · Педали · Табло скорости</div>
                      </div>
                      <div className="text-[10px] font-soviet-mono text-red-300/80 flex items-center justify-between">
                        <span>Советские автосимуляторы</span>
                        <span className="text-amber-400">Нажмите для выбора ↵</span>
                      </div>
                    </div>
                  </div>

                  {/* Corridor with architecture dashed line */}
                  <div className="hidden sm:flex items-center justify-between px-4 py-1 text-[10px] font-soviet-mono text-stone-500 border-y border-dashed border-stone-800/80">
                    <span>◄ ВЫСТАВОЧНЫЙ КОРИДОР 1-ГО ЭТАЖА</span>
                    <span>ПЕРЕХОД К ЛЕСТНИЦЕ НА 2-Й ЭТАЖ ►</span>
                  </div>

                  {/* Bottom Rooms: Buffet + Entrance */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
                    {/* Zone 3: Buffet */}
                    <div
                      onClick={() => setActiveZoneId('buffet')}
                      className={`sm:col-span-8 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-h-[90px] touch-manipulation ${
                        activeZoneId === 'buffet'
                          ? ZONES[2].bgActive
                          : 'border-amber-950 bg-stone-900/90 hover:border-amber-700'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-soviet-mono font-bold text-amber-400 block">
                          ЗОНА 03: РЕТРО-БУФЕТ СССР
                        </span>
                        <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                          Автоматы газводы АТ-114 · Коктейли «Воронеж»
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          Вафли, крем-сода и тархун из гранёного стакана
                        </div>
                      </div>
                      <div className="self-start sm:self-auto shrink-0 flex items-center gap-2">
                        <span className="text-[10px] px-2.5 py-1 rounded bg-amber-950 text-amber-200 font-soviet-mono border border-amber-800 font-bold">
                          1 и 3 коп.
                        </span>
                      </div>
                    </div>

                    {/* Main Entrance */}
                    <div className="sm:col-span-4 p-3.5 sm:p-4 rounded-xl border border-stone-800 bg-stone-900/60 flex flex-col justify-center items-center text-center min-h-[90px]">
                      <span className="text-[10px] font-soviet-mono text-amber-400 font-bold tracking-wider">
                        ГЛАВНЫЙ ВХОД
                      </span>
                      <span className="text-xs font-semibold text-stone-200 mt-0.5">
                        Касса и выдача монет
                      </span>
                      <span className="text-[10px] text-stone-400 mt-1">
                        Спичечный коробок с 15-копеечными монетами
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* FLOOR 2 LAYOUT: Adaptive for Mobile and Desktop */
                <div className="relative z-10 space-y-2.5 sm:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
                    {/* Zone 4: Sports */}
                    <div
                      onClick={() => setActiveZoneId('sports')}
                      className={`sm:col-span-7 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] touch-manipulation ${
                        activeZoneId === 'sports'
                          ? ZONES[3].bgActive
                          : 'border-emerald-950 bg-stone-900/90 hover:border-emerald-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-soviet-mono font-bold text-emerald-400">
                          ЗОНА 04: СПОРТ И МЕТКОСТЬ
                        </span>
                        {activeZoneId === 'sports' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        )}
                      </div>
                      <div className="my-1.5 space-y-0.5">
                        <div className="text-sm sm:text-base font-bold text-white">
                          «Городки», «Снайпер-2», «Баскетбол»
                        </div>
                        <div className="text-[11px] text-stone-400">
                          Купольный паркетный баскетбол и лазерно-оптический тир ТОЗ
                        </div>
                      </div>
                      <div className="text-[10px] font-soviet-mono text-emerald-300/80 flex items-center justify-between">
                        <span>3 действующих экспоната</span>
                        <span className="text-amber-400">Нажмите для выбора ↵</span>
                      </div>
                    </div>

                    {/* Zone 5: Workshop */}
                    <div
                      onClick={() => setActiveZoneId('workshop')}
                      className={`sm:col-span-5 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] touch-manipulation ${
                        activeZoneId === 'workshop'
                          ? ZONES[4].bgActive
                          : 'border-purple-950 bg-stone-900/90 hover:border-purple-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-soviet-mono font-bold text-purple-400">
                          ЗОНА 05: МАСТЕРСКАЯ
                        </span>
                        {activeZoneId === 'workshop' && (
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                        )}
                      </div>
                      <div className="my-1.5 space-y-0.5">
                        <div className="text-sm sm:text-base font-bold text-white">Ремонт реле и плат</div>
                        <div className="text-[11px] text-stone-400">
                          Открытая лаборатория инженеров-реставраторов
                        </div>
                      </div>
                      <div className="text-[10px] font-soviet-mono text-purple-300/80 flex items-center justify-between">
                        <span>Реставрация техники</span>
                        <span className="text-amber-400">Нажмите для выбора ↵</span>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Balcony Corridor */}
                  <div className="p-3 rounded-xl border border-stone-800 bg-stone-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] font-soviet-mono text-stone-400">
                        БАЛКОН 2-ГО ЭТАЖА
                      </span>
                      <div className="text-xs font-semibold text-stone-300">
                        Панорамный обзор на главный зал 1-го этажа и купола Конюшенной
                      </div>
                    </div>
                    <span className="text-[10px] font-soviet-mono text-amber-400 shrink-0">
                      Спуск по парадной винтовой лестнице
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Details Panel - Selected Zone Inspector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 sm:p-5 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  style={{ color: activeZone.borderColor }}
                  className="text-xs font-soviet-mono font-bold uppercase tracking-wider"
                >
                  {activeZone.floor}-й этаж музея · {activeZone.code}
                </span>
                <span className="text-xs text-stone-400">
                  {activeExhibits.length} {activeExhibits.length === 1 ? 'экспонат' : 'экспоната'}
                </span>
              </div>

              <h3 className="font-display text-lg sm:text-xl text-white font-bold">
                {activeZone.name}
              </h3>

              <p className="text-xs text-stone-300 leading-relaxed">
                {activeZone.description}
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Автоматы в этой зоне:
                </div>

                {activeExhibits.length > 0 ? (
                  activeExhibits.map((exhibit) => (
                    <div
                      key={exhibit.id}
                      className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {exhibit.name} ({exhibit.year})
                        </div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {exhibit.factory}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectExhibit(exhibit)}
                        className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-amber-600 active:bg-amber-700 text-stone-200 hover:text-stone-950 transition-colors text-xs flex items-center gap-1 font-medium shrink-0 cursor-pointer touch-manipulation"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Обзор</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-400 leading-relaxed">
                    Здесь можно наблюдать за реальным процессом пайки плат К155, чистки электромагнитных реле и оптических зеркал 50-летней давности.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
