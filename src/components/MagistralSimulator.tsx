import React, { useState, useEffect, useRef } from 'react';
import { Award, RotateCcw, XCircle, Gauge, Zap, ShieldAlert, Sun, Moon, Tv } from 'lucide-react';

interface MagistralSimulatorProps {
  coins: number;
  onUseCoin: () => void;
}

type ScreenTheme = 'color' | 'emerald' | 'night';

interface ObstacleCar {
  id: number;
  lane: number; // 0: left, 1: center, 2: right
  y: number; // percentage down the screen (-40 to 125)
  speed: number;
  type: 'volga_taxi' | 'zil_truck' | 'moskvich' | 'bus';
  name: string;
  color: string;
}

export const MagistralSimulator: React.FC<MagistralSimulatorProps> = ({
  coins,
  onUseCoin,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerLane, setPlayerLane] = useState<number>(1);
  const [playerVisualX, setPlayerVisualX] = useState<number>(50); // percentage for smooth interpolation
  const [steeringAngle, setSteeringAngle] = useState<number>(0); // tilt angle in degrees (-8 to 8)
  const [speed, setSpeed] = useState<number>(90); // km/h
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [crashed, setCrashed] = useState<boolean>(false);
  const [crashCount, setCrashCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [screenTheme, setScreenTheme] = useState<ScreenTheme>('color');
  const [isGasPressed, setIsGasPressed] = useState<boolean>(false);
  const [isBrakePressed, setIsBrakePressed] = useState<boolean>(false);
  const [roadOffset, setRoadOffset] = useState<number>(0);
  const [overtakeStreak, setOvertakeStreak] = useState<number>(0);
  const [lastOvertakeMessage, setLastOvertakeMessage] = useState<string | null>(null);

  const [obstacles, setObstacles] = useState<ObstacleCar[]>([
    { id: 1, lane: 0, y: -25, speed: 1.4, type: 'volga_taxi', name: 'ГАЗ-24 Такси', color: '#f59e0b' },
    { id: 2, lane: 2, y: -70, speed: 1.1, type: 'zil_truck', name: 'ЗИЛ-130 Бортовой', color: '#0284c7' },
  ]);

  const targetX = playerLane === 0 ? 20 : playerLane === 1 ? 50 : 80;
  
  // High-performance refs to decouple state updates from 60fps loops
  const nextCarIdRef = useRef<number>(10);
  const playerVisualXRef = useRef<number>(50);
  playerVisualXRef.current = playerVisualX;
  const speedRef = useRef<number>(speed);
  speedRef.current = speed;
  const crashedRef = useRef<boolean>(crashed);
  crashedRef.current = crashed;
  const isGasPressedRef = useRef<boolean>(isGasPressed);
  isGasPressedRef.current = isGasPressed;
  const isBrakePressedRef = useRef<boolean>(isBrakePressed);
  isBrakePressedRef.current = isBrakePressed;

  // Smooth player horizontal interpolation & steering tilt without affecting obstacle loop
  useEffect(() => {
    let animId: number;
    const smoothMove = () => {
      setPlayerVisualX((prev) => {
        const diff = targetX - prev;
        if (Math.abs(diff) < 0.4) {
          setSteeringAngle(0);
          return targetX;
        }
        // Smooth non-blocking spring lerp
        setSteeringAngle(diff > 0 ? 7 : -7);
        return prev + diff * 0.22;
      });
      animId = requestAnimationFrame(smoothMove);
    };

    animId = requestAnimationFrame(smoothMove);
    return () => cancelAnimationFrame(animId);
  }, [targetX]);

  // Speed physics loop - Depends only on isPlaying (runs smoothly without interruptions)
  useEffect(() => {
    if (!isPlaying) return;

    const speedTimer = setInterval(() => {
      let targetSpeed = 90;
      if (isGasPressedRef.current) targetSpeed = 145;
      if (isBrakePressedRef.current) targetSpeed = 50;
      if (crashedRef.current) targetSpeed = 25;

      setSpeed((s) => {
        const diff = targetSpeed - s;
        if (Math.abs(diff) < 2) return targetSpeed;
        return Math.round(s + diff * 0.15);
      });
    }, 40);

    return () => clearInterval(speedTimer);
  }, [isPlaying]);

  // Road scrolling animation & distance accumulator
  useEffect(() => {
    if (!isPlaying) return;

    const roadInterval = setInterval(() => {
      const curSpeed = speedRef.current;
      const step = (curSpeed / 90) * 8;
      setRoadOffset((prev) => (prev + step) % 100);
      setDistanceKm((prev) => Number((prev + (curSpeed / 3600) * 0.05).toFixed(2)));
    }, 35);

    return () => clearInterval(roadInterval);
  }, [isPlaying]);

  // Vehicle movement and collision detection - Uncoupled from steering changes to prevent 1ms stalls!
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      const curSpeed = speedRef.current;
      const isGas = isGasPressedRef.current;
      const curX = playerVisualXRef.current;
      const isCrashed = crashedRef.current;

      setObstacles((prev) =>
        prev.map((car) => {
          // Continuous downward relative movement
          const relativeSpeed = ((curSpeed - car.speed * 40) / 90) * 1.8 + 0.85;
          const newY = car.y + relativeSpeed;

          // When obstacle passes behind player (fully below screen at y > 120%)
          if (newY > 120) {
            const laneOptions = [0, 1, 2];
            const newLane = laneOptions[Math.floor(Math.random() * laneOptions.length)];
            const types: Array<{ type: ObstacleCar['type']; name: string; color: string; speed: number }> = [
              { type: 'volga_taxi', name: 'ГАЗ-24 Такси', color: '#f59e0b', speed: 1.4 },
              { type: 'zil_truck', name: 'ЗИЛ-130', color: '#0284c7', speed: 1.0 },
              { type: 'moskvich', name: 'Москвич-412', color: '#dc2626', speed: 1.25 },
              { type: 'bus', name: 'ЛиАЗ-677', color: '#eab308', speed: 0.95 },
            ];
            const chosen = types[Math.floor(Math.random() * types.length)];
            
            // Add overtake points
            const bonus = isGas ? 30 : 15;
            setScore((s) => s + bonus);
            setOvertakeStreak((st) => st + 1);
            setLastOvertakeMessage(`ОБГОН: +${bonus} ОЧК.`);
            setTimeout(() => setLastOvertakeMessage(null), 800);

            // Spawn completely fresh unique ID well off-screen above the road so it never teleports backwards!
            return {
              id: nextCarIdRef.current++,
              lane: newLane,
              y: -35 - Math.random() * 25,
              type: chosen.type,
              name: chosen.name,
              color: chosen.color,
              speed: chosen.speed,
            };
          }

          // Collision check: player sits at y=76% to 92%
          const obstacleLaneCenter = car.lane === 0 ? 20 : car.lane === 1 ? 50 : 80;
          const xDistance = Math.abs(curX - obstacleLaneCenter);

          if (!isCrashed && newY >= 68 && newY <= 90 && xDistance < 18) {
            // CRASH!
            setCrashed(true);
            setCrashCount((c) => c + 1);
            setOvertakeStreak(0);
            setLastOvertakeMessage('АВАРИЯ! СБАВЬТЕ ХОД');
            setTimeout(() => {
              setCrashed(false);
              setLastOvertakeMessage(null);
            }, 1000);
          }

          return { ...car, y: newY };
        })
      );
    }, 35);

    return () => clearInterval(gameInterval);
  }, [isPlaying]);

  // 60-second official match timer
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

  // Keyboard controls: Arrows / WASD
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        steerLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        steerRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsGasPressed(true);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setIsBrakePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsGasPressed(false);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setIsBrakePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  const steerLeft = () => {
    if (!isPlaying) return;
    setPlayerLane((l) => Math.max(0, l - 1));
  };

  const steerRight = () => {
    if (!isPlaying) return;
    setPlayerLane((l) => Math.min(2, l + 1));
  };

  const startGame = () => {
    if (coins <= 0) {
      alert('Возьмите монеты в кассе музея (нажмите на коробок в шапке).');
      return;
    }
    onUseCoin();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setDistanceKm(0);
    setCrashed(false);
    setCrashCount(0);
    setGameOver(false);
    setPlayerLane(1);
    setPlayerVisualX(50);
    setSpeed(95);
    setObstacles([
      { id: nextCarIdRef.current++, lane: 0, y: -25, speed: 1.4, type: 'volga_taxi', name: 'ГАЗ-24 Такси', color: '#f59e0b' },
      { id: nextCarIdRef.current++, lane: 2, y: -75, speed: 1.1, type: 'zil_truck', name: 'ЗИЛ-130', color: '#0284c7' },
    ]);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setCrashed(false);
    setIsGasPressed(false);
    setIsBrakePressed(false);
  };

  // Render authentic Soviet Player Race Car ("Эстония-21" / "Радар-1")
  const renderPlayerCarSvg = () => {
    return (
      <svg
        viewBox="0 0 70 120"
        className="w-14 sm:w-16 h-24 sm:h-28 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="30%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="tireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <radialGradient id="headlightBeam" cx="50%" cy="100%" r="90%">
            <stop offset="0%" stopColor="rgba(254, 240, 138, 0.55)" />
            <stop offset="100%" stopColor="rgba(254, 240, 138, 0)" />
          </radialGradient>
        </defs>

        {/* Headlight beams cast forward onto dark asphalt */}
        <path d="M 18 10 L 0 -130 L 70 -130 L 52 10 Z" fill="url(#headlightBeam)" opacity={screenTheme === 'night' ? 0.9 : 0.45} />

        {/* Wheels with chrome rims & wide slicks */}
        <rect x="2" y="16" width="10" height="22" rx="3" fill="url(#tireGrad)" />
        <rect x="4" y="22" width="6" height="10" rx="1.5" fill="#f59e0b" />
        <rect x="58" y="16" width="10" height="22" rx="3" fill="url(#tireGrad)" />
        <rect x="60" y="22" width="6" height="10" rx="1.5" fill="#f59e0b" />
        <rect x="0" y="74" width="12" height="26" rx="3" fill="url(#tireGrad)" />
        <rect x="2" y="81" width="8" height="12" rx="1.5" fill="#f59e0b" />
        <rect x="58" y="74" width="12" height="26" rx="3" fill="url(#tireGrad)" />
        <rect x="60" y="81" width="8" height="12" rx="1.5" fill="#f59e0b" />

        {/* Aerodynamic Front Spoiler Wing */}
        <path d="M 6 12 L 64 12 L 60 18 L 10 18 Z" fill="#065f46" stroke="#34d399" strokeWidth="1" />
        <rect x="18" y="10" width="6" height="3" fill="#fef08a" />
        <rect x="46" y="10" width="6" height="3" fill="#fef08a" />

        {/* Main Monocoque Body */}
        <path
          d="M 22 18 Q 35 10 48 18 L 52 64 Q 56 82 52 100 L 18 100 Q 14 82 18 64 Z"
          fill="url(#bodyGrad)"
          stroke="#064e3b"
          strokeWidth="1.5"
        />

        {/* Racing White Stripe with Gold Soviet Star */}
        <rect x="32" y="20" width="6" height="74" fill="#ffffff" opacity="0.9" />
        <polygon points="35,32 36.5,36 40.5,36 37.2,38.5 38.5,42.5 35,40 31.5,42.5 32.8,38.5 29.5,36 33.5,36" fill="#dc2626" />

        {/* Cockpit & Driver Helmet */}
        <ellipse cx="35" cy="56" rx="9" ry="14" fill="#0f172a" />
        <circle cx="35" cy="55" r="7" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
        <path d="M 30 54 Q 35 51 40 54 L 39 57 Q 35 55 31 57 Z" fill="#0284c7" />

        {/* Engine Intake Velocity Stacks */}
        <circle cx="31" cy="74" r="2.5" fill="#94a3b8" />
        <circle cx="39" cy="74" r="2.5" fill="#94a3b8" />
        <circle cx="31" cy="80" r="2.5" fill="#94a3b8" />
        <circle cx="39" cy="80" r="2.5" fill="#94a3b8" />

        {/* Rear Wing / Spoiler */}
        <rect x="10" y="100" width="50" height="7" rx="2" fill="#065f46" stroke="#34d399" strokeWidth="1" />
        <rect x="22" y="102" width="26" height="3" rx="1" fill="#ef4444" />

        {/* Exhaust Flame Puffs when Accelerating */}
        {isGasPressed && (
          <g className="animate-pulse">
            <path d="M 28 107 Q 30 118 31 107" fill="#f59e0b" stroke="#ef4444" strokeWidth="2" />
            <path d="M 39 107 Q 41 118 42 107" fill="#f59e0b" stroke="#ef4444" strokeWidth="2" />
          </g>
        )}
      </svg>
    );
  };

  // Render authentic Soviet Obstacle Cars: Volga Taxi, ZIL Truck, Moskvich, LiAZ Bus
  const renderObstacleSvg = (car: ObstacleCar) => {
    if (car.type === 'volga_taxi') {
      return (
        <svg viewBox="0 0 64 110" className="w-13 sm:w-14 h-22 sm:h-24 drop-shadow-md">
          <rect x="2" y="16" width="7" height="18" rx="2" fill="#1e293b" />
          <rect x="55" y="16" width="7" height="18" rx="2" fill="#1e293b" />
          <rect x="2" y="74" width="7" height="18" rx="2" fill="#1e293b" />
          <rect x="55" y="74" width="7" height="18" rx="2" fill="#1e293b" />

          <rect x="8" y="12" width="48" height="84" rx="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <rect x="10" y="10" width="44" height="4" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="16" cy="15" r="3.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="48" cy="15" r="3.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="48" cy="27" r="2.5" fill="#22c55e" className="animate-pulse" />

          <line x1="32" y1="12" x2="32" y2="30" stroke="#ca8a04" strokeWidth="1" />

          <rect x="13" y="32" width="38" height="44" rx="5" fill="#0f172a" />
          <rect x="16" y="38" width="32" height="32" rx="3" fill="#fef08a" />
          <path d="M 14 34 L 50 34 L 46 44 L 18 44 Z" fill="#93c5fd" opacity="0.8" />
          <path d="M 18 64 L 46 64 L 50 74 L 14 74 Z" fill="#93c5fd" opacity="0.8" />

          <rect x="23" y="48" width="18" height="8" rx="2" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
          <text x="32" y="54" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="#000000">ТАКСИ</text>

          <rect x="10" y="94" width="44" height="4" rx="2" fill="#e2e8f0" />
          <rect x="12" y="91" width="8" height="3" fill="#ef4444" />
          <rect x="44" y="91" width="8" height="3" fill="#ef4444" />
        </svg>
      );
    }

    if (car.type === 'zil_truck') {
      return (
        <svg viewBox="0 0 72 130" className="w-15 sm:w-16 h-26 sm:h-28 drop-shadow-md">
          <rect x="1" y="18" width="8" height="22" rx="2" fill="#0f172a" />
          <rect x="63" y="18" width="8" height="22" rx="2" fill="#0f172a" />
          <rect x="0" y="78" width="9" height="24" rx="2" fill="#0f172a" />
          <rect x="63" y="78" width="9" height="24" rx="2" fill="#0f172a" />
          <rect x="0" y="96" width="9" height="24" rx="2" fill="#0f172a" />
          <rect x="63" y="96" width="9" height="24" rx="2" fill="#0f172a" />

          <rect x="10" y="8" width="52" height="6" rx="2" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
          <path d="M 12 14 L 60 14 L 62 48 L 10 48 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
          <rect x="20" y="12" width="32" height="10" rx="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
          <line x1="26" y1="14" x2="26" y2="20" stroke="#0284c7" strokeWidth="1" />
          <line x1="32" y1="14" x2="32" y2="20" stroke="#0284c7" strokeWidth="1" />
          <line x1="38" y1="14" x2="38" y2="20" stroke="#0284c7" strokeWidth="1" />
          <line x1="44" y1="14" x2="44" y2="20" stroke="#0284c7" strokeWidth="1" />

          <circle cx="16" cy="18" r="3.5" fill="#fef08a" stroke="#475569" strokeWidth="1" />
          <circle cx="56" cy="18" r="3.5" fill="#fef08a" stroke="#475569" strokeWidth="1" />

          <path d="M 16 28 L 56 28 L 54 42 L 18 42 Z" fill="#93c5fd" opacity="0.85" />

          <rect x="5" y="24" width="4" height="8" rx="1" fill="#475569" />
          <rect x="63" y="24" width="4" height="8" rx="1" fill="#475569" />

          <rect x="9" y="50" width="54" height="74" rx="3" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          <line x1="9" y1="68" x2="63" y2="68" stroke="#14532d" strokeWidth="1.5" />
          <line x1="9" y1="88" x2="63" y2="88" stroke="#14532d" strokeWidth="1.5" />
          <line x1="9" y1="108" x2="63" y2="108" stroke="#14532d" strokeWidth="1.5" />

          <rect x="12" y="122" width="10" height="4" fill="#ef4444" />
          <rect x="50" y="122" width="10" height="4" fill="#ef4444" />
        </svg>
      );
    }

    if (car.type === 'bus') {
      return (
        <svg viewBox="0 0 68 140" className="w-14 sm:w-16 h-28 sm:h-32 drop-shadow-md">
          <rect x="1" y="22" width="7" height="20" rx="2" fill="#0f172a" />
          <rect x="60" y="22" width="7" height="20" rx="2" fill="#0f172a" />
          <rect x="1" y="98" width="7" height="22" rx="2" fill="#0f172a" />
          <rect x="60" y="98" width="7" height="22" rx="2" fill="#0f172a" />

          <rect x="8" y="8" width="52" height="126" rx="8" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />

          <rect x="18" y="12" width="32" height="7" rx="1.5" fill="#ffffff" stroke="#000" strokeWidth="0.8" />
          <text x="34" y="17.5" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="#000">14 · МУЗЕЙ</text>

          <path d="M 12 22 L 56 22 L 54 36 L 14 36 Z" fill="#93c5fd" opacity="0.85" />
          <rect x="12" y="42" width="44" height="12" rx="2" fill="#60a5fa" opacity="0.6" />
          <rect x="12" y="58" width="44" height="12" rx="2" fill="#60a5fa" opacity="0.6" />
          <rect x="12" y="74" width="44" height="12" rx="2" fill="#60a5fa" opacity="0.6" />
          <rect x="12" y="90" width="44" height="12" rx="2" fill="#60a5fa" opacity="0.6" />
          <rect x="14" y="108" width="40" height="10" rx="2" fill="#93c5fd" opacity="0.85" />

          <polygon points="34,7 35.5,10 39,10 36.2,12 37.5,15 34,13 30.5,15 31.8,12 29,10 32.5,10" fill="#dc2626" />

          <circle cx="16" cy="130" r="2.5" fill="#ef4444" />
          <circle cx="52" cy="130" r="2.5" fill="#ef4444" />
        </svg>
      );
    }

    // Default: Москвич-412 / Жигули ВАЗ-2101
    return (
      <svg viewBox="0 0 60 100" className="w-12 sm:w-14 h-20 sm:h-22 drop-shadow-md">
        <rect x="2" y="14" width="6" height="16" rx="2" fill="#0f172a" />
        <rect x="52" y="14" width="6" height="16" rx="2" fill="#0f172a" />
        <rect x="2" y="68" width="6" height="16" rx="2" fill="#0f172a" />
        <rect x="52" y="68" width="6" height="16" rx="2" fill="#0f172a" />

        <rect x="8" y="10" width="44" height="78" rx="8" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
        <rect x="10" y="8" width="40" height="3" rx="1.5" fill="#e2e8f0" />
        <circle cx="15" cy="13" r="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="45" cy="13" r="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />

        <rect x="13" y="30" width="34" height="40" rx="4" fill="#0f172a" />
        <path d="M 14 32 L 46 32 L 43 40 L 17 40 Z" fill="#93c5fd" opacity="0.8" />
        <rect x="15" y="42" width="30" height="18" fill="#ea580c" />
        <path d="M 17 62 L 43 62 L 46 70 L 14 70 Z" fill="#93c5fd" opacity="0.8" />

        <rect x="18" y="43" width="24" height="16" rx="2" fill="#78350f" stroke="#e2e8f0" strokeWidth="0.8" />
        <rect x="22" y="46" width="16" height="10" rx="1.5" fill="#451a03" />

        <rect x="10" y="86" width="40" height="3" rx="1.5" fill="#e2e8f0" />
        <rect x="12" y="83" width="6" height="3" fill="#ef4444" />
        <rect x="42" y="83" width="6" height="3" fill="#ef4444" />
      </svg>
    );
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#181d24] via-[#12151b] to-[#0c0f14] border-2 border-stone-800 p-3 sm:p-6 shadow-2xl text-stone-200 relative overflow-hidden">
      {/* Decorative Soviet Industrial Corner Bolts */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 shadow-inner"></div>
      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 shadow-inner"></div>
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 shadow-inner"></div>
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 shadow-inner"></div>

      {/* Arcade Marquee & Factory Nameplate Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-soviet-mono text-[11px] sm:text-xs tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              ПО «РАДАР» ЛЕНИНГРАД · ТУ 25-07.1350-77
            </span>
            <span className="text-[11px] sm:text-xs text-stone-400">Стоимость игры: 15 копеек</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-bold font-display text-white mt-1 tracking-wide flex items-center gap-2.5">
            <span>Электронное авторалли «Магистраль»</span>
          </h3>
        </div>

        {/* Dashboard Indicators: Speed, Time, Score & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          {/* Screen Display Mode Switcher */}
          <div className="flex items-center gap-1 bg-stone-950/90 p-1 rounded-lg border border-stone-800">
            <button
              type="button"
              onClick={() => setScreenTheme('color')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer touch-manipulation ${
                screenTheme === 'color' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
              title="Цветной экран ГОСТ 1977"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setScreenTheme('emerald')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer touch-manipulation ${
                screenTheme === 'emerald' ? 'bg-emerald-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
              title="Изумрудный монохром К155"
            >
              <Tv className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setScreenTheme('night')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer touch-manipulation ${
                screenTheme === 'night' ? 'bg-indigo-600 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
              title="Ночная трасса со светом фар"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {isPlaying && (
            <button
              type="button"
              onClick={stopGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-red-400 border border-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer touch-manipulation"
              title="Прекратить заезд"
            >
              <XCircle className="w-3.5 h-3.5" />
              Прекратить
            </button>
          )}

          {/* VFD Digital Scoreboard */}
          <div className="flex items-center gap-2.5 sm:gap-4 bg-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-stone-800 shadow-inner">
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-stone-400 font-soviet-mono">Время</div>
              <div className="font-soviet-mono text-base sm:text-xl font-bold text-amber-400">
                {timeLeft}<span className="text-xs text-stone-500">с</span>
              </div>
            </div>

            <div className="h-6 sm:h-7 w-px bg-stone-800"></div>

            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-stone-400 font-soviet-mono">Скорость</div>
              <div className="font-soviet-mono text-base sm:text-xl font-bold text-cyan-400">
                {speed}<span className="text-[10px] text-stone-500 ml-0.5">км/ч</span>
              </div>
            </div>

            <div className="h-6 sm:h-7 w-px bg-stone-800"></div>

            <div className="text-center">
              <div className="text-[9px] uppercase tracking-wider text-stone-400 font-soviet-mono">Счёт</div>
              <div className="font-soviet-mono text-base sm:text-xl font-bold text-emerald-400">
                {score}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main CRT Gaming Enclosure */}
      <div className="relative my-4 sm:my-6 rounded-2xl p-2.5 sm:p-4 bg-[#090d12] border-4 border-[#1e2430] shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]">
        {/* CRT Curved Screen with Phosphor Filter */}
        <div
          className={`relative h-[380px] sm:h-[430px] md:h-[480px] w-full rounded-xl overflow-hidden border-2 border-stone-800 select-none flex items-center justify-center transition-all ${
            screenTheme === 'emerald'
              ? 'bg-[#041209] [filter:hue-rotate(60deg)_saturate(200%)]'
              : screenTheme === 'night'
              ? 'bg-[#03060a]'
              : 'bg-[#080d14]'
          } ${crashed ? 'animate-bounce border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)]' : ''}`}
        >
          {/* CRT Scanline and Phosphor Glow Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-30 opacity-25"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 2px, transparent 2px, transparent 4px)',
            }}
          ></div>
          <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_80px_rgba(0,0,0,0.95)]"></div>

          {/* Road Arena */}
          <div className="relative w-full max-w-xl h-full flex justify-between overflow-hidden">
            {/* Left Road Shoulder with Warning Chevrons & Guide Posts */}
            <div className="w-8 sm:w-14 h-full bg-[#1e251f] border-r-4 border-white flex flex-col justify-between relative overflow-hidden shrink-0">
              {/* Animated Red-White Roadside Curb */}
              <div
                className="absolute inset-0 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(180deg, #dc2626 0px, #dc2626 24px, #ffffff 24px, #ffffff 48px)',
                  backgroundPositionY: `${roadOffset * 2}%`,
                }}
              ></div>
              {/* Kilometer Marker Post passing by */}
              <div
                style={{ top: `${(roadOffset * 1.5) % 100}%` }}
                className="absolute left-1 w-5 h-8 bg-stone-200 border border-stone-800 rounded-t text-[6px] font-bold text-black flex flex-col items-center justify-center shadow"
              >
                <span>КМ</span>
                <span className="text-[7px] text-red-600 font-soviet-mono">{100 + Math.floor(distanceKm)}</span>
              </div>
            </div>

            {/* Central Highway Asphalt (3 lanes) */}
            <div className="relative flex-1 h-full bg-[#11161d] overflow-hidden">
              {/* Asphalt Grain Texture */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              ></div>

              {/* Lane 1/2 Divider Dashed Road Striping (Animated with speed!) */}
              <div
                className="absolute top-0 bottom-0 left-1/3 w-1 -translate-x-1/2"
                style={{
                  backgroundImage: 'repeating-linear-gradient(180deg, #fef08a 0px, #fef08a 28px, transparent 28px, transparent 60px)',
                  backgroundPositionY: `${roadOffset * 3.5}%`,
                }}
              ></div>

              {/* Lane 2/3 Divider Dashed Road Striping (Animated with speed!) */}
              <div
                className="absolute top-0 bottom-0 left-2/3 w-1 -translate-x-1/2"
                style={{
                  backgroundImage: 'repeating-linear-gradient(180deg, #fef08a 0px, #fef08a 28px, transparent 28px, transparent 60px)',
                  backgroundPositionY: `${roadOffset * 3.5}%`,
                }}
              ></div>

              {/* Distant Horizon Speed Lines Effect */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10"></div>

              {/* Obstacle Vehicles on the Road - NO transition-all to eliminate any upward teleportation! */}
              {isPlaying &&
                obstacles.map((car) => {
                  const laneX = car.lane === 0 ? '20%' : car.lane === 1 ? '50%' : '80%';
                  return (
                    <div
                      key={car.id}
                      style={{
                        left: laneX,
                        top: `${car.y}%`,
                      }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform pointer-events-none"
                    >
                      {renderObstacleSvg(car)}
                    </div>
                  );
                })}

              {/* Player's Soviet Racing Car */}
              {isPlaying && (
                <div
                  style={{
                    left: `${playerVisualX}%`,
                    bottom: '8%',
                    transform: `translate(-50%, 0) rotate(${steeringAngle}deg)`,
                  }}
                  className={`absolute z-25 will-change-transform ${
                    crashed ? 'opacity-30 animate-ping' : ''
                  }`}
                >
                  {renderPlayerCarSvg()}
                </div>
              )}

              {/* Overtake Streak / Crash Notification HUD Banner */}
              {lastOvertakeMessage && (
                <div
                  className={`absolute top-6 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full font-soviet-mono text-xs font-bold uppercase tracking-wider shadow-xl border animate-bounce ${
                    crashed
                      ? 'bg-red-950 text-red-200 border-red-500'
                      : 'bg-emerald-950 text-emerald-200 border-emerald-500'
                  }`}
                >
                  {lastOvertakeMessage}
                </div>
              )}
            </div>

            {/* Right Road Shoulder with Warning Chevrons */}
            <div className="w-8 sm:w-14 h-full bg-[#1e251f] border-l-4 border-white flex flex-col justify-between relative overflow-hidden shrink-0">
              <div
                className="absolute inset-0 w-full"
                style={{
                  backgroundImage: 'repeating-linear-gradient(180deg, #dc2626 0px, #dc2626 24px, #ffffff 24px, #ffffff 48px)',
                  backgroundPositionY: `${roadOffset * 2}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Idle screen with authentic arcade graphics */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-40 overflow-y-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mb-2.5 text-emerald-400 shadow-lg">
                <Gauge className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl sm:text-3xl text-white uppercase tracking-wider font-bold">
                Авторалли «Магистраль» (1977)
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mt-1.5 leading-relaxed">
                Культовый ленинградский автосимулятор с реальным рулём и педалями. 
                Обгоняйте такси «Волга», грузовики ЗИЛ и автобусы ЛиАЗ. 
                Удерживайте педаль газа для разгона до 145 км/ч и удвоения очков!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-sm my-3 text-[11px] font-soviet-mono text-stone-300">
                <div className="p-2 rounded bg-stone-900 border border-stone-800 text-center">
                  <div className="text-amber-400 font-bold">РУЛЬ ◄ ►</div>
                  <div className="text-[9px] text-stone-400">Стрелки / A-D</div>
                </div>
                <div className="p-2 rounded bg-stone-900 border border-stone-800 text-center">
                  <div className="text-amber-400 font-bold">ГАЗ ▲</div>
                  <div className="text-[9px] text-stone-400">W / Ускорение</div>
                </div>
                <div className="col-span-2 sm:col-span-1 p-2 rounded bg-stone-900 border border-stone-800 text-center">
                  <div className="text-amber-400 font-bold">ТОРМОЗ ▼</div>
                  <div className="text-[9px] text-stone-400">S / Замедление</div>
                </div>
              </div>

              <button
                type="button"
                onClick={startGame}
                className="mt-2 px-7 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-display text-xs sm:text-sm uppercase tracking-widest transition-all font-bold cursor-pointer touch-manipulation active:scale-95 shadow-xl border border-red-500/50 shrink-0 flex items-center gap-2"
              >
                <span>🪙 Опустить 15 коп. и начать заезд</span>
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-40 overflow-y-auto">
              <Award className="w-10 h-10 text-amber-400 mb-1.5 shrink-0" />
              <h4 className="font-display text-2xl sm:text-3xl text-white uppercase font-bold">
                Заезд окончен!
              </h4>
              <p className="font-soviet-mono text-2xl text-emerald-400 mt-1">
                {score} очков
              </p>

              <div className="flex items-center gap-4 my-2 text-xs font-soviet-mono text-stone-300 bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800">
                <div>Дистанция: <span className="text-amber-400 font-bold">{distanceKm} км</span></div>
                <div className="h-4 w-px bg-stone-700"></div>
                <div>Аварий: <span className="text-red-400 font-bold">{crashCount}</span></div>
                <div className="h-4 w-px bg-stone-700"></div>
                <div>Макс. скорость: <span className="text-cyan-400 font-bold">{isGasPressed ? 145 : 120} км/ч</span></div>
              </div>

              <p className="text-xs text-stone-300 mt-1 max-w-xs">
                {score >= 350
                  ? 'Отличный результат! Вы заслужили звание Мастера Спорта СССР по авторалли!'
                  : 'Заезд завершён. Тренируйте реакцию для манёвров на высокой скорости!'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={startGame}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer touch-manipulation"
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

      {/* Tactile Soviet Arcade Cockpit & Steering Dashboard */}
      <div className="bg-stone-950 p-3.5 sm:p-5 rounded-2xl border border-stone-800/90 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          {/* Mechanical Speedometer & Odometer Gauges */}
          <div className="md:col-span-4 flex items-center justify-around sm:justify-start gap-4 p-2.5 rounded-xl bg-stone-900/80 border border-stone-800">
            {/* Speedometer Gauge */}
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-stone-950 border-2 border-stone-700 flex flex-col items-center justify-center shadow-inner">
              <div
                style={{ transform: `rotate(${-120 + (speed / 180) * 240}deg)` }}
                className="absolute top-1/2 left-1/2 w-0.5 h-7 sm:h-8 bg-red-500 origin-top transform -translate-x-1/2 transition-transform duration-100"
              ></div>
              <div className="w-3 h-3 rounded-full bg-stone-300 border border-black z-10 shadow"></div>
              <span className="font-soviet-mono text-xs font-bold text-amber-400 mt-2 z-10">
                {speed}
              </span>
              <span className="text-[7px] text-stone-500 font-soviet-mono uppercase">КМ/Ч</span>
            </div>

            {/* Odometer Mechanical Reels */}
            <div className="space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-stone-400 font-soviet-mono">ПРОБЕГ (ОДОМЕТР)</div>
              <div className="flex items-center gap-0.5 bg-black px-2 py-1 rounded border border-stone-800 font-soviet-mono text-xs font-bold text-emerald-400">
                <span className="text-stone-600">00</span>
                <span>{distanceKm < 10 ? `0${distanceKm}` : distanceKm}</span>
                <span className="text-[9px] text-stone-500 ml-1">КМ</span>
              </div>
              <div className="text-[9px] text-stone-400 flex items-center gap-1">
                <span>ПОЛОСА:</span>
                <span className="text-amber-400 font-bold font-soviet-mono">
                  {playerLane === 0 ? 'ЛЕВАЯ' : playerLane === 1 ? 'ЦЕНТР' : 'ПРАВАЯ'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Soviet Steering Wheel with Authentic Chrome Factory Hub */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer Wheel Rim (Rotates smoothly with steering input!) */}
              <div
                style={{ transform: `rotate(${playerLane === 0 ? -28 : playerLane === 2 ? 28 : 0}deg)` }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-stone-800 bg-stone-900 shadow-2xl flex items-center justify-center transition-transform duration-150 select-none"
              >
                {/* 3 Metal Spokes */}
                <div className="absolute w-full h-1.5 bg-stone-600"></div>
                <div className="absolute w-1.5 h-full bg-stone-600"></div>

                {/* Central Hub with Soviet Plant Logo (No Honking, Pure Authentic Wheel) */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950 border-2 border-stone-500 z-10 flex items-center justify-center shadow-lg pointer-events-none select-none">
                  <span className="text-[7px] font-soviet-mono font-bold text-amber-400 tracking-wider">
                    РАДАР
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[9px] font-soviet-mono text-stone-400 mt-1 uppercase tracking-wider">
              РУЛЕВОЕ КОЛЕСО «РАДАР»
            </span>
          </div>

          {/* Tactile Driver Controls: Steering Buttons & Identical Color Pedals */}
          <div className="md:col-span-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={steerLeft}
                className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-100 font-display text-xs uppercase tracking-wider transition-all border border-stone-700 cursor-pointer touch-manipulation flex items-center justify-center gap-1 active:scale-95 shadow"
              >
                ◄ Влево (A)
              </button>
              <button
                type="button"
                onClick={steerRight}
                className="py-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-100 font-display text-xs uppercase tracking-wider transition-all border border-stone-700 cursor-pointer touch-manipulation flex items-center justify-center gap-1 active:scale-95 shadow"
              >
                Вправо (D) ►
              </button>
            </div>

            {/* Pedals: Brake and Gas have 100% IDENTICAL styling and text colors */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onMouseDown={() => setIsBrakePressed(true)}
                onMouseUp={() => setIsBrakePressed(false)}
                onTouchStart={() => setIsBrakePressed(true)}
                onTouchEnd={() => setIsBrakePressed(false)}
                className={`py-2.5 rounded-xl font-display text-xs uppercase tracking-wider transition-all border cursor-pointer touch-manipulation flex items-center justify-center gap-1 select-none ${
                  isBrakePressed
                    ? 'bg-amber-700 text-white border-amber-500 scale-98 shadow-inner'
                    : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-700'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Тормоз</span>
              </button>

              <button
                type="button"
                onMouseDown={() => setIsGasPressed(true)}
                onMouseUp={() => setIsGasPressed(false)}
                onTouchStart={() => setIsGasPressed(true)}
                onTouchEnd={() => setIsGasPressed(false)}
                className={`py-2.5 rounded-xl font-display text-xs uppercase tracking-wider transition-all border cursor-pointer touch-manipulation flex items-center justify-center gap-1 select-none ${
                  isGasPressed
                    ? 'bg-amber-700 text-white border-amber-500 scale-98 shadow-inner'
                    : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Газ (x2 очки)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
