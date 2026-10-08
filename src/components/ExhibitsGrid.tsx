import React, { useState } from 'react';
import { EXHIBITS_DATA, Exhibit } from '../data/exhibits';
import { Play, Info, Factory } from 'lucide-react';

interface ExhibitsGridProps {
  onSelectExhibit: (exhibit: Exhibit) => void;
  onPlaySimulator: (simulatorType: 'morskoi-boi' | 'basketball' | 'magistral') => void;
}

export const ExhibitsGrid: React.FC<ExhibitsGridProps> = ({
  onSelectExhibit,
  onPlaySimulator,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Все аппараты' },
    { id: 'морские', label: 'Морские' },
    { id: 'гонки', label: 'Авторалли' },
    { id: 'стрелковые', label: 'Стрелковые' },
    { id: 'ловкость', label: 'Спортивные' },
    { id: 'быт', label: 'Автоматы газводы' },
  ];

  const filteredExhibits = filter === 'all'
    ? EXHIBITS_DATA
    : EXHIBITS_DATA.filter((e) => e.category === filter);

  return (
    <section id="exhibits" className="py-14 sm:py-16 bg-[#121418] border-t border-stone-800 text-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-soviet-mono text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>РЕЕСТР ЭКСПОНАТОВ МУЗЕЯ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1 uppercase tracking-tight">
              Каталог советских автоматов
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Более 50 подлинных аппаратов 1970–1990 годов. Выберите аппарат, чтобы открыть заводской техпаспорт, 
              историю оборонного завода и правила игры.
            </p>
          </div>

          {/* Filter buttons - Horizontally scrollable on mobile without wrapping into multiple rows */}
          <div className="flex overflow-x-auto sm:flex-wrap items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-soviet-mono uppercase transition-colors cursor-pointer shrink-0 touch-manipulation ${
                  filter === cat.id
                    ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards - Authentic Soviet Metal Plate styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredExhibits.map((exhibit) => (
            <div
              key={exhibit.id}
              className="group rounded-xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 transition-all shadow-md overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thin industrial top color stripe */}
                <div
                  style={{ backgroundColor: exhibit.accentColor }}
                  className="h-1 w-full opacity-80"
                ></div>

                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-stone-400 font-soviet-mono gap-2">
                    <span className="text-amber-400 font-bold whitespace-nowrap shrink-0">{exhibit.year}&nbsp;год</span>
                    <span className="truncate text-stone-300 text-right">{exhibit.city}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                    {exhibit.name}
                  </h3>

                  <div className="text-xs text-stone-400 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span className="truncate">{exhibit.factory}</span>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-3 pt-1">
                    {exhibit.shortDesc}
                  </p>
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-3.5 sm:pb-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectExhibit(exhibit)}
                  className="text-xs font-semibold text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 py-1.5 cursor-pointer font-soviet-mono touch-manipulation"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>ТЕХПАСПОРТ</span>
                </button>

                {exhibit.hasSimulator && (
                  <button
                    type="button"
                    onClick={() => onPlaySimulator(exhibit.hasSimulator!)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold font-display uppercase tracking-wider transition-colors cursor-pointer shadow-sm active:scale-95 touch-manipulation"
                  >
                    <Play className="w-3 h-3" />
                    <span>Играть</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
