import React from 'react';
import { Clock, Ticket, Coffee, Camera, ShieldCheck } from 'lucide-react';

export const VisitInfo: React.FC = () => {
  return (
    <section id="visit" className="py-14 sm:py-16 bg-[#14161c] border-t border-stone-800 text-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl">
          <div className="text-xs font-soviet-mono text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>СПРАВОЧНОЕ БЮРО · ПРАВИЛА И ТАРИФЫ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white uppercase tracking-tight">
            Посещение музея и советский буфет
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            В музее нет табличек «руками не трогать». Каждый билет включает спичечный коробок с 15 монетами СССР 
            для игры на подлинных аппаратах.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Tickets */}
          <div className="p-5 sm:p-6 rounded-xl bg-stone-900/90 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-soviet-mono text-amber-400 font-bold uppercase tracking-wider border-b border-stone-800 pb-2 flex items-center justify-between">
                <span>01 · ПРЕЙСКУРАНТ КАССЫ</span>
                <Ticket className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-display text-white uppercase">
                Входные билеты
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                В стоимость каждого билета включён коробок с 15 советскими 15-копеечными монетами и обзорная экскурсия.
              </p>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-stone-800">
                  <span className="text-stone-300">Полный билет (15 монет)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">1 250 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-800">
                  <span className="text-stone-300">Льготный (школьники, студенты)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">1 100 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-stone-300">Дополнительный коробок (15 монет)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">350 ₽</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 font-soviet-mono border-t border-stone-800">
              Детям до 6 лет вход свободный
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="p-5 sm:p-6 rounded-xl bg-stone-900/90 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-soviet-mono text-amber-400 font-bold uppercase tracking-wider border-b border-stone-800 pb-2 flex items-center justify-between">
                <span>02 · РЕЖИМ РАБОТЫ</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-display text-white uppercase">
                Часы работы и экскурсии
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Музей открыт ежедневно без перерывов и выходных дней. Обзорные экскурсии проводятся в начале каждого часа.
              </p>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-stone-800">
                  <span className="text-stone-300">Понедельник — Воскресенье</span>
                  <span className="font-soviet-mono font-bold text-stone-200">11:00 — 21:00</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-800">
                  <span className="text-stone-300">Касса работает до</span>
                  <span className="font-soviet-mono font-bold text-stone-400">20:00</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-stone-300">Экскурсионное сопровождение</span>
                  <span className="font-soviet-mono font-bold text-emerald-400">Каждый час</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 font-soviet-mono border-t border-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Любительская фотосъёмка бесплатна</span>
            </div>
          </div>

          {/* Card 3: Soviet Buffet */}
          <div className="p-5 sm:p-6 rounded-xl bg-stone-900/90 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-soviet-mono text-amber-400 font-bold uppercase tracking-wider border-b border-stone-800 pb-2 flex items-center justify-between">
                <span>03 · СОВЕТСКИЙ БУФЕТ</span>
                <Coffee className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-display text-white uppercase">
                Меню буфета и фотокабина
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Вкус эпохи: взбитые молочные коктейли на миксере «Воронеж-2», газировка с двойным сиропом и аналоговая фотополоска.
              </p>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-stone-800">
                  <span className="text-stone-300">Молочный коктейль «Воронеж»</span>
                  <span className="font-soviet-mono font-bold text-amber-400">200 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-stone-800">
                  <span className="text-stone-300">Газировка с сиропом из автомата</span>
                  <span className="font-soviet-mono font-bold text-amber-400">50 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-stone-300">Ч/Б полоска в фотокабине (4 фото)</span>
                  <span className="font-soviet-mono font-bold text-amber-400">300 ₽</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 font-soviet-mono border-t border-stone-800 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Аналоговая проявка 5 минут</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
