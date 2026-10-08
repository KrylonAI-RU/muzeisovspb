import React from 'react';
import { X, RefreshCw, Info } from 'lucide-react';

interface CoinMatchboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onAddCoins: () => void;
  onDropCoin: () => void;
}

export const CoinMatchboxModal: React.FC<CoinMatchboxModalProps> = ({
  isOpen,
  onClose,
  coins,
  onAddCoins,
  onDropCoin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden text-stone-200">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-850 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 className="font-display text-base tracking-wider uppercase text-amber-100">
              Билетный спичечный коробок с монетами
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Cardboard Matchbox visual */}
          <div className="relative p-5 rounded-lg bg-stone-800 border-2 border-[#b88548]/40">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/40 text-[10px] uppercase tracking-widest text-amber-200/80 font-soviet-mono">
              ГОСТ 1820-77 · ЦЕНА 1 КОП.
            </div>
            <div className="text-center space-y-1">
              <div className="font-display text-xl tracking-wider uppercase text-amber-100">
                МУЗЕЙ СОВЕТСКИХ АВТОМАТОВ
              </div>
              <p className="text-xs text-stone-300">
                Фирменный входной билет: 15 оригинальных монет СССР (15 копеек)
              </p>
            </div>

            {/* Coin Slots inside Matchbox */}
            <div className="mt-4 pt-4 border-t border-stone-700 flex items-center justify-center gap-2 flex-wrap">
              {Array.from({ length: Math.min(coins, 15) }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8d2a6] via-[#c2a265] to-[#8d7139] border border-[#f5e6c8] shadow flex items-center justify-center font-soviet-mono text-[11px] font-bold text-[#443312] hover:scale-105 transition-transform cursor-pointer"
                  onClick={onDropCoin}
                  title="Нажмите, чтобы опустить монету"
                >
                  15к
                </div>
              ))}
              {coins === 0 && (
                <div className="py-3 text-xs text-amber-300 italic font-mono">
                  Все монеты опущены в автоматы. Возьмите ещё в кассе музея.
                </div>
              )}
            </div>
          </div>

          {/* Historical Fact */}
          <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-1.5 text-xs text-stone-300">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Почему именно 15 копеек?
            </div>
            <p className="leading-relaxed text-stone-400">
              В СССР почти все игровые автоматы стоили 15 копеек. Монетоприёмник МП-15 
              проверял монету по трём параметрам: точный диаметр (19,56 мм), толщина (1,2 мм) 
              и электромагнитный отклик медно-никелевого сплава нейзильбер.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onAddCoins}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              Взять ещё 15 монет в кассе
            </button>

            <button
              disabled={coins <= 0}
              onClick={onDropCoin}
              className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                coins > 0
                  ? 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                  : 'bg-stone-800 text-stone-600 cursor-not-allowed'
              }`}
            >
              Опустить 15 копеек ({coins})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
