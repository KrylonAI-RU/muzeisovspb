import React, { useState, useEffect } from 'react';
import { Award, RotateCcw, XCircle, Trophy } from 'lucide-react';

interface BasketballSimulatorProps {
  coins: number;
  onUseCoin: () => void;
}

interface Hole {
  id: number;
  x: number;
  y: number;
  owner: 'player' | 'rival';
}

const HOLES: Hole[] = [
  // Player side (bottom: holes 1 to 8)
  { id: 1, x: 22, y: 76, owner: 'player' },
  { id: 2, x: 50, y: 82, owner: 'player' },
  { id: 3, x: 78, y: 76, owner: 'player' },
  { id: 4, x: 30, y: 64, owner: 'player' },
  { id: 5, x: 50, y: 67, owner: 'player' },
  { id: 6, x: 70, y: 64, owner: 'player' },
  { id: 7, x: 38, y: 52, owner: 'player' },
  { id: 8, x: 62, y: 52, owner: 'player' },
  
  // Rival side (top: holes 9 to 15)
  { id: 9, x: 50, y: 44, owner: 'rival' },
  { id: 10, x: 32, y: 36, owner: 'rival' },
  { id: 11, x: 68, y: 36, owner: 'rival' },
  { id: 12, x: 25, y: 24, owner: 'rival' },
  { id: 13, x: 50, y: 28, owner: 'rival' },
  { id: 14, x: 75, y: 24, owner: 'rival' },
  { id: 15, x: 50, y: 16, owner: 'rival' },
];

