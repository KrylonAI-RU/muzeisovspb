import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, Award, RotateCcw, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface MorskoiBoiSimulatorProps {
  coins: number;
  onUseCoin: () => void;
}

interface Ship {
  id: number;
  x: number;
  speed: number;
  type: 'battleship' | 'destroyer' | 'cutter';
  name: string;
  points: number;
  direction: 1 | -1;
  hitTimer: number; // > 0 if currently hit
}

export const MorskoiBoiSimulator: React.FC<MorskoiBoiSimulatorProps> = ({
  coins,
  onUseCoin,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [torpedoesLeft, setTorpedoesLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [periscopeAngle, setPeriscopeAngle] = useState(50); // percentage 10 to 90
  
  // Torpedo flight state: y from 90% (bottom) to 36% (horizon)
  const [torpedo, setTorpedo] = useState<{ x: number; y: number } | null>(null);
  const [explosion, setExplosion] = useState<{ x: number; points: number } | null>(null);
  const [splash, setSplash] = useState<{ x: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const [ships, setShips] = useState<Ship[]>([
    { id: 1, x: 20, speed: 0.22, type: 'battleship', name: 'Крейсер', points: 1, direction: 1, hitTimer: 0 },
    { id: 2, x: 70, speed: 0.38, type: 'destroyer', name: 'Эсминец', points: 2, direction: -1, hitTimer: 0 },
    { id: 3, x: 40, speed: 0.55, type: 'cutter', name: 'Катер', points: 3, direction: 1, hitTimer: 0 },
  ]);

  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const viewportRef = useRef<HTMLDivElement>(null);

  // Smooth keyboard periscope movement loop
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    const updatePeriscope = () => {
      if (keysPressed.current.left) {
        setPeriscopeAngle((prev) => Math.max(10, prev - 0.7));
      }
      if (keysPressed.current.right) {
        setPeriscopeAngle((prev) => Math.min(90, prev + 0.7));
      }
      animId = requestAnimationFrame(updatePeriscope);
    };

    animId = requestAnimationFrame(updatePeriscope);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = true;
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        launchTorpedo();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isPlaying, torpedo, torpedoesLeft]);

  // Smooth mouse & touch drag periscope aiming over viewport
  const handleViewportMove = (clientX: number) => {
    if (!isPlaying || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(10, Math.min(90, relativeX));
    setPeriscopeAngle(clamped);
  };

  const handleViewportMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleViewportMove(e.clientX);
  };

  const handleViewportTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleViewportMove(e.touches[0].clientX);
    }
  };

  // Ship movement and hit timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setShips((prev) =>
        prev.map((ship) => {
          let newX = ship.x + ship.speed * ship.direction;
          let newDir = ship.direction;
          if (newX > 92) {
            newX = 92;
            newDir = -1;
          } else if (newX < 8) {
            newX = 8;
            newDir = 1;
          }

          const newHitTimer = ship.hitTimer > 0 ? ship.hitTimer - 1 : 0;
          return { ...ship, x: newX, direction: newDir, hitTimer: newHitTimer };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Torpedo flight loop (from bottom y=90% up to horizon y=36%)
  useEffect(() => {
    if (!torpedo) return;

    const flightInterval = setInterval(() => {
      setTorpedo((prev) => {
        if (!prev) return null;
        const newY = prev.y - 3.5; // flight speed

        // Check impact at horizon (y <= 36%)
        if (newY <= 36) {
          // Generous hit check: compare torpedo.x to each ship.x
          const hitTarget = ships.find((s) => {
            const hitZone = s.type === 'battleship' ? 14 : s.type === 'destroyer' ? 10 : 8;
            return Math.abs(s.x - prev.x) < hitZone;
          });

          if (hitTarget) {
            // Hit!
            setExplosion({ x: hitTarget.x, points: hitTarget.points });
            setScore((sc) => sc + hitTarget.points);

            // Mark ship as hit
            setShips((currentShips) =>
              currentShips.map((s) => (s.id === hitTarget.id ? { ...s, hitTimer: 25 } : s))
            );

            setTimeout(() => setExplosion(null), 1000);
          } else {
            // Miss splash
            setSplash({ x: prev.x });
            setTimeout(() => setSplash(null), 700);
          }

          // Check if out of torpedoes
          if (torpedoesLeft <= 0) {
            setTimeout(() => {
              setGameOver(true);
              setIsPlaying(false);
            }, 800);
          }

          return null;
        }

        return { ...prev, y: newY };
      });
    }, 30);

    return () => clearInterval(flightInterval);
  }, [torpedo, ships, torpedoesLeft]);

  const startGame = () => {
    if (coins <= 0) {
      alert('Возьмите монеты в кассе музея (нажмите на коробок в шапке).');
      return;
    }
    onUseCoin();
    setIsPlaying(true);
    setTorpedoesLeft(10);
    setScore(0);
    setGameOver(false);
    setTorpedo(null);
    setExplosion(null);
    setSplash(null);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setTorpedo(null);
    setExplosion(null);
    setSplash(null);
  };

  const launchTorpedo = () => {
    if (!isPlaying || torpedo !== null || torpedoesLeft <= 0) return;

    setTorpedoesLeft((prev) => prev - 1);
    setTorpedo({ x: periscopeAngle, y: 92 });
  };

  // Render SVG warship
  const renderShipSvg = (ship: Ship) => {
    const isFlipped = ship.direction === -1;
    const isHit = ship.hitTimer > 0;

    const shipColor = isHit ? 'text-red-500 animate-pulse' : 'text-slate-900';

    if (ship.type === 'battleship') {
      return (
        <svg
          viewBox="0 0 140 32"
          className={`w-32 sm:w-40 h-8 fill-current drop-shadow-md transition-transform ${shipColor} ${
            isFlipped ? 'scale-x-[-1]' : ''
          }`}
        >
          <path d="M 0 24 L 18 30 L 126 30 L 140 22 L 132 20 L 12 20 Z" />
          <rect x="25" y="16" width="12" height="4" />
          <path d="M 18 17 L 30 17" stroke="currentColor" strokeWidth="2" />
          <rect x="42" y="12" width="22" height="8" />
          <rect x="48" y="6" width="10" height="6" />
          <rect x="68" y="10" width="8" height="10" />
          <rect x="80" y="14" width="18" height="6" />
          <rect x="102" y="16" width="12" height="4" />
          <path d="M 108 17 L 122 17" stroke="currentColor" strokeWidth="2" />
          <line x1="53" y1="2" x2="53" y2="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    }

    if (ship.type === 'destroyer') {
      return (
        <svg
          viewBox="0 0 100 24"
          className={`w-24 sm:w-28 h-6 fill-current drop-shadow-md transition-transform ${shipColor} ${
            isFlipped ? 'scale-x-[-1]' : ''
          }`}
        >
          <path d="M 0 18 L 12 22 L 90 22 L 100 16 L 94 15 L 8 15 Z" />
          <rect x="20" y="12" width="16" height="4" />
          <rect x="40" y="8" width="14" height="7" />
          <rect x="58" y="10" width="8" height="5" />
          <rect x="72" y="12" width="10" height="3" />
          <line x1="14" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 60 16"
        className={`w-14 sm:w-18 h-4 fill-current drop-shadow-md transition-transform ${shipColor} ${
          isFlipped ? 'scale-x-[-1]' : ''
        }`}
      >
        <path d="M 0 12 L 8 15 L 54 15 L 60 10 L 52 9 L 6 9 Z" />
        <rect x="18" y="5" width="12" height="5" />
        <line x1="24" y1="1" x2="24" y2="5" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  };

  return (
    <div className="rounded-xl bg-stone-900 border border-stone-800 p-3.5 sm:p-6 shadow-2xl text-stone-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-soviet-mono text-[11px] sm:text-xs">
              СЕРПУХОВСКИЙ РТЗ · 1973
            </span>
            <span className="text-[11px] sm:text-xs text-stone-400">Стоимость игры: 15 копеек</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-display text-white mt-1">
            Оптический симулятор «Морской бой»
          </h3>
        </div>

        {/* Action Controls & Indicators */}
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

          {/* Torpedo mechanical lamp bank */}
          <div className="flex items-center gap-2.5 sm:gap-3 bg-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-stone-800">
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400">Торпеды</div>
              <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 sm:w-2 h-3 sm:h-3.5 rounded-xs transition-colors ${
                      idx < torpedoesLeft
                        ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]'
                        : 'bg-stone-800'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="h-6 sm:h-7 w-px bg-stone-800"></div>

            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400">Очки</div>
              <div className="font-soviet-mono text-lg sm:text-xl font-bold text-amber-400">
                {score}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Periscope Viewport - Guaranteed height on mobile screens */}
      <div
        ref={viewportRef}
        onMouseMove={handleViewportMouseMove}
        onTouchMove={handleViewportTouchMove}
        onTouchStart={(e) => {
          if (e.touches.length > 0) handleViewportMove(e.touches[0].clientX);
        }}
        onClick={launchTorpedo}
        className="relative my-4 sm:my-6 h-[340px] sm:h-[400px] md:h-[460px] w-full bg-[#0a0f16] rounded-xl overflow-hidden border-2 sm:border-4 border-[#1e232b] shadow-inner flex items-center justify-center select-none cursor-crosshair touch-none"
      >
        {/* Rubber Viewfinder Bezel */}
        <div className="absolute inset-0 pointer-events-none rounded-lg shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] z-20"></div>

        {/* Sea Arena */}
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#111e30] via-[#1a2d44] to-[#081522]">
          {/* Distant Coastline & Sky */}
          <div className="absolute top-0 left-0 right-0 h-[36%] overflow-hidden pointer-events-none">
            <div className="absolute top-4 right-20 w-8 h-8 rounded-full bg-amber-100/20 blur-xs"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#0a1524] opacity-50 [clip-path:polygon(0%_100%,10%_30%,25%_70%,40%_20%,60%_80%,75%_40%,90%_70%,100%_20%,100%_100%)]"></div>
          </div>

          {/* Sea Horizon Line */}
          <div className="absolute top-[36%] left-0 right-0 h-1 bg-cyan-700/60 shadow-sm z-5"></div>

          {/* Sea Water Wave Layers */}
          <div className="absolute top-[36%] bottom-0 left-0 right-0 bg-gradient-to-b from-[#0c2237] via-[#081a2b] to-[#040f1a] overflow-hidden pointer-events-none">
            <div className="absolute top-6 left-0 right-0 h-px bg-cyan-500/20"></div>
            <div className="absolute top-16 left-0 right-0 h-px bg-cyan-500/15"></div>
            <div className="absolute top-32 left-0 right-0 h-px bg-cyan-500/10"></div>
          </div>

          {/* Warships sailing along horizon */}
          {isPlaying &&
            ships.map((ship) => (
              <div
                key={ship.id}
                style={{
                  left: `${ship.x}%`,
                  top: '28%',
                }}
                className="absolute transform -translate-x-1/2 transition-all duration-75 z-10"
              >
                {renderShipSvg(ship)}
              </div>
            ))}

          {/* Torpedo Missile traveling upwards */}
          {torpedo && (
            <div
              style={{
                left: `${torpedo.x}%`,
                top: `${torpedo.y}%`,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none"
            >
              {/* Torpedo head glowing beacon */}
              <div className="w-3.5 h-6 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] border border-yellow-300"></div>
              {/* Water trail bubbles */}
              <div className="w-1.5 h-10 bg-cyan-300/60 mx-auto mt-0.5 blur-xs"></div>
            </div>
          )}

          {/* Explosion on hit */}
          {explosion && (
            <div
              style={{ left: `${explosion.x}%`, top: '32%' }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-yellow-200 animate-ping opacity-90"></div>
              <div className="font-soviet-mono text-xs sm:text-sm font-bold text-yellow-300 bg-black/80 px-2 py-0.5 rounded border border-yellow-400 mt-2 shadow-lg">
                ПОПАДАНИЕ! +{explosion.points} ОЧК.
              </div>
            </div>
          )}

          {/* Splash on miss */}
          {splash && (
            <div
              style={{ left: `${splash.x}%`, top: '36%' }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none"
            >
              <div className="w-10 h-6 bg-cyan-200/50 rounded-full animate-ping"></div>
              <div className="text-[10px] font-soviet-mono text-cyan-300 text-center bg-black/60 px-1 rounded">
                МИМО
              </div>
            </div>
          )}

          {/* Smooth Periscope Crosshair Reticle */}
          <div
            style={{ left: `${periscopeAngle}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-red-500/70 transform -translate-x-1/2 pointer-events-none z-20 flex flex-col justify-between items-center transition-[left] duration-75 ease-out"
          >
            <div className="mt-2 text-[9px] sm:text-[10px] font-soviet-mono text-red-400 bg-black/85 px-1.5 py-0.5 rounded border border-red-500/40">
              КУРС: {Math.round(periscopeAngle * 3.6)}°
            </div>

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-red-500 flex items-center justify-center relative">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="absolute top-0 w-0.5 h-3 bg-red-500"></div>
              <div className="absolute bottom-0 w-0.5 h-3 bg-red-500"></div>
              <div className="absolute left-0 w-3 h-0.5 bg-red-500"></div>
              <div className="absolute right-0 w-3 h-0.5 bg-red-500"></div>
            </div>

            <div className="mb-2 text-[9px] sm:text-[10px] font-soviet-mono text-red-400 bg-black/85 px-1.5 py-0.5 rounded border border-red-500/40">
              ПРИЦЕЛ
            </div>
          </div>

          {/* Idle screen with 100% accessible start button */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30 overflow-y-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center mb-2 sm:mb-3 text-amber-400 shrink-0">
                <Crosshair className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-display text-lg sm:text-2xl text-white uppercase tracking-wider font-bold">
                Торпедный симулятор «Морской бой»
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mt-1.5 leading-relaxed">
                Водите пальцем или мышкой по экрану для наведения перископа. 
                Нажимайте кнопку внизу или тапайте по экрану для залпа торпедой.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="mt-4 sm:mt-5 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-display text-xs sm:text-sm uppercase tracking-widest transition-all font-bold shadow-xl border border-red-500/40 cursor-pointer touch-manipulation active:scale-95 shrink-0"
              >
                Опустить 15 коп. и начать атаку
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-30 overflow-y-auto">
              <Award className="w-9 h-9 sm:w-10 sm:h-10 text-amber-400 mb-1.5 sm:mb-2 shrink-0" />
              <h4 className="font-display text-xl sm:text-2xl text-white uppercase">
                Атака завершена!
              </h4>
              <p className="font-soviet-mono text-lg sm:text-xl text-amber-400 mt-1">
                Набрано очков: {score}
              </p>
              <p className="text-xs text-stone-300 mt-1 max-w-xs">
                {score >= 8
                  ? 'Превосходная меткость! Вы награждены призовой игрой!'
                  : 'Все 10 торпед выпущены. Тренируйте упреждение по движущимся кораблям!'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={startGame}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Сыграть ещё (15 коп.)
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

      {/* Periscope Steering Controls */}
      {isPlaying && (
        <div className="space-y-3 bg-stone-950 p-3 sm:p-4 rounded-xl border border-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Left / Right Periscope Buttons */}
            <div className="sm:col-span-4 flex items-center gap-2">
              <button
                type="button"
                onTouchStart={() => { keysPressed.current.left = true; }}
                onTouchEnd={() => { keysPressed.current.left = false; }}
                onMouseDown={() => { keysPressed.current.left = true; }}
                onMouseUp={() => { keysPressed.current.left = false; }}
                onClick={() => setPeriscopeAngle((prev) => Math.max(10, prev - 3))}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 sm:py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-200 text-xs font-semibold border border-stone-700 select-none cursor-pointer touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" /> <span>Влево (◄)</span>
              </button>
              <button
                type="button"
                onTouchStart={() => { keysPressed.current.right = true; }}
                onTouchEnd={() => { keysPressed.current.right = false; }}
                onMouseDown={() => { keysPressed.current.right = true; }}
                onMouseUp={() => { keysPressed.current.right = false; }}
                onClick={() => setPeriscopeAngle((prev) => Math.min(90, prev + 3))}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 sm:py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-200 text-xs font-semibold border border-stone-700 select-none cursor-pointer touch-manipulation"
              >
                <span>Вправо (►)</span> <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Slider */}
            <div className="sm:col-span-4 space-y-1">
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Левый борт</span>
                <span className="font-soviet-mono text-amber-400">
                  {Math.round(periscopeAngle)}%
                </span>
                <span>Правый борт</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="0.5"
                value={periscopeAngle}
                onChange={(e) => setPeriscopeAngle(Number(e.target.value))}
                className="w-full h-2.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-red-600 touch-manipulation"
              />
            </div>

            {/* Big Launch Torpedo Button */}
            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={launchTorpedo}
                disabled={torpedo !== null || torpedoesLeft <= 0}
                className={`w-full py-3.5 sm:py-3 rounded-xl font-display text-sm uppercase tracking-widest transition-all font-bold cursor-pointer touch-manipulation ${
                  torpedo !== null || torpedoesLeft <= 0
                    ? 'bg-stone-800 text-stone-600 cursor-not-allowed border border-stone-800'
                    : 'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white shadow-lg border border-red-500/50 active:scale-98'
                }`}
              >
                {torpedo !== null ? 'Торпеда в воде...' : '🚀 Пуск торпеды'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
