import React from 'react';
import { MapPin, Phone, Mail, Globe, UserCheck, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0e1014] border-t border-stone-800 text-stone-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
          {/* Col 1: Museum About */}
          <div className="space-y-3">
            <div className="text-base font-bold font-display uppercase text-white tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              Музей советских автоматов
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              Санкт-Петербург, Конюшенная площадь, дом 2, литера В. 
              Историко-технический музей действующих аркадных автоматов СССР. 
              Коллекция насчитывает свыше 50 функционирующих экспонатов 1970–1990 годов.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <div className="text-stone-200 font-semibold uppercase tracking-wider text-[11px] font-soviet-mono">
              Разделы сайта
            </div>
            <ul className="space-y-1.5 text-stone-400">
              <li><a href="#about" className="hover:text-amber-400 transition-colors">История музея</a></li>
              <li><a href="#exhibits" className="hover:text-amber-400 transition-colors">Каталог автоматов</a></li>
              <li><a href="#simulators" className="hover:text-amber-400 transition-colors">Игровые симуляторы</a></li>
              <li><a href="#hall-plan" className="hover:text-amber-400 transition-colors">Схема залов</a></li>
              <li><a href="#location-map" className="hover:text-amber-400 transition-colors">3D-Панорама и карта</a></li>
              <li><a href="#visit" className="hover:text-amber-400 transition-colors">Билеты и часы работы</a></li>
            </ul>
          </div>

          {/* Col 3: Official Contacts */}
          <div className="space-y-2">
            <div className="text-stone-200 font-semibold uppercase tracking-wider text-[11px] font-soviet-mono">
              Контакты музея в СПб
            </div>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>СПб, Конюшенная пл., 2В (вход во дворе)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+7 (812) 740-02-40</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>spb@15kop.ru</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Официальный сайт: 15kop.ru</span>
              </div>
            </div>
          </div>

          {/* Col 4: School Project Author Credit */}
          <div className="space-y-3 p-4 rounded-xl bg-stone-900 border border-stone-800">
            <div className="text-stone-200 font-semibold uppercase tracking-wider text-[11px] font-soviet-mono flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Школьный учебный проект
            </div>
            <div className="space-y-1">
              <div className="text-xs text-stone-400">Создатель сайта:</div>
              <div className="text-sm font-bold text-white font-display">
                Зубак Даниил
              </div>
              <div className="text-xs text-amber-400 font-soviet-mono font-bold">
                10 «Б» класс
              </div>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal border-t border-stone-800 pt-2">
              Статический сайт подготовлен для публикации на GitHub Pages без серверных зависимостей.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div>
            © 2007–2026 Музей советских игровых автоматов · Проект ученика 10 «Б» класса Зубака Даниила
          </div>
          <div className="flex items-center gap-3">
            <span>Санкт-Петербург</span>
            <span>·</span>
            <span>Конюшенная площадь, 2В</span>
            <span>·</span>
            <span className="text-amber-500 font-soviet-mono">15 копеек</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