export const BasketballSimulator: React.FC<BasketballSimulatorProps> = ({
  coins,
  onUseCoin,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerScore, setPlayerScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [currentHole, setCurrentHole] = useState<number>(2);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({ x: 50, y: 82 });
  const [ballInAir, setBallInAir] = useState(false);
  const [basketFlash, setBasketFlash] = useState<'player' | 'rival' | null>(null);
  const [scorePopup, setScorePopup] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Match countdown
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

  // Fair Rival reaction loop
  useEffect(() => {
    if (!isPlaying || ballInAir) return;

    const holeData = HOLES.find((h) => h.id === currentHole);
    if (holeData && holeData.owner === 'rival') {
      // Natural athletic reaction: 700ms to 1100ms
      const delay = Math.floor(Math.random() * 400) + 750;
      const rivalTimer = setTimeout(() => {
        triggerCatapult(currentHole, true);
      }, delay);
      return () => clearTimeout(rivalTimer);
    }
  }, [isPlaying, currentHole, ballInAir]);

  // Keyboard shortcut listener for holes 1-8
  useEffect(() => {
    if (!isPlaying || ballInAir) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= 8) {
        if (num === currentHole) {
          triggerCatapult(num, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, ballInAir, currentHole]);

  const startGame = () => {
    if (coins <= 0) {
      alert('Возьмите монеты в кассе музея (нажмите на коробок в шапке).');
      return;
    }
    onUseCoin();
    setIsPlaying(true);
    setTimeLeft(60);
    setPlayerScore(0);
    setRivalScore(0);
    setGameOver(false);
    setCurrentHole(2);
    setBallPosition({ x: 50, y: 82 });
    setBallInAir(false);
    setScorePopup(null);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setBallInAir(false);
    setScorePopup(null);
  };

  // 50/50 FAIR COMPETITIVE LAUNCH
  const triggerCatapult = (holeId: number, isRivalLaunch = false) => {
    if (!isPlaying || ballInAir || holeId !== currentHole) return;

    setBallInAir(true);
    const startHole = HOLES.find((h) => h.id === holeId) || HOLES[0];

    const targetHoop = isRivalLaunch
      ? { x: 50, y: 92 } // Player's basket (bottom)
      : { x: 50, y: 8 };  // Rival's basket (top)

    // EQUAL ACCURACY: Both player and rival have the exact same 75% shooting accuracy!
    const isGoal = Math.random() < 0.75;

    let step = 0;
    const flightInterval = setInterval(() => {
      step++;
      const t = step / 12;
      const currentX = startHole.x + (targetHoop.x - startHole.x) * t;
      const currentY = startHole.y + (targetHoop.y - startHole.y) * t;

      setBallPosition({ x: currentX, y: currentY });

      if (step >= 12) {
        clearInterval(flightInterval);

        if (isGoal) {
          if (isRivalLaunch) {
            setRivalScore((s) => s + 2);
            setBasketFlash('player');
            setScorePopup('Соперник забил! +2 очка');
          } else {
            setPlayerScore((s) => s + 2);
            setBasketFlash('rival');
            setScorePopup('Вы забили! +2 очка');
          }
          setTimeout(() => setScorePopup(null), 800);
          setTimeout(() => setBasketFlash(null), 500);
        }

        // FAIR 50/50 BALL ROLL: Equal 50% chance to drop on player's side or rival's side
        setTimeout(() => {
          const landInPlayerSide = Math.random() < 0.5;
          const nextHoleId = landInPlayerSide
            ? Math.floor(Math.random() * 8) + 1  // holes 1 to 8 (player)
            : Math.floor(Math.random() * 7) + 9;  // holes 9 to 15 (rival)

          const nextHole = HOLES.find((h) => h.id === nextHoleId) || HOLES[1];
          setCurrentHole(nextHoleId);
          setBallPosition({ x: nextHole.x, y: nextHole.y });
          setBallInAir(false);
        }, 220);
      }
    }, 28);
  };

  return (
    <div className="rounded-xl bg-stone-900 border border-stone-800 p-3.5 sm:p-6 shadow-2xl text-stone-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-soviet-mono text-[11px] sm:text-xs">
              ЛЕНИНГРАДСКИЙ ЗАВОД · 1982
            </span>
            <span className="text-[11px] sm:text-xs text-stone-400">Стоимость: 15 коп. · Честный матч 50 / 50</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-display text-white mt-1">
            Купольный автомат «Баскетбол»
          </h3>
        </div>

        {/* Action Controls & Scoreboard */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          {isPlaying && (
            <button
              onClick={stopGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-red-400 border border-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer touch-manipulation"
            >
              <XCircle className="w-3.5 h-3.5" />
              Прекратить
            </button>
          )}

          <div className="flex items-center gap-2.5 sm:gap-4 bg-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-stone-800">
            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-400 font-bold">Вы</div>
              <div className="font-soviet-mono text-xl sm:text-2xl font-bold text-amber-400">
                {playerScore}
              </div>
            </div>
            <div className="text-stone-600 font-mono text-base">:</div>
            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-purple-400 font-bold">Соперник</div>
              <div className="font-soviet-mono text-xl sm:text-2xl font-bold text-purple-400">
                {rivalScore}
              </div>
            </div>
            <div className="h-6 sm:h-8 w-px bg-stone-800"></div>
            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400">Время</div>
              <div className="font-soviet-mono text-lg sm:text-xl font-bold text-blue-400">
                {timeLeft}<span className="text-xs text-stone-500">с</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dome Arena View */}
      <div className="relative my-4 sm:my-6 h-[340px] sm:h-[400px] md:h-[460px] w-full bg-[#1c1815] rounded-xl overflow-hidden border-2 sm:border-4 border-[#332a24] shadow-inner select-none flex items-center justify-center">
        {/* Parquet Court */}
        <div className="relative w-full max-w-2xl h-full bg-[#3a281c] border-x-4 border-[#523b2c] p-4 flex flex-col justify-between overflow-hidden">
          {/* Court lines */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-200/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-amber-200/20"></div>

          {/* Top Hoop (Rival's basket) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
            <div className="w-16 h-2 bg-stone-300 rounded border border-stone-500 shadow"></div>
            <div
              className={`w-12 h-8 border-2 border-red-500 rounded-b-md flex items-center justify-center transition-all ${
                basketFlash === 'rival' ? 'bg-red-500 scale-125' : 'bg-red-500/10'
              }`}
            >
              <div className="w-8 h-4 border border-dashed border-white/60"></div>
            </div>
            <span className="text-[8px] font-soviet-mono text-stone-400">КОРЗИНА СОПЕРНИКА</span>
          </div>

          {/* Holes with catapults */}
          {HOLES.map((hole) => {
            const hasBall = currentHole === hole.id;
            const isPlayerHalf = hole.owner === 'player';

            return (
              <div
                key={hole.id}
                style={{ left: `${hole.x}%`, top: `${hole.y}%` }}
                onClick={() => isPlayerHalf && triggerCatapult(hole.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  hasBall
                    ? 'ring-4 ring-amber-400 bg-black scale-115 shadow-xl animate-bounce'
                    : isPlayerHalf
                    ? 'bg-black/85 hover:bg-black border border-amber-600/60'
                    : 'bg-black/80 border border-purple-600/40'
                }`}
                title={`Лунка №${hole.id}`}
              >
                <span className={`font-soviet-mono text-xs font-bold ${isPlayerHalf ? 'text-amber-200' : 'text-purple-300'}`}>
                  {hole.id}
                </span>
                <div className="absolute inset-1 rounded-full border border-stone-700 pointer-events-none"></div>
              </div>
            );
          })}

          {/* Orange Basketball */}
          {isPlaying && (
            <div
              style={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
              }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300 shadow-md z-30 transition-transform ${
                ballInAir ? 'scale-125' : ''
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-full h-px bg-black"></div>
              </div>
            </div>
          )}

          {/* Score Popup notification */}
          {scorePopup && (
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-stone-900 text-amber-300 font-soviet-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-amber-500/40">
              {scorePopup}
            </div>
          )}

          {/* Bottom Hoop (Player's basket) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
            <span className="text-[8px] font-soviet-mono text-stone-400">ВАША КОРЗИНА</span>
            <div
              className={`w-12 h-8 border-2 border-red-500 rounded-t-md flex items-center justify-center transition-all ${
                basketFlash === 'player' ? 'bg-red-500 scale-125' : 'bg-red-500/10'
              }`}
            >
              <div className="w-8 h-4 border border-dashed border-white/60"></div>
            </div>
            <div className="w-16 h-2 bg-stone-300 rounded border border-stone-500 shadow"></div>
          </div>

          {/* Idle screen */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-40 overflow-y-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center mb-2 text-amber-400 shrink-0">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-display text-lg sm:text-xl text-white uppercase tracking-wider font-bold">
                Автомат «Баскетбол» (1982)
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mt-1.5 leading-relaxed">
                Честный поединок с равными шансами! Когда мяч падает в вашу лунку (№1–8), 
                быстро жмите на неё или клавишу с её номером. Если мяч у соперника (№9–15), он бросает 
                в вашу корзину. Кто наберёт больше очков за 60 секунд — тот и победил!
              </p>
              <button
                type="button"
                onClick={startGame}
                className="mt-4 sm:mt-5 px-6 py-3 sm:py-3.5 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-display text-xs sm:text-sm uppercase tracking-widest transition-all font-bold cursor-pointer touch-manipulation active:scale-95 shrink-0 shadow-lg border border-red-500/40"
              >
                Опустить 15 коп. и начать матч
              </button>
            </div>
          )}

          {/* Game Over Screen: Player win, Rival win, or Draw */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-40 overflow-y-auto">
              <Award className="w-9 h-9 sm:w-10 sm:h-10 text-amber-400 mb-1.5 shrink-0" />
              <h4 className="font-display text-xl sm:text-2xl text-white uppercase">
                {playerScore > rivalScore
                  ? 'ПОБЕДА ИГРОКА!'
                  : rivalScore > playerScore
                  ? 'ПОБЕДА СОПЕРНИКА!'
                  : 'НИЧЬЯ! РАВНЫЙ СЧЁТ!'}
              </h4>
              <p className="font-soviet-mono text-xl sm:text-2xl font-bold mt-1">
                <span className="text-amber-400">Вы: {playerScore}</span>
                {' '}:{' '}
                <span className="text-purple-400">Соперник: {rivalScore}</span>
              </p>
              <p className="text-xs text-stone-300 mt-1 max-w-xs">
                {playerScore > rivalScore
                  ? 'Поздравляем! Ваша реакция и меткость оказались лучше!'
                  : rivalScore > playerScore
                  ? 'В этот раз соперник вырвал победу! Возьмите реванш!'
                  : 'Упорная борьба очко в очко! Достойный поединок!'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={startGame}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Реванш (15 коп.)
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

      {/* Button Controls */}
      {isPlaying && (
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-soviet-mono text-amber-400 font-semibold">
              КЛАВИАТУРА ПРУЖИННЫХ РЫЧАГОВ:
            </span>
            <span>
              {currentHole <= 8 ? (
                <strong className="text-emerald-400 font-mono text-sm animate-pulse">
                  Мяч в вашей лунке №{currentHole}! Жмите кнопку №{currentHole}!
                </strong>
              ) : (
                <span className="text-purple-400 font-mono text-sm">
                  Мяч на стороне соперника (лунка №{currentHole})...
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
              const isHoleReady = currentHole === num && !ballInAir;
              return (
                <button
                  key={num}
                  onClick={() => triggerCatapult(num)}
                  disabled={!isHoleReady}
                  className={`py-3.5 rounded-lg font-soviet-mono text-base font-bold transition-all cursor-pointer ${
                    isHoleReady
                      ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-300 scale-105 shadow-xl animate-pulse font-extrabold'
                      : 'bg-stone-800 text-stone-500 hover:bg-stone-750 border border-stone-700 cursor-not-allowed'
                  }`}
                >
                  №{num}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
