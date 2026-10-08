import React from 'react';
import { BookOpen, Factory, Users, History, Wrench, ShieldCheck } from 'lucide-react';

export const AboutMuseum: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-[#111317] border-t border-stone-800 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-soviet-mono text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Летопись и исторический контекст</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white uppercase">
            История создания музея и эпоха советских игровых аппаратов
          </h2>
          <p className="text-sm text-stone-400 mt-2 leading-relaxed">
            Как студенческая мечта найти один автомат для подвала переросла в крупнейший 
            в мире интерактивный музей советской игровой инженерии.
          </p>
        </div>

        {/* 4 Thematic Columns / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: 2007 - The Beginning */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
              <History className="w-4 h-4" />
            </div>
            <div className="font-soviet-mono text-xs text-amber-400">2007 ГОД · НАЧАЛО</div>
            <h3 className="font-display text-lg text-white font-bold uppercase">
              Первый «Морской бой»
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Основатели музея — Александр Стаханов, Александр Вугман и Максим Пинигин — 
              искали для себя аппарат из детства. Первый «Морской бой» нашли в заброшенном 
              пионерлагере под Талдомом, отмыли от пыли и восстановили своими руками.
            </p>
          </div>

          {/* Card 2: 2013 - Saint Petersburg */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-red-400">
              <Users className="w-4 h-4" />
            </div>
            <div className="font-soviet-mono text-xs text-red-400">2013 ГОД · ПЕТЕРБУРГ</div>
            <h3 className="font-display text-lg text-white font-bold uppercase">
              Конюшенная площадь, 2В
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Музей открыл свои двери в Санкт-Петербурге в историческом ансамбле Придворно-конюшенного 
              ведомства XVIII века (рядом с храмом Спас на Крови). Пространство со сводчатыми потолками 
              стало домом для более чем полусотни аппаратов.
            </p>
          </div>

          {/* Card 3: Defense Conversion */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-blue-400">
              <Factory className="w-4 h-4" />
            </div>
            <div className="font-soviet-mono text-xs text-blue-400">1971–1991 · КОНВЕРСИЯ</div>
            <h3 className="font-display text-lg text-white font-bold uppercase">
              Военные заводы СССР
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              После выставки в Парке Горького 1971 года ЦК КПСС распорядился наладить выпуск 
              отечественных автоматов на закрытых оборонных заводах. В аппаратах применялись 
              реле из систем военной связи, танковая оптика и корабельная сталь.
            </p>
          </div>

          {/* Card 4: Restoration Lab */}
          <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="font-soviet-mono text-xs text-emerald-400">ФИЛОСОФИЯ МУЗЕЯ</div>
            <h3 className="font-display text-lg text-white font-bold uppercase">
              Руками трогать — нужно!
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              В отличие от академических выставок, здесь все экспонаты рабочие. В музее 
              действует открытая мастерская: инженеры ежедневно паяют контакты, регулируют 
              монетоприёмники и поддерживают жизнь уникальной техники полувековой давности.
            </p>
          </div>
        </div>

        {/* Detailed Narrative Block */}
        <div className="p-8 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-6">
          <h3 className="font-display text-xl text-white uppercase font-bold">
            Почему билет — это спичечный коробок с 15 монетами?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-300 leading-relaxed">
            <p>
              В Советском Союзе практически все игровые автоматы имели единую фиксированную 
              цену игры — <strong>15 копеек</strong>. Это была серьёзная сумма для советского 
              школьника: на 15 копеек можно было купить эскимо, три стакана газировки с сиропом 
              или три поездки на ленинградском метрополитене.
            </p>
            <p>
              Чтобы исключить использование подделок и пуговиц, монетоприёмный механизм 
              (модель МП-15) проверял опускаемую монету сразу по нескольким физическим критериям: 
              диаметр ровно 19,56 мм, толщина 1,2 мм, масса 2,5 грамма и магнитная проницаемость 
              сплава нейзильбер (медь-никель-цинк). Если параметры не совпадали, монета с глухим 
              стуком вываливалась в карман возврата.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs font-soviet-mono text-stone-400">
            <div>
              Официальный сайт музея: <span className="text-amber-400">15kop.ru</span>
            </div>
            <div>
              Адрес филиала: <span className="text-stone-200">Санкт-Петербург, Конюшенная пл., 2В</span>
            </div>
            <div>
              Телефон: <span className="text-stone-200">+7 (812) 740-02-40</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
