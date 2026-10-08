import React from 'react';
import { Clock, Ticket, Coffee, Camera, ShieldCheck } from 'lucide-react';

export const VisitInfo: React.FC = () => {
  return (
    <section id="visit" className="py-16 bg-[#14161c] border-t border-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-soviet-mono text-amber-400 uppercase tracking-widest mb-1">
            Посещение экспозиции
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white uppercase">
            Билеты, часы работы и советский буфет
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            В музее нет табличек «руками не трогать». Каждый автомат бережно восстановлен, 
            чтобы посетители могли опустить 15 копеек и поиграть.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tickets */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-white uppercase">
                Стоимость билетов
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Каждый входной билет включает фирменный коробок с 15 оригинальными советскими 
                монетами по 15 копеек и обзорную экскурсию.
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-800">
                  <span className="text-stone-300">Полный билет (15 монет СССР)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">1 250 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-800">
                  <span className="text-stone-300">Льготный (школьники, студенты)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">1 100 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-stone-300">Дополнительный коробок (15 монет)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">350 ₽</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-500 font-soviet-mono">
              Детям до 6 лет вход свободный
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-white uppercase">
                Режим работы
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Музей открыт ежедневно без выходных. Обзорные экскурсии начинаются 
                в начале каждого часа.
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-800">
                  <span className="text-stone-300">Понедельник — Воскресенье</span>
                  <span className="font-soviet-mono font-bold text-blue-300">11:00 — 21:00</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-800">
                  <span className="text-stone-300">Касса работает до</span>
                  <span className="font-soviet-mono font-bold text-stone-400">20:00</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-stone-300">Экскурсионное обслуживание</span>
                  <span className="font-soviet-mono font-bold text-emerald-400">Каждый час</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Любительская фотосъёмка бесплатна</span>
            </div>
          </div>

          {/* Card 3: Soviet Buffet */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-red-400">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-white uppercase">
                Советский буфет
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Вкус советского детства: молочные коктейли на миксере «Воронеж-2», 
                газировка из автомата и моментальные фотополоски.
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-800">
                  <span className="text-stone-300">Молочный коктейль «Воронеж»</span>
                  <span className="font-soviet-mono font-bold text-amber-400">200 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-800">
                  <span className="text-stone-300">Газировка с сиропом из автомата</span>
                  <span className="font-soviet-mono font-bold text-amber-400">50 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-stone-300">Ч/Б полоска в фотокабине (4 фото)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">300 ₽</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Аналоговая химическая проявка 5 минут</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
