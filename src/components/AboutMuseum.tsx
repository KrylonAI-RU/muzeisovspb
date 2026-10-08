import React from 'react';
import { BookOpen, Factory, Users, History, Wrench, ShieldCheck } from 'lucide-react';

export const AboutMuseum: React.FC = () => {
  return (
    <section id="about" className="py-14 sm:py-16 bg-[#111317] border-t border-stone-800 text-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-soviet-mono text-amber-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            <span>ЛЕТОПИСЬ МУЗЕЯ · ИСТОРИЧЕСКИЙ АРХИВ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white uppercase tracking-tight">
            История создания и советская инженерная мысль
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
            От студенческой мечты найти один аппарат для подвала до крупнейшей в мире коллекции 
            советской интерактивной электромеханики.
          </p>
        </div>

        {/* 3 Archival Chronicle Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chapter 1 */}
          <div className="p-5 sm:p-6 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3 relative">
            <div className="text-xs font-soviet-mono text-amber-400 font-bold uppercase tracking-wider">
              01 · НАЧАЛО И ПОИСК (2007)
            </div>
            <h3 className="font-display text-lg text-white font-bold uppercase">
              Первый «Морской бой»
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Основатели музея — Александр Стаханов, Александр Вугман и Максим Пинигин — искали 
              для себя один аппарат из пионерского детства. Первый легендарный «Морской бой» 
              был найден в заброшенном пионерлагере под Талдомом, отмыт от вековой пыли и 
              восстановлен вручную.
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="p-5 sm:p-6 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3 relative">
            <div className="text-xs font-soviet-mono text-red-400 font-bold uppercase tracking-wider">
              02 · ОБОРОННАЯ КОНВЕРСИЯ (1971–1991)
            </div>
            <h3 className="font-display text-lg text-white font-bold uppercase">
              Военные заводы СССР
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              После всесоюзной выставки 1971 года ЦК КПСС распорядился производить игровые автоматы 
              на закрытых оборонных предприятиях. В аппаратах применялись электромагнитные реле систем 
              связи, оптические призмы танковых прицелов и корабельная броневая сталь.
            </p>
          </div>

          {/* Chapter 3 */}
          <div className="p-5 sm:p-6 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3 relative">
            <div className="text-xs font-soviet-mono text-emerald-400 font-bold uppercase tracking-wider">
              03 · ЖИВАЯ МАСТЕРСКАЯ (2013)
            </div>
            <h3 className="font-display text-lg text-white font-bold uppercase">
              Конюшенная площадь, 2В
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Ленинградский филиал разместился в сводчатых палатах Придворно-конюшенного ведомства XVIII века. 
              Главное правило музея — «руками трогать обязательно». В открытой мастерской инженеры-реставраторы 
              ежедневно поддерживают жизнь уникальной техники.
            </p>
          </div>
        </div>

        {/* Technical Regulation / ГОСТ Plaque */}
        <div className="p-6 sm:p-8 rounded-xl bg-stone-900/70 border border-stone-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div className="text-xs font-soviet-mono text-amber-400 font-bold uppercase tracking-wider">
              ТЕХНИЧЕСКИЙ РЕГЛАМЕНТ · МОНЕТОПРИЁМНИК МП-15
            </div>
            <div className="text-[11px] font-soviet-mono text-stone-400">
              ЕДИНЫЙ ТАРИФ: 15 КОПЕЕК (ГОСТ 28243-89)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-300 leading-relaxed">
            <p>
              В СССР практически все игровые автоматы имели фиксированную цену игры — <strong>15 копеек</strong>. 
              Для школьника это была осязаемая сумма: стоимость порции пломбира, трёх стаканов газировки с сиропом 
              или трёх поездок в ленинградском метро.
            </p>
            <p>
              Чтобы исключить подделки и пуговицы, монетоприёмник МП-15 проверял каждую монету по физическим параметрам: 
              диаметр 19,56 мм, толщина 1,2 мм, вес 2,5 г и магнитная проницаемость сплава нейзильбер. Неподходящие монеты 
              механически сбрасывались в карман возврата сдачи.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
