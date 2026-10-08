import React, { useState } from 'react';
import { MapPin, Eye, Compass, Navigation, ExternalLink, Clock } from 'lucide-react';

export const MapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'panorama' | 'map' | 'routes'>('panorama');

  return (
    <section id="location-map" className="py-16 border-t border-stone-800 bg-[#121418] text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              <span>Санкт-Петербург · Конюшенная площадь, 2В</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1 uppercase">
              3D-Панорама и Яндекс.Карта музея
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-2xl">
              Музей расположен в историческом центре Петербурга, в пяти минутах ходьбы от Спаса на Крови. 
              Осмотритесь вокруг в 360-градусной уличной панораме или изучите маршрут от станций метро.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('panorama')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'panorama'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Панорама 360°
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'map'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Схема на карте
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'routes'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              Как добраться
            </button>
          </div>
        </div>

        {/* Tab 1: 360 Panorama View */}
        {activeTab === 'panorama' && (
          <div className="rounded-xl border border-stone-800 overflow-hidden bg-black shadow-xl">
            <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5 font-soviet-mono text-amber-300">
                <Eye className="w-4 h-4 text-amber-400" />
                Вид на Конюшенную площадь и фасад здания музея (вращайте мышью на 360°)
              </span>
              <a
                href="https://yandex.ru/maps/2/saint-petersburg/?l=stv%2Csta&ll=30.326880%2C59.940560&panorama%5Bpoint%5D=30.326880%2C59.940560"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
              >
                Открыть на Яндекс.Картах <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full h-[480px]">
              <iframe
                title="Панорама Конюшенной площади — Музей советских игровых автоматов"
                src="https://yandex.ru/map-widget/v1/?l=stv%2Csta&panorama%5Bdirection%5D=148.000000%2C5.000000&panorama%5Bfull%5D=true&panorama%5Bpoint%5D=30.326880%2C59.940560&panorama%5Bspan%5D=115.000000%2C60.000000"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full border-0"
              ></iframe>
            </div>

            <div className="p-3 bg-stone-900 text-xs text-stone-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-stone-800">
              <div>
                <strong className="text-stone-200">Управление:</strong> Зажмите левую кнопку мыши и двигайте курсор для кругового обзора площади и арки входа во внутренний двор.
              </div>
              <div className="font-soviet-mono text-amber-400">
                Координаты: 59.940560° N, 30.326880° E
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Yandex Map */}
        {activeTab === 'map' && (
          <div className="rounded-xl border border-stone-800 overflow-hidden bg-black shadow-xl">
            <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5 font-soviet-mono text-amber-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                Санкт-Петербург, Конюшенная пл., дом 2, литер В
              </span>
              <a
                href="https://yandex.ru/maps/org/muzey_sovetskikh_igrovykh_avtomatov/1023812705/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
              >
                Карточка музея на Яндексе <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative w-full h-[480px]">
              <iframe
                title="Карта музея — Конюшенная площадь 2В"
                src="https://yandex.ru/map-widget/v1/?ll=30.326880%2C59.940560&z=17&pt=30.326880,59.940560,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        )}

        {/* Tab 3: Pedestrian Routes */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-soviet-mono text-xs">
                  Метро «Невский проспект»
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> 5 минут
                </span>
              </div>
              <h3 className="font-display text-base text-white font-semibold">
                Выход на канал Грибоедова
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Выходите из метро в сторону Спаса на Крови. Идите вдоль набережной канала Грибоедова 
                мимо храма. Сразу за храмом перейдите Ново-Конюшенный мост и поверните налево на Конюшенную площадь. 
                Вход через арку во двор.
              </p>
              <div className="pt-2 border-t border-stone-800 text-[11px] text-amber-400 font-soviet-mono">
                Расстояние: ~450 метров пешком
              </div>
            </div>

            <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-green-950 border border-green-800 text-green-300 font-soviet-mono text-xs">
                  Метро «Гостиный двор»
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> 7 минут
                </span>
              </div>
              <h3 className="font-display text-base text-white font-semibold">
                Через площадь Искусств
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Выход на Михайловскую улицу. Пройдите мимо Гранд Отеля Европа к площади Искусств, 
                затем по Инженерной улице сверните в сторону Конюшенной площади. На углу видна вывеска музея.
              </p>
              <div className="pt-2 border-t border-stone-800 text-[11px] text-amber-400 font-soviet-mono">
                Расстояние: ~650 метров пешком
              </div>
            </div>

            <div className="p-6 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-soviet-mono text-xs">
                  На автомобиле и такси
                </span>
                <span className="text-xs text-stone-400">Парковка</span>
              </div>
              <h3 className="font-display text-base text-white font-semibold">
                Конюшенная площадь
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Городская платная парковка (зона № 7801) расположена прямо на Конюшенной площади. 
                Проход в музей осуществляется через арку исторического двора 
                Конюшенного ведомства.
              </p>
              <div className="pt-2 border-t border-stone-800 text-[11px] text-amber-400 font-soviet-mono">
                Зона платной парковки СПб: № 7801
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
