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
    { id: 'all', label: 'Все экспонаты' },
    { id: 'морские', label: 'Морские' },
    { id: 'гонки', label: 'Гонки' },
    { id: 'стрелковые', label: 'Стрелковые' },
    { id: 'ловкость', label: 'Ловкость' },
    { id: 'быт', label: 'Автоматы газводы' },
  ];

  const filteredExhibits = filter === 'all'
    ? EXHIBITS_DATA
    : EXHIBITS_DATA.filter((e) => e.category === filter);

  return (
    <section id="exhibits" className="py-16 bg-[#121418] border-t border-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-soviet-mono text-amber-400 uppercase tracking-widest">
              Постоянная музейная экспозиция
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1 uppercase">
              Каталог советских автоматов
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-2xl">
              Свыше 50 подлинных аппаратов, бережно восстановленных инженерами музея. 
              Нажмите на любой аппарат, чтобы изучить его технический паспорт, военный завод и правила игры.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === cat.id
                    ? 'bg-amber-600 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExhibits.map((exhibit) => (
            <div
              key={exhibit.id}
              className="group rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors shadow-lg overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div
                  style={{ backgroundColor: exhibit.accentColor }}
                  className="h-1 w-full"
                ></div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-soviet-mono">
                    <span className="text-amber-400 font-bold">{exhibit.year} год</span>
                    <span aria-hidden="true">·</span>
                    <span>{exhibit.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-300">{exhibit.price}</span>
                  </div>

                  <h3 className="text-lg font-bold font-display uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                    {exhibit.name}
                  </h3>

                  <div className="text-xs text-stone-400 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span className="truncate">{exhibit.factory}</span>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">
                    {exhibit.shortDesc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectExhibit(exhibit)}
                  className="text-xs font-semibold text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1 py-1"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  Паспорт автомата
                </button>

                {exhibit.hasSimulator && (
                  <button
                    onClick={() => onPlaySimulator(exhibit.hasSimulator!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Запустить
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
