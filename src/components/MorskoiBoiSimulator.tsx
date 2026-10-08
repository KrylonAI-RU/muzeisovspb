import React, { useState, useEffect, useRef } from 'react';
import { 
  Crosshair, 
  Award, 
  RotateCcw, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  Compass, 
  Anchor, 
  Sparkles,
  Flame,
  Radio
} from 'lucide-react';

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
  const [hitsCount, setHitsCount] = useState(0);
  const [isBonusGame, setIsBonusGame] = useState(false);
  const [periscopeAngle, setPeriscopeAngle] = useState(50); // percentage 10 to 90
  const [isTriggerPressed, setIsTriggerPressed] = useState(false);
  
  // Torpedo flight state: y from 92% (bottom) to 36% (horizon)
  const [torpedo, setTorpedo] = useState<{ x: number; y: number } | null>(null);
  const [explosion, setExplosion] = useState<{ x: number; points: number; name: string } | null>(null);
  const [splash, setSplash] = useState<{ x: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [lastHitMessage, setLastHitMessage] = useState<string | null>(null);

  const [ships, setShips] = useState<Ship[]>([
    { id: 1, x: 22, speed: 0.22, type: 'battleship', name: 'Ракетный крейсер «Грозный»', points: 1, direction: 1, hitTimer: 0 },
    { id: 2, x: 68, speed: 0.38, type: 'destroyer', name: 'Эсминец «Сметливый»', points: 2, direction: -1, hitTimer: 0 },
    { id: 3, x: 45, speed: 0.58, type: 'cutter', name: 'Торпедный катер «Комсомолец»', points: 3, direction: 1, hitTimer: 0 },
  ]);

  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const viewportRef = useRef<HTMLDivElement>(null);
  const latestAngleRef = useRef<number>(50);
  const rafAngleId = useRef<number | null>(null);
  const pointerDownPos = useRef<{ x: number; y: number; time: number } | null>(null);

  // Instantly apply angle synchronized with native display refresh rate (no stutter, no tearing)
  const applyAngle = (targetAngle: number) => {
    latestAngleRef.current = targetAngle;
    if (rafAngleId.current === null) {
      rafAngleId.current = requestAnimationFrame(() => {
        setPeriscopeAngle(latestAngleRef.current);
        rafAngleId.current = null;
      });
    }
  };

  const calculateAngleFromClientX = (clientX: number) => {
    if (!viewportRef.current) return 50;
    const rect = viewportRef.current.getBoundingClientRect();
    if (rect.width <= 0) return 50;
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(10, Math.min(90, relativeX));
  };

  // Smooth keyboard periscope movement loop (Arrow keys & A/D only)
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    const updatePeriscope = () => {
      if (keysPressed.current.left) {
        setPeriscopeAngle((prev) => Math.max(10, prev - 0.75));
      }
      if (keysPressed.current.right) {
        setPeriscopeAngle((prev) => Math.min(90, prev + 0.75));
      }
      animId = requestAnimationFrame(updatePeriscope);
    };

    animId = requestAnimationFrame(updatePeriscope);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = true;
      }
      // Note: Spacebar is intentionally removed. Torpedo launching is strictly via LMB / viewport click.
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
      if (rafAngleId.current !== null) {
        cancelAnimationFrame(rafAngleId.current);
        rafAngleId.current = null;
      }
    };
  }, [isPlaying]);

  // Buttery-smooth pointer tracking: perfectly pinned to mouse cursor & finger touch
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return; // Only left click

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    pointerDownPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    const angle = calculateAngleFromClientX(e.clientX);
    applyAngle(angle);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    const angle = calculateAngleFromClientX(e.clientX);
    applyAngle(angle);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    if (pointerDownPos.current) {
      const dx = Math.abs(e.clientX - pointerDownPos.current.x);
      const dy = Math.abs(e.clientY - pointerDownPos.current.y);
      const dt = Date.now() - pointerDownPos.current.time;

      // On desktop: LMB click fires torpedo
      // On mobile: tap (movement < 20px) fires torpedo
      if (e.pointerType === 'mouse') {
        if (e.button === 0) {
          launchTorpedo();
        }
      } else {
        if (dx < 20 && dy < 20 && dt < 500) {
          launchTorpedo();
        }
      }
      pointerDownPos.current = null;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    pointerDownPos.current = null;
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

  // Torpedo flight loop (from bottom y=92% up to horizon y=36%)
  useEffect(() => {
    if (!torpedo) return;

    const flightInterval = setInterval(() => {
      setTorpedo((prev) => {
        if (!prev) return null;
        const newY = prev.y - 3.4; // authentic flight velocity

        // Check impact at horizon (y <= 36%)
        if (newY <= 36) {
          // Generous hit check: compare torpedo.x to each ship.x
          const hitTarget = ships.find((s) => {
            const hitZone = s.type === 'battleship' ? 14 : s.type === 'destroyer' ? 10 : 8;
            return Math.abs(s.x - prev.x) < hitZone;
          });

          if (hitTarget) {
            // Hit!
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([60, 40, 80]);
            }
            setExplosion({ x: hitTarget.x, points: hitTarget.points, name: hitTarget.name });
            setScore((sc) => sc + hitTarget.points);
            setHitsCount((h) => h + 1);
            setLastHitMessage(`ПОПАДАНИЕ! ${hitTarget.name.toUpperCase()} (+${hitTarget.points})`);
            setTimeout(() => setLastHitMessage(null), 1800);

            // Mark ship as hit
            setShips((currentShips) =>
              currentShips.map((s) => (s.id === hitTarget.id ? { ...s, hitTimer: 28 } : s))
            );

            setTimeout(() => setExplosion(null), 1200);
          } else {
            // Miss splash
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate(30);
            }
            setSplash({ x: prev.x });
            setTimeout(() => setSplash(null), 800);
          }

          // Check if out of torpedoes
          if (torpedoesLeft <= 0) {
            setTimeout(() => {
              // Check bonus game eligibility (8 or more hits)
              setHitsCount((finalHits) => {
                if (finalHits >= 8 && !isBonusGame) {
                  // Prize Game!
                  setIsBonusGame(true);
                  setTorpedoesLeft(5);
                  setLastHitMessage('⭐ ПРИЗОВАЯ ИГРА! ВАМ НАЧИСЛЕНО 5 ДОПОЛНИТЕЛЬНЫХ ТОРПЕД!');
                  setTimeout(() => setLastHitMessage(null), 3500);
                } else {
                  setGameOver(true);
                  setIsPlaying(false);
                }
                return finalHits;
              });
            }, 900);
          }

          return null;
        }

        return { ...prev, y: newY };
      });
    }, 28);

    return () => clearInterval(flightInterval);
  }, [torpedo, ships, torpedoesLeft, isBonusGame]);

  const startGame = () => {
    if (coins <= 0) {
      alert('Возьмите монеты в кассе музея (нажмите на коробок в шапке).');
      return;
    }
    onUseCoin();
    setIsPlaying(true);
    setTorpedoesLeft(10);
    setScore(0);
    setHitsCount(0);
    setIsBonusGame(false);
    setGameOver(false);
    setTorpedo(null);
    setExplosion(null);
    setSplash(null);
    setLastHitMessage(null);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setTorpedo(null);
    setExplosion(null);
    setSplash(null);
    setIsBonusGame(false);
  };

  const launchTorpedo = () => {
    if (!isPlaying || torpedo !== null || torpedoesLeft <= 0) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    setTorpedoesLeft((prev) => prev - 1);
    setTorpedo({ x: periscopeAngle, y: 92 });
  };

  // Bearing in degrees (0..360 range, where center 50% is 000° True North)
  const bearingDegrees = Math.round((periscopeAngle - 50) * 1.8);
  const displayBearing = (bearingDegrees + 360) % 360;

  // Render authentic Soviet Warships with rich naval silhouette, flags, radars, wakes
  const renderShipSvg = (ship: Ship) => {
    const isFlipped = ship.direction === -1;
    const isHit = ship.hitTimer > 0;

    // Battleship / Cruiser «Грозный» (Project 58 Kynda-class)
    if (ship.type === 'battleship') {
      return (
        <div className={`relative ${isHit ? 'animate-bounce' : ''}`}>
          <svg
            viewBox="0 0 160 38"
            className={`w-36 sm:w-46 h-9 sm:h-10 drop-shadow-lg transition-transform ${
              isFlipped ? 'scale-x-[-1]' : ''
            }`}
          >
            {/* Water foam wake */}
            <path
              d={isFlipped ? "M 152 35 Q 165 37 158 39" : "M 8 35 Q -5 37 2 39"}
              stroke="#67e8f9"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
            {/* Lower hull (red anti-fouling paint) */}
            <path d="M 6 32 L 20 37 L 140 37 L 156 31 Z" fill="#991b1b" />
            {/* Upper hull (battleship grey) */}
            <path d="M 4 24 L 20 32 L 146 32 L 158 22 L 148 20 L 14 20 Z" fill={isHit ? "#ef4444" : "#334155"} stroke="#0f172a" strokeWidth="1" />
            
            {/* Soviet Red Star on bow */}
            <polygon points="12,23 13,25 15,25 13.5,26 14,28 12,26.5 10,28 10.5,26 9,25 11,25" fill="#ef4444" />

            {/* Main gun turrets */}
            <rect x="22" y="16" width="14" height="5" rx="1" fill="#475569" stroke="#1e293b" />
            <line x1="12" y1="18" x2="24" y2="18" stroke="#1e293b" strokeWidth="2.5" />

            {/* Forward superstructure & bridge */}
            <rect x="42" y="12" width="26" height="9" rx="1.5" fill="#475569" stroke="#1e293b" />
            <rect x="46" y="7" width="16" height="6" rx="1" fill="#64748b" />
            {/* Bridge windows */}
            <line x1="48" y1="10" x2="60" y2="10" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Main Radar lattice mast */}
            <line x1="54" y1="1" x2="54" y2="7" stroke="#1e293b" strokeWidth="2" />
            <ellipse cx="54" cy="2" rx="6" ry="2" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Funnel (smokestack) with smoke puff */}
            <path d="M 74 11 L 82 11 L 84 20 L 72 20 Z" fill="#1e293b" />
            <rect x="74" y="9" width="8" height="2" fill="#dc2626" />
            {isHit && (
              <circle cx="78" cy="4" r="5" fill="#f97316" className="animate-ping" opacity="0.8" />
            )}

            {/* Aft missile launcher & radar mast */}
            <rect x="92" y="14" width="18" height="7" fill="#475569" />
            <line x1="100" y1="5" x2="100" y2="14" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="100" cy="5" rx="4" ry="1.5" fill="none" stroke="#f59e0b" strokeWidth="1" />

            {/* Aft Gun Turret */}
            <rect x="120" y="17" width="14" height="4" rx="1" fill="#475569" />
            <line x1="134" y1="19" x2="146" y2="19" stroke="#1e293b" strokeWidth="2" />

            {/* Soviet Naval Ensign Flag (Белое полотнище, синяя полоса, красная звезда и серп) */}
            <g transform="translate(148, 12)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#94a3b8" strokeWidth="1" />
              <rect x="1" y="0" width="10" height="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5" />
              <rect x="1" y="4.5" width="10" height="1.5" fill="#2563eb" />
              <circle cx="4" cy="2.5" r="1.5" fill="#dc2626" />
            </g>
          </svg>
        </div>
      );
    }

    // Destroyer «Сметливый» (Project 61 Kashin-class)
    if (ship.type === 'destroyer') {
      return (
        <div className={`relative ${isHit ? 'animate-bounce' : ''}`}>
          <svg
            viewBox="0 0 120 30"
            className={`w-28 sm:w-34 h-7 sm:h-8 drop-shadow-md transition-transform ${
              isFlipped ? 'scale-x-[-1]' : ''
            }`}
          >
            {/* Hull */}
            <path d="M 4 26 L 16 29 L 104 29 L 118 22 L 112 18 L 10 18 Z" fill={isHit ? "#ef4444" : "#475569"} stroke="#0f172a" strokeWidth="1" />
            <path d="M 6 25 L 16 29 L 104 29 L 116 24 Z" fill="#991b1b" />

            {/* Bow Gun Turret */}
            <rect x="18" y="14" width="12" height="4.5" rx="1" fill="#334155" />
            <line x1="8" y1="16" x2="18" y2="16" stroke="#0f172a" strokeWidth="2" />

            {/* Bridge */}
            <rect x="36" y="10" width="18" height="9" fill="#334155" />
            <line x1="38" y1="13" x2="52" y2="13" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Twin stacks (Gas Turbines) */}
            <rect x="58" y="9" width="6" height="10" fill="#1e293b" />
            <rect x="70" y="11" width="6" height="8" fill="#1e293b" />

            {/* Mast */}
            <line x1="45" y1="2" x2="45" y2="10" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="45" cy="2" r="2.5" fill="#f59e0b" />

            {/* Torpedo Tubes */}
            <rect x="80" y="14" width="14" height="4" fill="#1e293b" />

            {/* Stern Gun */}
            <rect x="98" y="15" width="10" height="4" fill="#334155" />
            <line x1="108" y1="17" x2="116" y2="17" stroke="#0f172a" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }

    // Fast Torpedo Cutter «Комсомолец»
    return (
      <div className={`relative ${isHit ? 'animate-bounce' : ''}`}>
        <svg
          viewBox="0 0 74 20"
          className={`w-18 sm:w-22 h-5 sm:h-6 drop-shadow-md transition-transform ${
            isFlipped ? 'scale-x-[-1]' : ''
          }`}
        >
          {/* Planing hull with dynamic water spray */}
          <path d="M 2 15 L 12 19 L 66 19 L 72 13 L 62 11 L 8 11 Z" fill={isHit ? "#ef4444" : "#1e293b"} stroke="#0f172a" strokeWidth="1" />
          {/* Water foam spray */}
          <path d={isFlipped ? "M 70 18 Q 78 19 72 21" : "M 4 18 Q -4 19 2 21"} stroke="#67e8f9" strokeWidth="2.5" fill="none" opacity="0.9" />

          {/* Cabin */}
          <rect x="22" y="6" width="16" height="6" rx="2" fill="#475569" />
          <line x1="24" y1="8" x2="36" y2="8" stroke="#38bdf8" strokeWidth="1.2" />

          {/* Torpedo tubes on sides */}
          <rect x="40" y="8" width="18" height="3" rx="1" fill="#0f172a" />
          <circle cx="40" cy="9.5" r="1.5" fill="#ef4444" />

          {/* Machine gun mast */}
          <line x1="28" y1="2" x2="28" y2="6" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="24" y1="3" x2="32" y2="3" stroke="#0f172a" strokeWidth="1" />
        </svg>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-stone-900 border border-stone-800 p-3.5 sm:p-6 shadow-2xl text-stone-200">
      {/* Top Bar with Authentic Military Arcade Status Lamps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-950 border border-blue-700/80 text-blue-300 font-soviet-mono text-[11px] sm:text-xs tracking-wider flex items-center gap-1">
              <Anchor className="w-3 h-3 text-cyan-400" />
              СЕРПУХОВСКИЙ РТЗ · ГОСТ 23412-79
            </span>
            <span className="text-[11px] sm:text-xs text-amber-400/90 font-soviet-mono flex items-center gap-1">
              <span>🪙</span> СТОИМОСТЬ: 15 КОПЕЕК
            </span>
            {isBonusGame && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500 text-amber-300 font-soviet-mono text-[11px] font-bold animate-pulse">
                ⭐ ПРИЗОВАЯ ИГРА
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
            <span>Оптический симулятор «Морской бой»</span>
          </h3>
        </div>

        {/* Action Controls & Torpedo Ammo Lamp Bank */}
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

          {/* Mechanical Torpedo Lamp Bank */}
          <div className="flex items-center gap-2.5 sm:gap-3 bg-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-stone-800 shadow-inner">
            <div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400 font-soviet-mono flex items-center justify-between">
                <span>ТОРПЕДЫ</span>
                <span className="text-red-400 font-bold ml-2">{torpedoesLeft} ШТ.</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 sm:w-2 h-3 sm:h-3.5 rounded-xs transition-all duration-200 ${
                      idx < torpedoesLeft
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] border border-yellow-300/40'
                        : 'bg-stone-800/80 border border-transparent'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="h-6 sm:h-7 w-px bg-stone-800"></div>

            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400 font-soviet-mono">ОЧКИ</div>
              <div className="font-soviet-mono text-lg sm:text-2xl font-bold text-amber-400 leading-none">
                {score}
              </div>
            </div>

            <div className="h-6 sm:h-7 w-px bg-stone-800"></div>

            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400 font-soviet-mono">ПОПАДАНИЙ</div>
              <div className="font-soviet-mono text-lg sm:text-2xl font-bold text-emerald-400 leading-none">
                {hitsCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Periscope Viewport - Guaranteed height on mobile screens with authentic rubber bezel */}
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative my-4 sm:my-5 h-[340px] sm:h-[400px] md:h-[460px] w-full bg-[#070c14] rounded-2xl overflow-hidden border-2 sm:border-4 border-[#1c222c] shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] flex items-center justify-center select-none cursor-crosshair touch-none"
      >
        {/* Optical Rubber Eyepiece Hood & Periscope Vignetting */}
        <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_90px_rgba(0,0,0,0.98)] z-25 border-4 border-stone-900/60"></div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.85)_100%)] z-24"></div>

        {/* Sea Arena with Sky & Horizons */}
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#0b1626] via-[#13253b] to-[#05111d]">
          {/* Distant Cape, Moon & Blinking Lighthouse */}
          <div className="absolute top-0 left-0 right-0 h-[36%] overflow-hidden pointer-events-none">
            {/* Distant moon */}
            <div className="absolute top-4 right-16 sm:right-28 w-9 h-9 rounded-full bg-amber-100/30 blur-xs"></div>
            
            {/* Rocky coast silhoutte */}
            <div className="absolute bottom-0 left-0 right-0 h-5 bg-[#081320] opacity-70 [clip-path:polygon(0%_100%,12%_35%,24%_75%,38%_25%,55%_80%,72%_35%,88%_70%,96%_20%,100%_100%)]"></div>

            {/* Blinking Lighthouse (Маяк) on left cape */}
            <div className="absolute bottom-2 left-10 sm:left-24 flex flex-col items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"></div>
              <div className="w-2 h-4 bg-stone-900 border-x border-stone-700"></div>
            </div>
          </div>

          {/* Sea Horizon Line */}
          <div className="absolute top-[36%] left-0 right-0 h-1.5 bg-cyan-800/80 shadow-[0_0_8px_rgba(8,145,178,0.5)] z-5"></div>

          {/* Sea Water Wave Depth Layers */}
          <div className="absolute top-[36%] bottom-0 left-0 right-0 bg-gradient-to-b from-[#0a1e32] via-[#071828] to-[#030d17] overflow-hidden pointer-events-none">
            <div className="absolute top-5 left-0 right-0 h-px bg-cyan-400/25"></div>
            <div className="absolute top-14 left-0 right-0 h-px bg-cyan-400/20"></div>
            <div className="absolute top-28 left-0 right-0 h-px bg-cyan-400/15"></div>
            <div className="absolute top-48 left-0 right-0 h-px bg-cyan-400/10"></div>
          </div>

          {/* Warships sailing along the horizon line */}
          {isPlaying &&
            ships.map((ship) => (
              <div
                key={ship.id}
                style={{
                  left: `${ship.x}%`,
                  top: '27%',
                }}
                className="absolute transform -translate-x-1/2 transition-all duration-75 z-10 select-none pointer-events-none"
              >
                {renderShipSvg(ship)}
              </div>
            ))}

          {/* Torpedo Incandescent Lamp Track (Authentic glowing missile with light chain) */}
          {torpedo && (
            <div
              style={{
                left: `${torpedo.x}%`,
                top: `${torpedo.y}%`,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none"
            >
              {/* Torpedo Head (Super bright Soviet incandescent lamp) */}
              <div className="relative flex flex-col items-center">
                <div className="w-4 h-6 sm:w-5 sm:h-7 bg-red-500 rounded-full shadow-[0_0_18px_#ef4444] border-2 border-yellow-200 animate-pulse"></div>
                {/* Secondary underwater bubble trail */}
                <div className="w-2 h-12 bg-gradient-to-b from-cyan-300 via-cyan-400/60 to-transparent blur-xs mt-0.5"></div>
              </div>
            </div>
          )}

          {/* Massive Fiery Explosion with Shockwave and Sinking Hull */}
          {explosion && (
            <div
              style={{ left: `${explosion.x}%`, top: '30%' }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
            >
              {/* Expanding fiery blast core */}
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-radial from-yellow-100 via-amber-400 to-red-600 animate-ping opacity-90 shadow-[0_0_40px_#f59e0b]"></div>
                <div className="absolute w-14 h-14 rounded-full bg-white animate-pulse"></div>
              </div>
              <div className="font-soviet-mono text-xs sm:text-sm font-bold text-yellow-300 bg-black/90 px-3 py-1 rounded-full border border-yellow-400 mt-2 shadow-2xl flex items-center gap-1.5 animate-bounce">
                <Flame className="w-4 h-4 text-red-500" />
                <span>ЦЕЛЬ ПОРАЖЕНА! +{explosion.points} ОЧК.</span>
              </div>
            </div>
          )}

          {/* Splash on Miss */}
          {splash && (
            <div
              style={{ left: `${splash.x}%`, top: '36%' }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none flex flex-col items-center"
            >
              <div className="w-12 h-8 bg-cyan-200/60 rounded-full animate-ping"></div>
              <div className="text-[10px] font-soviet-mono text-cyan-300 font-bold bg-black/75 px-2 py-0.5 rounded-full border border-cyan-500/50 mt-1">
                ПРОМАХ
              </div>
            </div>
          )}

          {/* Optical Periscope Rangefinder Reticle & Angle Grid */}
          <div
            style={{ left: `${periscopeAngle}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 transform -translate-x-1/2 pointer-events-none z-20 flex flex-col justify-between items-center transition-none will-change-[left]"
          >
            {/* Top Azimuth Indicator */}
            <div className="mt-2.5 text-[9px] sm:text-[10px] font-soviet-mono text-red-300 bg-black/90 px-2 py-0.5 rounded border border-red-500/60 shadow-lg flex items-center gap-1">
              <Compass className="w-3 h-3 text-red-400" />
              <span>ПЕЛЕНГ: {displayBearing < 100 ? `0${displayBearing}` : displayBearing}°</span>
            </div>

            {/* Central Optical Periscope Lens Graticule with Rangefinder Ticks */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-red-500/90 flex items-center justify-center relative shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              {/* Central aiming dot */}
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"></div>
              
              {/* Rangefinder Crosshair Arms */}
              <div className="absolute top-0 w-0.5 h-4 bg-red-500"></div>
              <div className="absolute bottom-0 w-0.5 h-4 bg-red-500"></div>
              <div className="absolute left-0 w-4 h-0.5 bg-red-500"></div>
              <div className="absolute right-0 w-4 h-0.5 bg-red-500"></div>

              {/* Stadiametric Lead / Deflection Scale Marks (-30, -20, -10, +10, +20, +30 knots) */}
              <div className="absolute -left-7 top-1/2 -translate-y-1/2 text-[8px] font-soviet-mono text-red-400/80">-20</div>
              <div className="absolute -right-7 top-1/2 -translate-y-1/2 text-[8px] font-soviet-mono text-red-400/80">+20</div>
              <div className="absolute w-12 h-12 rounded-full border border-dashed border-red-500/40"></div>
            </div>

            {/* Bottom Deflection Scale Badge */}
            <div className="mb-2.5 text-[9px] sm:text-[10px] font-soviet-mono text-red-300 bg-black/90 px-2 py-0.5 rounded border border-red-500/60 shadow-lg">
              УПРЕЖДЕНИЕ: {periscopeAngle < 50 ? `ЛЕВ. ${Math.round(50 - periscopeAngle)}°` : periscopeAngle > 50 ? `ПРАВ. ${Math.round(periscopeAngle - 50)}°` : '0° КУРС'}
            </div>
          </div>

          {/* Floating In-Game Event Banner */}
          {lastHitMessage && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-35 px-4 py-1.5 rounded-full font-soviet-mono text-xs font-bold uppercase tracking-wider shadow-2xl border bg-amber-950/90 text-amber-200 border-amber-500 animate-bounce text-center max-w-sm">
              {lastHitMessage}
            </div>
          )}

          {/* Idle Screen (The legendary Soviet pre-launch card that the user loved!) */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-40 overflow-y-auto">
              {/* Iconic Circular Medal Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-950 border-2 border-cyan-500/80 flex items-center justify-center mb-2.5 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
                <Target className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              {/* Title & Authentic Subtitle */}
              <div className="space-y-1">
                <div className="text-[10px] sm:text-xs font-soviet-mono text-cyan-400 uppercase tracking-widest">
                  СЕРПУХОВСКИЙ РТЗ · ГОСТ 23412-79 · ЦНИИ «ВОЛНА»
                </div>
                <h4 className="font-display text-xl sm:text-3xl text-white uppercase tracking-wider font-bold">
                  Оптический симулятор «Морской бой» (1973)
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 max-w-lg mt-2 leading-relaxed">
                Культовый советский торпедный симулятор. Взгляните в окуляр настоящего перископа, 
                вычисляйте упреждение по быстроходным крейсерам, эсминцам и катерам. 
                Прицел непрерывно и без задержек следует за курсором мыши или пальцем. 
                Пуск торпеды производится кликом ЛКМ по экрану или боевой гашеткой на рукоятке.
              </p>

              {/* Tactical Briefing 4-card Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg my-3.5 text-[11px] font-soviet-mono text-stone-300 w-full">
                <div className="p-2 sm:p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-center shadow">
                  <div className="text-amber-400 font-bold flex items-center justify-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    ПЕРИСКОП ◄ ►
                  </div>
                  <div className="text-[9px] text-stone-400 mt-0.5">Курсор мыши / Палец / A-D</div>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-center shadow">
                  <div className="text-amber-400 font-bold flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    ЗАЛП (ЛКМ) 🚀
                  </div>
                  <div className="text-[9px] text-stone-400 mt-0.5">Клик ЛКМ / Красная гашетка</div>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-center shadow">
                  <div className="text-amber-400 font-bold flex items-center justify-center gap-1">
                    <Anchor className="w-3.5 h-3.5 text-amber-400" />
                    10 ТОРПЕД
                  </div>
                  <div className="text-[9px] text-stone-400 mt-0.5">Световая шкала ламп</div>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-center shadow">
                  <div className="text-amber-400 font-bold flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    ПРИЗОВАЯ ⭐
                  </div>
                  <div className="text-[9px] text-stone-400 mt-0.5">Бонус за 8+ попаданий</div>
                </div>
              </div>

              {/* Authentic Coin Slot & Big Glowing Soviet Arcade Start Button */}
              <div className="flex flex-col items-center gap-2 mt-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-display text-xs sm:text-sm uppercase tracking-widest transition-all font-bold cursor-pointer touch-manipulation active:scale-95 shadow-[0_0_25px_rgba(185,28,28,0.6)] border border-red-500/60 flex items-center gap-2.5"
                >
                  <span className="text-base sm:text-lg">🪙</span>
                  <span>Опустить 15 коп. и начать атаку</span>
                </button>
                <div className="text-[10px] font-soviet-mono text-stone-400 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  <span>МОНЕТОПРИЁМНИК 15 КОП. · БЕЗ СДАЧИ</span>
                </div>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-40 overflow-y-auto">
              <Award className="w-12 h-12 text-amber-400 mb-2 shrink-0 animate-bounce" />
              <h4 className="font-display text-2xl sm:text-3xl text-white uppercase font-bold">
                Торпедная атака завершена!
              </h4>
              <p className="font-soviet-mono text-2xl text-amber-400 mt-1">
                {score} очков · {hitsCount} из 10 попаданий
              </p>

              <div className="flex items-center gap-4 my-2.5 text-xs font-soviet-mono text-stone-300 bg-stone-900/90 px-5 py-2 rounded-xl border border-stone-800">
                <div>Меткость: <span className="text-emerald-400 font-bold">{Math.round((hitsCount / 10) * 100)}%</span></div>
                <div className="h-4 w-px bg-stone-700"></div>
                <div>Звание: <span className="text-amber-400 font-bold">{hitsCount >= 8 ? 'Командир торпедной ПЛ' : hitsCount >= 5 ? 'Старшина 1 статьи' : 'Матрос-торпедист'}</span></div>
              </div>

              <p className="text-xs text-stone-300 mt-1 max-w-sm leading-relaxed">
                {hitsCount >= 8
                  ? 'Блестящая стрельба! Вы подтвердили квалификацию снайпера Краснознамённого флота!'
                  : 'Все 10 торпед выпущены. Учитывайте скорость цели и берите упреждение в 1–2 корпуса!'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={startGame}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer touch-manipulation shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>🪙 Повторить атаку (15 коп.)</span>
                </button>
                <button
                  type="button"
                  onClick={stopGame}
                  className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-300 text-xs font-semibold uppercase tracking-wider transition-colors border border-stone-700 cursor-pointer touch-manipulation"
                >
                  Выйти в меню
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tactile Soviet Periscope Cockpit & Handle Steering Console */}
      <div className="bg-stone-950 p-3.5 sm:p-5 rounded-2xl border border-stone-800/90 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          {/* Left Submarine Module: Bearing Rose Dial & Status Annunciators */}
          <div className="md:col-span-4 flex items-center justify-around sm:justify-start gap-4 p-2.5 rounded-xl bg-stone-900/80 border border-stone-800">
            {/* Compass Bearing Rose Dial */}
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-stone-950 border-2 border-stone-700 flex flex-col items-center justify-center shadow-inner shrink-0">
              {/* Rotating Compass card */}
              <div
                style={{ transform: `rotate(${-bearingDegrees}deg)` }}
                className="absolute inset-1 rounded-full border border-stone-800 flex items-center justify-center transition-transform duration-100"
              >
                <div className="absolute top-1 text-[7px] font-soviet-mono font-bold text-red-500">С</div>
                <div className="absolute bottom-1 text-[7px] font-soviet-mono text-stone-400">Ю</div>
                <div className="absolute left-1 text-[7px] font-soviet-mono text-stone-400">З</div>
                <div className="absolute right-1 text-[7px] font-soviet-mono text-stone-400">В</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-stone-300 border border-black z-10 shadow"></div>
              <span className="font-soviet-mono text-xs font-bold text-cyan-400 mt-2 z-10">
                {displayBearing < 100 ? `0${displayBearing}` : displayBearing}°
              </span>
              <span className="text-[7px] text-stone-500 font-soviet-mono uppercase">ПЕЛЕНГ</span>
            </div>

            {/* Torpedo Status Incandescent Annunciators */}
            <div className="space-y-1.5 flex-1">
              <div className="text-[9px] uppercase tracking-wider text-stone-400 font-soviet-mono flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>ТАБЛО ТОРПЕДНОГО ЗАЛПА</span>
              </div>
              
              <div className="flex items-center gap-1 text-[10px] font-soviet-mono">
                <div
                  className={`px-2 py-0.5 rounded border transition-all ${
                    torpedo !== null
                      ? 'bg-amber-950 text-amber-300 border-amber-500 animate-pulse font-bold'
                      : torpedoesLeft > 0
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-600 font-bold'
                      : 'bg-red-950 text-red-400 border-red-600'
                  }`}
                >
                  {torpedo !== null ? '● ТОРПЕДА В ВОДЕ' : torpedoesLeft > 0 ? '✓ ГОТОВ К АТАКЕ' : '✕ БОЕКОМПЛЕКТ ПУСТ'}
                </div>
              </div>

              <div className="text-[9px] text-stone-400 flex items-center gap-1 font-soviet-mono">
                <span>ЦЕЛЬ:</span>
                <span className="text-amber-400 font-bold">
                  {periscopeAngle < 40 ? 'ЛЕВЫЙ БОРТ' : periscopeAngle > 60 ? 'ПРАВЫЙ БОРТ' : 'ЦЕНТР (КУРС 0°)'}
                </span>
              </div>
            </div>
          </div>

          {/* Center Submarine Module: Interactive Dual-Grip Periscope Assembly */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer periscope yoke (Pivots with periscope bearing in real-time!) */}
              <div
                style={{ transform: `rotate(${(periscopeAngle - 50) * 0.6}deg)` }}
                className="w-28 h-20 sm:w-32 sm:h-22 rounded-2xl border-4 border-stone-800 bg-stone-900 shadow-2xl flex items-center justify-between px-2.5 transition-none will-change-transform select-none relative"
              >
                {/* Left Grip Handle with Knurling */}
                <div className="w-4 h-14 sm:w-4.5 sm:h-16 rounded-md bg-gradient-to-r from-stone-800 via-stone-700 to-stone-950 border border-stone-600 flex flex-col justify-between py-1 shadow">
                  <div className="w-full h-0.5 bg-stone-900"></div>
                  <div className="w-full h-0.5 bg-stone-900"></div>
                  <div className="w-full h-0.5 bg-stone-900"></div>
                </div>

                {/* Central Optical Periscope Column with Factory Plate */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950 border-2 border-stone-500 flex items-center justify-center shadow-lg">
                    {/* Eyepiece optic glass */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-radial from-cyan-400/30 via-slate-900 to-black border border-cyan-500/50 flex items-center justify-center">
                      <Crosshair className="w-4 h-4 text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[7px] font-soviet-mono font-bold text-amber-400 mt-1 uppercase tracking-wider">
                    ПЕРИСКОП «МБ-73»
                  </span>
                </div>

                {/* Right Grip Handle with Tactical Red Firing Trigger Button */}
                <div className="relative flex items-center">
                  <div className="w-4 h-14 sm:w-4.5 sm:h-16 rounded-md bg-gradient-to-r from-stone-800 via-stone-700 to-stone-950 border border-stone-600 flex flex-col justify-between py-1 shadow">
                    <div className="w-full h-0.5 bg-stone-900"></div>
                    <div className="w-full h-0.5 bg-stone-900"></div>
                    <div className="w-full h-0.5 bg-stone-900"></div>
                  </div>

                  {/* Physical Red Thumb Trigger on Handle (LMB trigger) */}
                  <button
                    type="button"
                    title="Боевая гашетка пуска торпеды (ЛКМ)"
                    onMouseDown={() => { setIsTriggerPressed(true); launchTorpedo(); }}
                    onMouseUp={() => setIsTriggerPressed(false)}
                    onTouchStart={() => { setIsTriggerPressed(true); launchTorpedo(); }}
                    onTouchEnd={() => setIsTriggerPressed(false)}
                    disabled={!isPlaying || torpedo !== null || torpedoesLeft <= 0}
                    className={`absolute -right-2 sm:-right-2.5 top-2 w-5 h-6 rounded-r-md border border-red-500 transition-all cursor-pointer select-none flex items-center justify-center ${
                      isTriggerPressed || torpedo !== null
                        ? 'bg-red-800 scale-95 shadow-inner'
                        : 'bg-red-600 hover:bg-red-500 shadow-[0_0_8px_#ef4444]'
                    } ${!isPlaying || torpedoesLeft <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-1.5 h-3 bg-yellow-200/90 rounded-xs"></div>
                  </button>
                </div>
              </div>
            </div>
            <span className="text-[9px] font-soviet-mono text-stone-400 mt-1 uppercase tracking-wider">
              РУКОЯТКИ С БОЕВОЙ ГАШЕТКОЙ ПУСКА (ЛКМ)
            </span>
          </div>

          {/* Right Submarine Module: Tactile Steering & Primary Torpedo Launch Button */}
          <div className="md:col-span-4 space-y-2">
            {/* Steering Left / Right Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onTouchStart={() => { keysPressed.current.left = true; }}
                onTouchEnd={() => { keysPressed.current.left = false; }}
                onMouseDown={() => { keysPressed.current.left = true; }}
                onMouseUp={() => { keysPressed.current.left = false; }}
                onClick={() => setPeriscopeAngle((prev) => Math.max(10, prev - 3.5))}
                className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-100 font-display text-xs uppercase tracking-wider transition-all border border-stone-700 cursor-pointer touch-manipulation flex items-center justify-center gap-1.5 active:scale-95 shadow"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Влево (A)</span>
              </button>

              <button
                type="button"
                onTouchStart={() => { keysPressed.current.right = true; }}
                onTouchEnd={() => { keysPressed.current.right = false; }}
                onMouseDown={() => { keysPressed.current.right = true; }}
                onMouseUp={() => { keysPressed.current.right = false; }}
                onClick={() => setPeriscopeAngle((prev) => Math.min(90, prev + 3.5))}
                className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-100 font-display text-xs uppercase tracking-wider transition-all border border-stone-700 cursor-pointer touch-manipulation flex items-center justify-center gap-1.5 active:scale-95 shadow"
              >
                <span>Вправо (D)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Big Primary Red Launch Torpedo Button with Coin and Status */}
            <button
              type="button"
              onClick={launchTorpedo}
              disabled={!isPlaying || torpedo !== null || torpedoesLeft <= 0}
              className={`w-full py-3 sm:py-3.5 rounded-xl font-display text-xs sm:text-sm uppercase tracking-widest transition-all font-bold cursor-pointer touch-manipulation flex items-center justify-center gap-2 select-none shadow-xl ${
                !isPlaying || torpedo !== null || torpedoesLeft <= 0
                  ? 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                  : 'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white border border-red-500/60 active:scale-98 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
              }`}
            >
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>
                {!isPlaying
                  ? 'Вставьте 15 коп. для пуска'
                  : torpedo !== null
                  ? 'Торпеда в воде...'
                  : torpedoesLeft <= 0
                  ? 'Боекомплект израсходован'
                  : 'Пуск торпеды (ЛКМ)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
