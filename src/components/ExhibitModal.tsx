import React from 'react';
import { X, Play, Factory, Calendar, Scale, Shield, Cpu } from 'lucide-react';
import { Exhibit } from '../data/exhibits';

interface ExhibitModalProps {
  exhibit: Exhibit | null;
  onClose: () => void;
  onPlaySimulator?: (simulatorType: 'morskoi-boi' | 'basketball' | 'magistral') => void;
}

export const ExhibitModal: React.FC<ExhibitModalProps> = ({
  exhibit,
  onClose,
  onPlaySimulator,
}) => {
  if (!exhibit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden text-stone-200 my-auto sm:my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-stone-850 border-b border-stone-800">
          <div className="flex items-center gap-2 min-w-0">
            <span
              style={{ backgroundColor: exhibit.accentColor }}
              className="w-2.5 h-2.5 rounded-full shrink-0"
            ></span>
            <span className="text-[11px] sm:text-xs font-soviet-mono uppercase tracking-widest text-stone-400 truncate">
              Экспонат музея · Инв. № {exhibit.year}-{exhibit.id.slice(0, 3).toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors touch-manipulation shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Main Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-soviet-mono text-amber-400">
              <span>{exhibit.year} ГОД ВЫПУСКА</span>
              <span>·</span>
              <span>{exhibit.price}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold font-display text-white mt-1 uppercase">
              {exhibit.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 italic border-l-2 border-amber-500/60 pl-3 py-0.5">
              {exhibit.quote}
            </p>
          </div>

          {/* Technical Passport */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg bg-stone-950 border border-stone-800 text-xs">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Factory className="w-3 h-3" /> Завод
              </div>
              <div className="font-semibold text-stone-200 mt-0.5">{exhibit.factory}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Город
              </div>
              <div className="font-semibold text-stone-200 mt-0.5">{exhibit.city}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Scale className="w-3 h-3" /> Масса
              </div>
              <div className="font-semibold text-stone-200 mt-0.5">{exhibit.weight}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Габариты
              </div>
              <div className="font-semibold text-stone-200 mt-0.5">{exhibit.dimensions}</div>
            </div>
          </div>

          {/* Detailed sections */}
          <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div>
              <h4 className="font-display text-base text-amber-400 uppercase tracking-wider mb-1">
                История создания и оборонная конверсия
              </h4>
              <p>{exhibit.history}</p>
            </div>

            <div>
              <h4 className="font-display text-base text-amber-400 uppercase tracking-wider mb-1">
                Правила игры и механика
              </h4>
              <p>{exhibit.gameplay}</p>
            </div>

            <div className="p-4 rounded-lg bg-stone-950 border border-stone-800">
              <h4 className="font-display text-xs text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Инженерный секрет аппарата
              </h4>
              <p className="text-xs text-stone-300">{exhibit.secretTech}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer touch-manipulation"
            >
              Закрыть
            </button>

            {exhibit.hasSimulator && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onPlaySimulator && exhibit.hasSimulator) {
                    onPlaySimulator(exhibit.hasSimulator);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-display text-xs uppercase tracking-widest transition-colors font-semibold cursor-pointer touch-manipulation shadow-md"
              >
                <Play className="w-4 h-4" />
                <span>Запустить симулятор</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
