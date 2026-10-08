import React, { useState, useEffect } from 'react';
import { Award, RotateCcw, XCircle } from 'lucide-react';

interface MagistralSimulatorProps {
  coins: number;
  onUseCoin: () => void;
}

interface ObstacleCar {
  id: number;
  lane: number;
  y: number;
  speed: number;
}

export const MagistralSimulator: React.FC<MagistralSimulatorProps> = ({
  coins,
  onUseCoin,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerLane, setPlayerLane] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [crashed, setCrashed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [obstacles, setObstacles] = useState<ObstacleCar[]>([
    { id: 1, lane: 0, y: -20, speed: 1.5 },
    { id: 2, lane: 2, y: -60, speed: 1.2 },
  ]);

  useEffect(() => {
    if (!isPlaying || crashed) return;

    const gameInterval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((car) => {
          let newY = car.y + car.speed;
          if (newY > 105) {
            const newLane = Math.floor(Math.random() * 3);
            newY = -20;
            setScore((s) => s + 10);
            return { ...car, lane: newLane, y: newY };
          }

          if (newY >= 75 && newY <= 90 && car.lane === playerLane) {
            setCrashed(true);
            setTimeout(() => {
              setCrashed(false);
            }, 800);
          }

          return { ...car, y: newY };
        })
      );
    }, 40);

    return () => clearInterval(gameInterval);
  }, [isPlaying, crashed, playerLane]);

  // Arrow keys steering
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        steerLeft();
      } else if (e.key === 'ArrowRight') {
        steerRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const startGame = () => {
    if (coins <= 0) {
      alert('Возьмите монеты в кассе музея (нажмите на коробок в шапке).');
      return;
    }
    onUseCoin();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setCrashed(false);
    setGameOver(false);
    setPlayerLane(1);
    setObstacles([
      { id: 1, lane: 0, y: -10, speed: 2 },
      { id: 2, lane: 2, y: -50, speed: 1.6 },
    ]);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setCrashed(false);
  };

  const steerLeft = () => {
    if (!isPlaying) return;
    setPlayerLane((l) => Math.max(0, l - 1));
  };

  const steerRight = () => {
    if (!isPlaying) return;
    setPlayerLane((l) => Math.min(2, l + 1));
  };

  return (
    <div className="rounded-xl bg-stone-900 border border-stone-800 p-3.5 sm:p-6 shadow-2xl text-stone-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-soviet-mono text-[11px] sm:text-xs">
              ПО «РАДАР» ЛЕНИНГРАД · 1977
            </span>
            <span className="text-[11px] sm:text-xs text-stone-400">Стоимость: 15 копеек</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-display text-white mt-1">
            Кольцевой автосимулятор «Магистраль»
          </h3>
        </div>

        {/* Action Controls & Dashboard Indicators */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          {isPlaying && (
            <button
              onClick={stopGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-red-400 border border-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer touch-manipulation"
              title="Прекратить текущий заезд"
            >
              <XCircle className="w-3.5 h-3.5" />
              Прекратить
            </button>
          )}

          <div className="flex items-center gap-2.5 sm:gap-4 bg-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-stone-800">
            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400">Время</div>
              <div className="font-soviet-mono text-lg sm:text-xl font-bold text-amber-400">
                {timeLeft}<span className="text-xs text-stone-500">с</span>
              </div>
            </div>
            <div className="h-6 sm:h-7 w-px bg-stone-800"></div>
            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400">Очки</div>
              <div className="font-soviet-mono text-lg sm:text-xl font-bold text-emerald-400">
                {score}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="relative my-4 sm:my-6 h-[340px] sm:h-[390px] md:h-[420px] w-full bg-[#051109] rounded-xl overflow-hidden border-2 sm:border-4 border-stone-800 flex items-center justify-center select-none">
        <div className="relative w-full max-w-md h-full flex justify-between px-6 border-x-2 border-green-900 bg-[#08180d]">
          <div className="absolute top-0 bottom-0 left-1/3 w-0.5 border-l-2 border-dashed border-green-800"></div>
          <div className="absolute top-0 bottom-0 left-2/3 w-0.5 border-l-2 border-dashed border-green-800"></div>

          {isPlaying &&
            obstacles.map((car) => {
              const laneX = car.lane === 0 ? '16%' : car.lane === 1 ? '50%' : '84%';
              return (
                <div
                  key={car.id}
                  style={{
                    left: laneX,
                    top: `${car.y}%`,
                  }}
                  className="absolute transform -translate-x-1/2 transition-all duration-75 z-10"
                >
                  <div className="w-8 h-14 bg-red-700 rounded-sm border border-red-500 flex flex-col justify-between items-center py-1">
                    <div className="w-6 h-2 bg-yellow-300 rounded-xs"></div>
                    <div className="text-[7px] font-mono font-bold text-white">ТАКСИ</div>
                    <div className="w-6 h-1.5 bg-red-900 rounded-xs"></div>
                  </div>
                </div>
              );
            })}

          {isPlaying && (
            <div
              style={{
                left: playerLane === 0 ? '16%' : playerLane === 1 ? '50%' : '84%',
                bottom: '10%',
              }}
              className={`absolute transform -translate-x-1/2 transition-all duration-100 z-15 ${
                crashed ? 'opacity-30' : ''
              }`}
            >
              <div className="w-10 h-16 bg-green-600 rounded-sm border border-green-300 flex flex-col justify-between items-center py-1.5">
                <div className="w-8 h-2.5 bg-green-900 rounded-xs"></div>
                <div className="text-[8px] font-soviet-mono font-bold text-black bg-green-300 px-1 rounded-xs">
                  РАДАР
                </div>
                <div className="w-8 h-2 bg-green-950 rounded-xs"></div>
              </div>
            </div>
          )}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30 overflow-y-auto">
              <h4 className="font-display text-lg sm:text-2xl text-white uppercase tracking-wider font-bold">
                Авторалли «Магистраль» (1977)
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 max-w-sm mt-1.5 leading-relaxed">
                Управляйте спорткаром на скоростном шоссе стрелками на клавиатуре или кнопками руля. 
                Избегайте столкновений со встречными такси!
              </p>
              <button
                type="button"
                onClick={startGame}
                className="mt-4 sm:mt-5 px-6 py-3 sm:py-3.5 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-display text-xs sm:text-sm uppercase tracking-widest transition-all font-bold cursor-pointer touch-manipulation active:scale-95 shadow-lg border border-red-500/40 shrink-0"
              >
                Опустить 15 коп. и начать заезд
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30 overflow-y-auto">
              <Award className="w-9 h-9 sm:w-10 sm:h-10 text-amber-400 mb-1.5 shrink-0" />
              <h4 className="font-display text-xl sm:text-2xl text-white uppercase">
                Заезд окончен!
              </h4>
              <p className="font-soviet-mono text-lg sm:text-xl text-green-400 mt-1">
                Ваш результат: {score} очков
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={startGame}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Повторить заезд (15 коп.)
                </button>
                <button
                  type="button"
                  onClick={stopGame}
                  className="px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-300 text-xs font-semibold uppercase tracking-wider transition-colors border border-stone-700 cursor-pointer touch-manipulation"
                >
                  Выйти в меню
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isPlaying && (
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 bg-stone-950 p-3 sm:p-4 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={steerLeft}
            className="flex-1 max-w-[180px] py-3 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white font-display text-xs uppercase tracking-widest transition-colors border border-stone-700 cursor-pointer touch-manipulation"
          >
            ◄ Руль влево
          </button>
          <div className="px-2 sm:px-4 text-center font-soviet-mono text-xs text-amber-400 font-semibold shrink-0">
            {playerLane === 0 ? 'ЛЕВАЯ' : playerLane === 1 ? 'ЦЕНТР' : 'ПРАВАЯ'}
          </div>
          <button
            type="button"
            onClick={steerRight}
            className="flex-1 max-w-[180px] py-3 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-white font-display text-xs uppercase tracking-widest transition-colors border border-stone-700 cursor-pointer touch-manipulation"
          >
            Руль вправо ►
          </button>
        </div>
      )}
    </div>
  );
};
