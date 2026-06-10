"use client";

import { useRef, useEffect, useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Play,
  Layout,
  Layers,
  Tv,
  Flame,
  Zap,
  Sword,
} from "lucide-react";
import { CONTACT_DATA } from "@/components/ArtboardContent";

// --- Background Particles ---
const CanvasParticles = ({ accentColor }: { accentColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(accentColor);
  
  useEffect(() => {
    colorRef.current = accentColor;
  }, [accentColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1.5,
      glow: Math.random() * 12 + 6,
      colorShift: Math.random(),
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const alpha = p.colorShift * 0.25 + 0.15;
        const color = p.colorShift > 0.75 
          ? `rgba(255, 255, 255, ${alpha * 0.4})` 
          : `${colorRef.current}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = colorRef.current;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- Game Definition ---
interface GameItem {
  id: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
  accent: string;
}

const PREMIUM_GAMES: GameItem[] = [
  {
    id: 'breaker',
    title: 'Classic Brick Breaker',
    desc: 'Bounce a glowing light orb to break grid tiles. Satisfying visual explosions and interactive bounce physics.',
    icon: Layout,
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    accent: '#06b6d4'
  },
  {
    id: 'multiball',
    title: 'Multi-Ball Chaos',
    desc: 'Take on the classic brick layout but with three bouncing light spheres simultaneously. Extreme pace.',
    icon: Layers,
    color: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
    accent: '#8b5cf6'
  },
  {
    id: 'pong',
    title: 'Astro Pong (vs AI)',
    desc: 'Engage in a fast-paced neon table tennis match against the computer. First to 5 points wins.',
    icon: Tv,
    color: 'text-pink-400 border-pink-500/20 bg-pink-500/5',
    accent: '#ec4899'
  },
  {
    id: 'jump',
    title: 'Neon Astro Run',
    desc: 'Dash over glowing rose spike hazards. Avoid collisions as the velocity accelerates dynamically over time.',
    icon: Flame,
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    accent: '#10b981'
  },
  {
    id: 'snake',
    title: 'Retro Cyber Snake',
    desc: 'Guide a glowing grid crawler to devour byte blocks. Avoid wall crashes and self-collision hazards.',
    icon: Zap,
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    accent: '#f59e0b'
  },
  {
    id: 'slice',
    title: 'Cyber Slasher',
    desc: 'Slash floating data spheres with your glowing blade trail. Avoid slicing warning module bombs.',
    icon: Sword,
    color: 'text-red-400 border-red-500/20 bg-red-500/5',
    accent: '#ef4444'
  }
];

// =========================================================
// 🕹️ MODULE 1: NEON BRICK BREAKER COMPONENT
// =========================================================
function NeonBrickBreaker({ canvasHeight = 500 }: { canvasHeight?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('brick_breaker_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Sync high score whenever score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('brick_breaker_highscore', score.toString());
    }
  }, [score, highScore]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 640;
    const paddleWidth = isMobile ? 180 : 120;
    const paddleHeight = isMobile ? 18 : 12;
    const paddle = { x: canvas.width / 2 - paddleWidth / 2, width: paddleWidth, height: paddleHeight };
    const ballRadius = isMobile ? 13 : 8;
    const ball = { x: canvas.width / 2, y: canvas.height - 35, vx: isMobile ? 5.5 : 4.5, vy: isMobile ? -8.5 : -7, radius: ballRadius };
    
    const rowCount = 4;
    const colCount = 8;
    const brickWidth = 92;
    const brickHeight = isMobile ? 28 : 20;
    const brickPadding = 12;
    const offsetTop = 60;
    const offsetLeft = (canvas.width - (colCount * (brickWidth + brickPadding) - brickPadding)) / 2;

    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'];
    const bricks: { x: number; y: number; active: boolean; color: string }[] = [];

    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        bricks.push({
          x: offsetLeft + c * (brickWidth + brickPadding),
          y: offsetTop + r * (brickHeight + brickPadding),
          active: true,
          color: colors[r % colors.length]
        });
      }
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines in canvas background
      ctx.strokeStyle = 'rgba(255,255,255,0.01)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw Bricks
      bricks.forEach(b => {
        if (!b.active) return;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, brickWidth, brickHeight, 5);
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = b.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Paddle
      ctx.beginPath();
      ctx.roundRect(paddle.x, canvas.height - 25, paddle.width, paddle.height, 6);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255,255,255,0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isPlaying && !isGameOver && !isGameWon) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          ball.vx = -ball.vx;
        }
        if (ball.y - ball.radius < 0) {
          ball.vy = -ball.vy;
        }

        if (
          ball.y + ball.radius >= canvas.height - 25 &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.width
        ) {
          const relativeHit = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
          ball.vx = relativeHit * 5;
          ball.vy = -Math.abs(ball.vy);
        }

        bricks.forEach(b => {
          if (!b.active) return;
          if (
            ball.x + ball.radius >= b.x &&
            ball.x - ball.radius <= b.x + brickWidth &&
            ball.y + ball.radius >= b.y &&
            ball.y - ball.radius <= b.y + brickHeight
          ) {
            b.active = false;
            ball.vy = -ball.vy;
            setScore(s => s + 50);
          }
        });

        if (ball.y - ball.radius > canvas.height) {
          setIsGameOver(true);
          setIsPlaying(false);
        }

        if (bricks.every(b => !b.active)) {
          setIsGameWon(true);
          setIsPlaying(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const scaleX = canvas.width / rect.width;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, (relativeX * scaleX) - paddle.width / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - rect.left;
      const scaleX = canvas.width / rect.width;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, (relativeX * scaleX) - paddle.width / 2));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying, resetTrigger, isGameOver, isGameWon, canvasHeight]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border-x-0 sm:border border-white/10 bg-[#0a0a0c] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl p-0 sm:p-1 w-full max-w-[900px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={canvasHeight}
          className="w-full h-auto bg-[#070709] rounded-none sm:rounded-xl block"
        />
        
        {!isPlaying && !isGameOver && !isGameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-none sm:rounded-xl p-6">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white text-black font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/90 shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Launch Orb
            </button>
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-4">Move cursor or drag finger to slide paddle</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <h3 className="font-heading text-xl font-bold text-red-400 mb-1">Orb Dropped</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Total Score: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setIsGameOver(false);
                setIsGameWon(false);
                setIsPlaying(false);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Game
            </button>
          </div>
        )}

        {isGameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <Trophy className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
            <h3 className="font-heading text-xl font-bold text-emerald-400 mb-1">Grid Cleaned!</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Completed Score: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setIsGameOver(false);
                setIsGameWon(false);
                setIsPlaying(false);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center font-mono text-[8.5px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-4 pb-4 px-4 sm:px-2 w-full max-w-[900px]">
        <span>Score: <strong className="text-cyan-400 font-heading text-xs sm:text-base">{score}</strong></span>
        <span>High Score: <strong className="text-amber-400 font-heading text-xs sm:text-base">{highScore}</strong></span>
        <span className="hidden md:inline">Drag / move mouse to play</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MODULE 2: MULTI-BALL CHAOS COMPONENT
// =========================================================
function MultiBallChaos({ canvasHeight = 500 }: { canvasHeight?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('multiball_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Sync high score whenever score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('multiball_highscore', score.toString());
    }
  }, [score, highScore]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 640;
    const paddleWidth = isMobile ? 180 : 120;
    const paddleHeight = isMobile ? 18 : 12;
    const paddle = { x: canvas.width / 2 - paddleWidth / 2, width: paddleWidth, height: paddleHeight };
    const ballRadius = isMobile ? 13 : 8;
    
    // 3 Bouncing balls
    const balls = [
      { x: canvas.width / 2, y: canvas.height - 35, vx: isMobile ? 5.5 : 4.5, vy: isMobile ? -8.5 : -7, radius: ballRadius, active: true },
      { x: canvas.width / 2 - 30, y: canvas.height - 45, vx: isMobile ? -4.5 : -3.5, vy: isMobile ? -9 : -7.5, radius: ballRadius, active: true },
      { x: canvas.width / 2 + 30, y: canvas.height - 45, vx: isMobile ? 6.5 : 5.5, vy: isMobile ? -8 : -6.5, radius: ballRadius, active: true },
    ];
    
    const rowCount = 4;
    const colCount = 8;
    const brickWidth = 92;
    const brickHeight = isMobile ? 28 : 20;
    const brickPadding = 12;
    const offsetTop = 60;
    const offsetLeft = (canvas.width - (colCount * (brickWidth + brickPadding) - brickPadding)) / 2;

    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'];
    const bricks: { x: number; y: number; active: boolean; color: string }[] = [];

    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        bricks.push({
          x: offsetLeft + c * (brickWidth + brickPadding),
          y: offsetTop + r * (brickHeight + brickPadding),
          active: true,
          color: colors[r % colors.length]
        });
      }
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      bricks.forEach(b => {
        if (!b.active) return;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, brickWidth, brickHeight, 5);
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = b.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Paddle
      ctx.beginPath();
      ctx.roundRect(paddle.x, canvas.height - 25, paddle.width, paddle.height, 6);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255,255,255,0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw active balls
      balls.forEach(ball => {
        if (!ball.active) return;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8b5cf6';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (isPlaying && !isGameOver && !isGameWon) {
        balls.forEach(ball => {
          if (!ball.active) return;
          ball.x += ball.vx;
          ball.y += ball.vy;

          if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.vx = -ball.vx;
          }
          if (ball.y - ball.radius < 0) {
            ball.vy = -ball.vy;
          }

          if (
            ball.y + ball.radius >= canvas.height - 25 &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width
          ) {
            const relativeHit = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            ball.vx = relativeHit * 5;
            ball.vy = -Math.abs(ball.vy);
          }

          bricks.forEach(b => {
            if (!b.active) return;
            if (
              ball.x + ball.radius >= b.x &&
              ball.x - ball.radius <= b.x + brickWidth &&
              ball.y + ball.radius >= b.y &&
              ball.y - ball.radius <= b.y + brickHeight
            ) {
              b.active = false;
              ball.vy = -ball.vy;
              setScore(s => s + 50);
            }
          });

          if (ball.y - ball.radius > canvas.height) {
            ball.active = false;
          }
        });

        // Game Over when all balls fall
        if (balls.every(b => !b.active)) {
          setIsGameOver(true);
          setIsPlaying(false);
        }

        if (bricks.every(b => !b.active)) {
          setIsGameWon(true);
          setIsPlaying(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const scaleX = canvas.width / rect.width;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, (relativeX * scaleX) - paddle.width / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - rect.left;
      const scaleX = canvas.width / rect.width;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, (relativeX * scaleX) - paddle.width / 2));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying, resetTrigger, isGameOver, isGameWon, canvasHeight]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border-x-0 sm:border border-white/10 bg-[#0a0a0c] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl p-0 sm:p-1 w-full max-w-[900px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={canvasHeight}
          className="w-full h-auto bg-[#070709] rounded-none sm:rounded-xl block"
        />
        
        {!isPlaying && !isGameOver && !isGameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-none sm:rounded-xl p-6">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white text-black font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/90 shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Launch Orbs
            </button>
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-4">Launches 3 balls. Drag finger or move cursor to slide paddle.</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <h3 className="font-heading text-xl font-bold text-red-400 mb-1">Chaos Terminated</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Total Score: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setIsGameOver(false);
                setIsGameWon(false);
                setIsPlaying(false);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Game
            </button>
          </div>
        )}

        {isGameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <Trophy className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
            <h3 className="font-heading text-xl font-bold text-emerald-400 mb-1">Grid Cleaned!</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Completed Score: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setIsGameOver(false);
                setIsGameWon(false);
                setIsPlaying(false);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center font-mono text-[8.5px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-4 pb-4 px-4 sm:px-2 w-full max-w-[900px]">
        <span>Score: <strong className="text-violet-400 font-heading text-xs sm:text-base">{score}</strong></span>
        <span>High Score: <strong className="text-amber-400 font-heading text-xs sm:text-base">{highScore}</strong></span>
        <span className="hidden md:inline">Drag / move mouse to play</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MODULE 3: ASTRO PONG COMPONENT (VS AI)
// =========================================================
function AstroPong({ canvasHeight = 500 }: { canvasHeight?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Load streaks from localStorage
  useEffect(() => {
    const savedBest = localStorage.getItem('pong_best_streak');
    const savedCurrent = localStorage.getItem('pong_current_streak');
    if (savedBest) setBestStreak(parseInt(savedBest, 10));
    if (savedCurrent) setWinStreak(parseInt(savedCurrent, 10));
  }, []);

  // Sync Win Streaks dynamically on Game Over
  useEffect(() => {
    if (isGameOver) {
      if (playerScore >= 5) {
        const nextStreak = winStreak + 1;
        setWinStreak(nextStreak);
        localStorage.setItem('pong_current_streak', nextStreak.toString());
        if (nextStreak > bestStreak) {
          setBestStreak(nextStreak);
          localStorage.setItem('pong_best_streak', nextStreak.toString());
        }
      } else if (aiScore >= 5) {
        setWinStreak(0);
        localStorage.setItem('pong_current_streak', '0');
      }
    }
  }, [isGameOver, playerScore, aiScore, winStreak, bestStreak]);
  const [winnerMessage, setWinnerMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 640;
    const pWidth = isMobile ? 18 : 12;
    const pHeight = isMobile ? 130 : 90;
    const player = { x: 25, y: canvas.height / 2 - pHeight / 2 };
    const ai = { x: canvas.width - 25 - pWidth, y: canvas.height / 2 - pHeight / 2 };
    const ballRadius = isMobile ? 13 : 8;
    const ball = { x: canvas.width / 2, y: canvas.height / 2, vx: isMobile ? 7 : 5.5, vy: isMobile ? 4 : 3, radius: ballRadius };

    let animationFrameId: number;

    const resetBall = (dir: number) => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.vx = dir * 5.5;
      ball.vy = (Math.random() - 0.5) * 8;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Center Net Line
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw Player Paddle (White)
      ctx.beginPath();
      ctx.roundRect(player.x, player.y, pWidth, pHeight, 5);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw AI Paddle (Pink)
      ctx.beginPath();
      ctx.roundRect(ai.x, ai.y, pWidth, pHeight, 5);
      ctx.fillStyle = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ec4899';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isPlaying && !isGameOver) {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy;
        }
        if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy = -ball.vy;
        }

        // AI Logic: follow the ball vertical position
        const aiTarget = ball.y - pHeight / 2;
        const aiSpeed = 4.8; // capped speed to make game beatable
        if (ai.y < aiTarget) {
          ai.y += Math.min(aiSpeed, aiTarget - ai.y);
        } else if (ai.y > aiTarget) {
          ai.y -= Math.min(aiSpeed, ai.y - aiTarget);
        }
        // Bounds limit for paddles
        ai.y = Math.max(0, Math.min(canvas.height - pHeight, ai.y));

        // Player Paddle Collision
        if (
          ball.vx < 0 &&
          ball.x - ball.radius <= player.x + pWidth &&
          ball.x + ball.radius >= player.x &&
          ball.y >= player.y &&
          ball.y <= player.y + pHeight
        ) {
          const relativeHit = (ball.y - (player.y + pHeight / 2)) / (pHeight / 2);
          ball.vx = Math.abs(ball.vx) * 1.05; // speed up slightly on hit
          ball.vy = relativeHit * 5;
          ball.x = player.x + pWidth + ball.radius;
        }

        // AI Paddle Collision
        if (
          ball.vx > 0 &&
          ball.x + ball.radius >= ai.x &&
          ball.x - ball.radius <= ai.x + pWidth &&
          ball.y >= ai.y &&
          ball.y <= ai.y + pHeight
        ) {
          const relativeHit = (ball.y - (ai.y + pHeight / 2)) / (pHeight / 2);
          ball.vx = -Math.abs(ball.vx) * 1.05;
          ball.vy = relativeHit * 5;
          ball.x = ai.x - ball.radius;
        }

        // Score checkpoints
        if (ball.x < 0) {
          // AI scores
          setAiScore(s => {
            const next = s + 1;
            if (next >= 5) {
              setIsGameOver(true);
              setWinnerMessage("AI Wins the Match!");
            } else {
              resetBall(1);
            }
            return next;
          });
        } else if (ball.x > canvas.width) {
          // Player scores
          setPlayerScore(s => {
            const next = s + 1;
            if (next >= 5) {
              setIsGameOver(true);
              setWinnerMessage("You Win the Match!");
            } else {
              resetBall(-1);
            }
            return next;
          });
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse vertical coordinate capture
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const scaleY = canvas.height / rect.height;
      player.y = Math.max(0, Math.min(canvas.height - pHeight, (relativeY * scaleY) - pHeight / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const relativeY = e.touches[0].clientY - rect.top;
      const scaleY = canvas.height / rect.height;
      player.y = Math.max(0, Math.min(canvas.height - pHeight, (relativeY * scaleY) - pHeight / 2));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying, resetTrigger, isGameOver, canvasHeight]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border-x-0 sm:border border-white/10 bg-[#0a0a0c] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl p-0 sm:p-1 w-full max-w-[900px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={canvasHeight}
          className="w-full h-auto bg-[#070709] rounded-none sm:rounded-xl block"
        />

        {/* Score Ticker on Screen Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-10 select-none pointer-events-none font-heading text-4xl font-extrabold text-white/30 tracking-widest">
          <span className={playerScore > aiScore ? 'text-white/60' : ''}>{playerScore}</span>
          <span>:</span>
          <span className={aiScore > playerScore ? 'text-pink-400' : ''}>{aiScore}</span>
        </div>
        
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-none sm:rounded-xl p-6">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white text-black font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/90 shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Serve Ball
            </button>
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-4">Move cursor or drag finger vertically to steer left paddle. First to 5 wins!</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <Trophy className={`w-10 h-10 mb-2 ${playerScore >= 5 ? 'text-amber-400 animate-bounce' : 'text-white/30'}`} />
            <h3 className="font-heading text-xl font-bold text-white mb-1">{winnerMessage}</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Final Score: {playerScore} - {aiScore}</p>
            <button
              onClick={() => {
                setPlayerScore(0);
                setAiScore(0);
                setIsGameOver(false);
                setIsPlaying(false);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay Match
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center font-mono text-[8.5px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-4 pb-4 px-4 sm:px-2 w-full max-w-[900px]">
        <span>Streak: <strong className="text-pink-400 font-heading text-xs sm:text-base">{winStreak}</strong></span>
        <span>Best Streak: <strong className="text-amber-400 font-heading text-xs sm:text-base">{bestStreak}</strong></span>
        <span className="hidden md:inline">Drag / move mouse vertically to steer</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MODULE 4: NEON DINO JUMP COMPONENT (ASTRO RUN)
// =========================================================
function NeonDinoJump({ canvasHeight = 500 }: { canvasHeight?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('astro_jump_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.65;
    const isMobile = window.innerWidth < 640;
    const dinoScale = isMobile ? 1.4 : 1.0;
    const dino = {
      x: 80,
      y: canvas.height - 40 - 42 * dinoScale,
      width: 38 * dinoScale,
      height: 42 * dinoScale,
      vy: 0,
      jumpForce: isMobile ? -14.5 : -12.5,
      isJumping: false,
    };

    let legAngle = 0;
    let gameSpeed = 5.5;
    let obstacleTimer = 0;
    let scoreTimer = 0;
    let currentScore = 0;

    // Obstacles
    const obstacles: { x: number; y: number; width: number; height: number; speed: number }[] = [];

    // Stars background (parallax)
    const stars = Array.from({ length: 25 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - 100),
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1.5 + 0.5,
    }));

    // Particles array for jump and running dust trail
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number }[] = [];

    let animationFrameId: number;

    const spawnObstacle = () => {
      const height = (Math.floor(Math.random() * 25) + 30) * dinoScale; // 30 to 55
      const width = (Math.floor(Math.random() * 15) + 20) * dinoScale; // 20 to 35
      obstacles.push({
        x: canvas.width,
        y: canvas.height - 40 - height,
        width,
        height,
        speed: gameSpeed,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Starry Parallax Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        if (isPlaying && !isGameOver) {
          star.x -= star.speed;
          if (star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * (canvas.height - 100);
          }
        }
      });

      // 2. Draw Neon Ground Line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Ground grid lines moving left (to create depth/speed motion)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const groundOffset = isPlaying && !isGameOver ? (Date.now() / 15) % 40 : 0;
      for (let x = -groundOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - 40);
        ctx.lineTo(x - 20, canvas.height);
        ctx.stroke();
      }

      // 3. Update Dino Physics & Movement
      if (isPlaying && !isGameOver) {
        // Apply Gravity
        dino.vy += gravity;
        dino.y += dino.vy;

        // Ground check
        const groundY = canvas.height - 40 - dino.height;
        if (dino.y >= groundY) {
          dino.y = groundY;
          dino.vy = 0;
          dino.isJumping = false;
        }

        // Run leg animation angle
        if (!dino.isJumping) {
          legAngle += 0.25;
        }

        // Dust particles trail
        if (!dino.isJumping && Math.random() < 0.3) {
          particles.push({
            x: dino.x + 5,
            y: canvas.height - 42,
            vx: -Math.random() * 2 - 1,
            vy: -Math.random() * 1,
            radius: Math.random() * 2 + 1,
            color: 'rgba(34, 197, 94, 0.4)',
            alpha: 1
          });
        }
      }

      // 4. Draw Dino Leg & Body Sprites
      const dx = dino.x;
      const dy = dino.y;

      ctx.save();
      ctx.translate(dx, dy);
      ctx.scale(dinoScale, dinoScale);

      // Draw Dino (Stylized Neon T-Rex)
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e'; // Neon green
      ctx.lineWidth = 3 / dinoScale;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#22c55e';

      ctx.moveTo(12, 0); // Head top
      ctx.lineTo(35, 0); // Head front/snout
      ctx.lineTo(35, 14); // Snout bottom
      ctx.lineTo(26, 14); // Mouth inside
      ctx.lineTo(22, 18); // Neck
      ctx.lineTo(28, 32); // Chest
      ctx.lineTo(10, 32); // Belly
      ctx.lineTo(2, 22); // Tail base
      ctx.lineTo(0, 15); // Tail tip
      ctx.lineTo(8, 10); // Back
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Legs
      const legOffset = Math.sin(legAngle) * 7;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3 / dinoScale;
      
      // Leg 1
      ctx.beginPath();
      ctx.moveTo(14, 32);
      ctx.lineTo(dino.isJumping ? 10 : 14 - legOffset, 40);
      ctx.stroke();

      // Leg 2
      ctx.beginPath();
      ctx.moveTo(22, 32);
      ctx.lineTo(dino.isJumping ? 26 : 22 + legOffset, 40);
      ctx.stroke();

      // Small eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(26, 5, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 5. Update and Draw Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.4', p.alpha.toFixed(2));
        ctx.fill();
      });

      // 6. Update and Draw Obstacles
      if (isPlaying && !isGameOver) {
        obstacleTimer++;
        const spawnRate = Math.max(70, 120 - Math.floor(currentScore / 200));
        if (obstacleTimer >= spawnRate + Math.random() * 40) {
          spawnObstacle();
          obstacleTimer = 0;
        }

        gameSpeed += 0.0007;

        scoreTimer++;
        if (scoreTimer >= 8) {
          currentScore += 10;
          setScore(currentScore);
          scoreTimer = 0;
        }
      }

      obstacles.forEach((obs, idx) => {
        if (isPlaying && !isGameOver) {
          obs.x -= gameSpeed;
        }

        ctx.beginPath();
        ctx.strokeStyle = '#f43f5e'; // Rose/Red neon
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f43f5e';

        ctx.moveTo(obs.x, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
        ctx.fill();
        ctx.shadowBlur = 0;

        const hitboxPaddingX = 6;
        const hitboxPaddingY = 4;
        if (
          dino.x + hitboxPaddingX < obs.x + obs.width &&
          dino.x + dino.width - hitboxPaddingX > obs.x &&
          dino.y + hitboxPaddingY < obs.y + obs.height &&
          dino.y + dino.height - hitboxPaddingY > obs.y
        ) {
          setIsGameOver(true);
          setIsPlaying(false);

          if (currentScore > highScore) {
            setHighScore(currentScore);
            localStorage.setItem('astro_jump_highscore', currentScore.toString());
          }

          for (let i = 0; i < 20; i++) {
            particles.push({
              x: dino.x + dino.width / 2,
              y: dino.y + dino.height / 2,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              radius: Math.random() * 3 + 2,
              color: 'rgba(244, 63, 94, 0.8)',
              alpha: 1
            });
          }
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleJump = () => {
      if (!isPlaying || isGameOver) return;
      if (!dino.isJumping) {
        dino.vy = dino.jumpForce;
        dino.isJumping = true;

        for (let i = 0; i < 6; i++) {
          particles.push({
            x: dino.x + 10,
            y: canvas.height - 42,
            vx: (Math.random() - 0.7) * 3,
            vy: -Math.random() * 2,
            radius: Math.random() * 2.5 + 1.5,
            color: 'rgba(34, 197, 94, 0.5)',
            alpha: 1
          });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };

    const handleCanvasTouch = () => {
      handleJump();
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleCanvasTouch);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('click', handleCanvasTouch);
    };
  }, [isPlaying, resetTrigger, isGameOver, highScore, canvasHeight]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border-x-0 sm:border border-white/10 bg-[#0a0a0c] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl p-0 sm:p-1 w-full max-w-[900px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={canvasHeight}
          className="w-full h-auto bg-[#070709] rounded-none sm:rounded-xl block"
        />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-none sm:rounded-xl p-6">
            <button
              onClick={() => {
                setScore(0);
                setIsPlaying(true);
              }}
              className="bg-white text-black font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/90 shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Start Astro Run
            </button>
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-4">Press SPACE / Arrow Up or Tap Screen to Jump</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <h3 className="font-heading text-xl font-bold text-red-500 mb-1">System Crashed</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Score: {score} | Best: {highScore}</p>
            <button
              onClick={() => {
                setScore(0);
                setIsGameOver(false);
                setIsPlaying(true);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reboot System
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center font-mono text-[8.5px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-4 pb-4 px-4 sm:px-2 w-full max-w-[900px]">
        <span>Score: <strong className="text-green-400 font-heading text-xs sm:text-base">{score}</strong></span>
        <span>High Score: <strong className="text-amber-400 font-heading text-xs sm:text-base">{highScore}</strong></span>
        <span className="hidden md:inline">Tap / Press Space to jump</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MODULE 5: RETRO CYBER SNAKE COMPONENT
// =========================================================
function RetroCyberSnake({ canvasHeight = 500 }: { canvasHeight?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snake_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Sync high score whenever score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake_highscore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 640;
    const blockSize = isMobile ? 30 : 20;
    const gridWidth = Math.floor(900 / blockSize);
    const gridHeight = Math.floor(canvasHeight / blockSize);

    let snake = [
      { x: 10, y: 12 },
      { x: 9, y: 12 },
      { x: 8, y: 12 }
    ];

    let direction = 'RIGHT';
    let nextDirection = 'RIGHT';
    let food = { x: 25, y: 12 };
    
    let moveCooldown = 0;
    let baseInterval = 7;

    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number }[] = [];

    const spawnFood = () => {
      let newFood: { x: number; y: number } = { x: 0, y: 0 };
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * gridWidth),
          y: Math.floor(Math.random() * gridHeight)
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
          break;
        }
      }
      food = newFood;
    };

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += blockSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += blockSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      if (isPlaying && !isGameOver) {
        moveCooldown++;
        const speedInterval = Math.max(4, baseInterval - Math.floor(snake.length / 8));
        
        if (moveCooldown >= speedInterval) {
          direction = nextDirection;
          const head = { ...snake[0] };

          if (direction === 'UP') head.y -= 1;
          else if (direction === 'DOWN') head.y += 1;
          else if (direction === 'LEFT') head.x -= 1;
          else if (direction === 'RIGHT') head.x += 1;

          if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            setIsGameOver(true);
            setIsPlaying(false);
          }

          if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            setIsGameOver(true);
            setIsPlaying(false);
          }

          if (isPlaying && !isGameOver) {
            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
              setScore(s => s + 100);
              spawnFood();

              for (let i = 0; i < 15; i++) {
                particles.push({
                  x: food.x * blockSize + blockSize / 2,
                  y: food.y * blockSize + blockSize / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  radius: Math.random() * 2 + 1.5,
                  color: 'rgba(236, 72, 153, 0.8)',
                  alpha: 1
                });
              }
            } else {
              snake.pop();
            }
          }
          moveCooldown = 0;
        }
      }

      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ec4899';
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      const foodPulse = Math.sin(Date.now() / 150) * 2;
      ctx.roundRect(
        food.x * blockSize + 2 - foodPulse/2, 
        food.y * blockSize + 2 - foodPulse/2, 
        blockSize - 4 + foodPulse, 
        blockSize - 4 + foodPulse, 
        4
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(food.x * blockSize + 6, food.y * blockSize + 6, blockSize - 12, blockSize - 12, 2);
      ctx.fill();

      snake.forEach((segment, idx) => {
        const isHead = idx === 0;
        ctx.beginPath();
        
        ctx.shadowBlur = isHead ? 20 : 12;
        ctx.shadowColor = '#f59e0b';
        ctx.fillStyle = isHead ? '#ffffff' : '#f59e0b';

        const padding = isHead ? 1.5 : 2;
        ctx.roundRect(
          segment.x * blockSize + padding, 
          segment.y * blockSize + padding, 
          blockSize - padding * 2, 
          blockSize - padding * 2, 
          isHead ? 6 : 4
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isHead) {
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          if (direction === 'RIGHT' || direction === 'LEFT') {
            ctx.arc(segment.x * blockSize + (blockSize * 0.5), segment.y * blockSize + (blockSize * 0.3), 2, 0, Math.PI * 2);
            ctx.arc(segment.x * blockSize + (blockSize * 0.5), segment.y * blockSize + (blockSize * 0.7), 2, 0, Math.PI * 2);
          } else {
            ctx.arc(segment.x * blockSize + (blockSize * 0.3), segment.y * blockSize + (blockSize * 0.5), 2, 0, Math.PI * 2);
            ctx.arc(segment.x * blockSize + (blockSize * 0.7), segment.y * blockSize + (blockSize * 0.5), 2, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      });

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.8', p.alpha.toFixed(2));
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      
      const key = e.code;
      if ((key === 'ArrowUp' || key === 'KeyW') && direction !== 'DOWN') {
        e.preventDefault();
        nextDirection = 'UP';
      } else if ((key === 'ArrowDown' || key === 'KeyS') && direction !== 'UP') {
        e.preventDefault();
        nextDirection = 'DOWN';
      } else if ((key === 'ArrowLeft' || key === 'KeyA') && direction !== 'RIGHT') {
        e.preventDefault();
        nextDirection = 'LEFT';
      } else if ((key === 'ArrowRight' || key === 'KeyD') && direction !== 'LEFT') {
        e.preventDefault();
        nextDirection = 'RIGHT';
      }
    };

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPlaying || isGameOver) return;
      
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30 && direction !== 'LEFT') nextDirection = 'RIGHT';
        else if (diffX < -30 && direction !== 'RIGHT') nextDirection = 'LEFT';
      } else {
        if (diffY > 30 && direction !== 'UP') nextDirection = 'DOWN';
        else if (diffY < -30 && direction !== 'DOWN') nextDirection = 'UP';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPlaying, resetTrigger, isGameOver, canvasHeight]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border-x-0 sm:border border-white/10 bg-[#0a0a0c] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl p-0 sm:p-1 w-full max-w-[900px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={canvasHeight}
          className="w-full h-auto bg-[#070709] rounded-none sm:rounded-xl block"
        />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-none sm:rounded-xl p-6">
            <button
              onClick={() => {
                setScore(0);
                setIsPlaying(true);
              }}
              className="bg-white text-black font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/90 shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Boot Cyber Snake
            </button>
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-4">Use WASD / Arrow Keys or Swipe on Screen to Steer</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <h3 className="font-heading text-xl font-bold text-red-500 mb-1">Matrix Collapsed</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Total Bytes: {score} | Best: {highScore}</p>
            <button
              onClick={() => {
                setScore(0);
                setIsGameOver(false);
                setIsPlaying(true);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-link System
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center font-mono text-[8.5px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-4 pb-4 px-4 sm:px-2 w-full max-w-[900px]">
        <span>Score: <strong className="text-amber-500 font-heading text-xs sm:text-base">{score}</strong></span>
        <span>High Score: <strong className="text-amber-400 font-heading text-xs sm:text-base">{highScore}</strong></span>
        <span className="hidden md:inline">WASD / Swipe to navigate</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MODULE 6: NEON FRUIT SLASHER COMPONENT (CYBER SLICE)
// =========================================================
function NeonFruitSlasher({ canvasHeight = 500 }: { canvasHeight?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('slasher_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Sync high score whenever score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('slasher_highscore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.22;
    const isMobile = window.innerWidth < 640;
    const radiusScale = isMobile ? 1.4 : 1.0;
    
    interface SlasherItem {
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      label: string;
      isBomb: boolean;
      sliced: boolean;
      halves?: {
        x1: number; y1: number; vx1: number; vy1: number;
        x2: number; y2: number; vx2: number; vy2: number;
        angle: number; rotSpeed: number;
      };
    }

    let items: SlasherItem[] = [];
    let itemIdCounter = 0;
    let spawnTimer = 0;
    let scoreVal = 0;
    let livesVal = 3;

    let trail: { x: number; y: number; time: number }[] = [];
    let isSlicing = false;

    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number }[] = [];

    const fruitsConfig = [
      { color: '#ef4444', label: 'APPLE' },
      { color: '#22c55e', label: 'MELON' },
      { color: '#f59e0b', label: 'ORANGE' },
      { color: '#3b82f6', label: 'BERRY' },
      { color: '#eab308', label: 'LEMON' }
    ];

    const spawnItem = (isBombChance = false) => {
      itemIdCounter++;
      const radius = (isBombChance ? 24 : Math.random() * 6 + 22) * radiusScale;
      const x = Math.random() * (canvas.width - 200) + 100;
      const y = canvas.height + radius;
      
      const targetX = canvas.width / 2;
      const xDiff = targetX - x;
      const vx = xDiff * 0.01 + (Math.random() - 0.5) * 1.5;
      const targetHeight = canvasHeight - 80;
      const baseVy = Math.sqrt(2 * gravity * targetHeight);
      const vy = -(baseVy * (0.85 + Math.random() * 0.3));

      if (isBombChance) {
        items.push({
          id: itemIdCounter,
          x, y, vx, vy, radius,
          color: '#ef4444',
          label: 'BOMB',
          isBomb: true,
          sliced: false
        });
      } else {
        const conf = fruitsConfig[Math.floor(Math.random() * fruitsConfig.length)];
        items.push({
          id: itemIdCounter,
          x, y, vx, vy, radius,
          color: conf.color,
          label: conf.label,
          isBomb: false,
          sliced: false
        });
      }
    };

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255,255,255,0.01)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      if (isPlaying && !isGameOver) {
        spawnTimer++;
        const spawnRate = Math.max(45, 80 - Math.floor(scoreVal / 500));
        if (spawnTimer >= spawnRate) {
          const count = Math.random() > 0.75 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            const isBomb = Math.random() < 0.22;
            spawnItem(isBomb);
          }
          spawnTimer = 0;
        }
      }

      items.forEach((item, index) => {
        if (isPlaying && !isGameOver) {
          item.vy += gravity;
          item.x += item.vx;
          item.y += item.vy;

          if (item.sliced && item.halves) {
            item.halves.x1 += item.halves.vx1;
            item.halves.y1 += item.halves.vy1 + gravity;
            item.halves.x2 += item.halves.vx2;
            item.halves.y2 += item.halves.vy2 + gravity;
            item.halves.angle += item.halves.rotSpeed;
          }
        }

        if (!item.sliced) {
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = item.color;
          ctx.strokeStyle = item.color;

          if (item.isBomb) {
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
              ctx.beginPath();
              ctx.moveTo(item.x + Math.cos(angle) * item.radius, item.y + Math.sin(angle) * item.radius);
              ctx.lineTo(item.x + Math.cos(angle) * (item.radius + 6 * radiusScale), item.y + Math.sin(angle) * (item.radius + 6 * radiusScale));
              ctx.stroke();
            }

            ctx.fillStyle = (Date.now() % 250 > 125) ? '#ffffff' : '#ef4444';
            ctx.beginPath();
            ctx.arc(item.x, item.y, 7 * radiusScale, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = `${item.color}22`;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius - 6 * radiusScale, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x, item.y, 4 * radiusScale, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = `bold ${Math.floor(8 * radiusScale)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.label, item.x, item.y);
          }
        } else if (item.halves) {
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = item.color;
          ctx.strokeStyle = item.color;
          ctx.fillStyle = `${item.color}22`;
          ctx.lineWidth = 2.5;

          ctx.translate(item.halves.x1, item.halves.y1);
          ctx.rotate(item.halves.angle);
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, Math.PI, 0);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(-item.radius, 0);
          ctx.lineTo(item.radius, 0);
          ctx.stroke();

          ctx.restore();

          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = item.color;
          ctx.strokeStyle = item.color;
          ctx.fillStyle = `${item.color}22`;
          ctx.lineWidth = 2.5;

          ctx.translate(item.halves.x2, item.halves.y2);
          ctx.rotate(item.halves.angle);
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(-item.radius, 0);
          ctx.lineTo(item.radius, 0);
          ctx.stroke();

          ctx.restore();
        }

        if (item.y - item.radius > canvas.height + 40) {
          if (!item.isBomb && !item.sliced && isPlaying && !isGameOver) {
            livesVal--;
            setLives(livesVal);
            if (livesVal <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
            }
          }
          items.splice(index, 1);
        }
      });

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.8', p.alpha.toFixed(2));
        ctx.fill();
      });

      if (trail.length > 1) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#3b82f6';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      const now = Date.now();
      trail = trail.filter(p => now - p.time < 120);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const checkSlice = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      items.forEach(item => {
        if (item.sliced) return;

        const minX = Math.min(p1.x, p2.x) - 10;
        const maxX = Math.max(p1.x, p2.x) + 10;
        const minY = Math.min(p1.y, p2.y) - 10;
        const maxY = Math.max(p1.y, p2.y) + 10;
        if (item.x < minX || item.x > maxX || item.y < minY || item.y > maxY) {
          return;
        }

        const A = item.x - p1.x;
        const B = item.y - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;
        if (param < 0) {
          xx = p1.x;
          yy = p1.y;
        } else if (param > 1) {
          xx = p2.x;
          yy = p2.y;
        } else {
          xx = p1.x + param * C;
          yy = p1.y + param * D;
        }

        const dx = item.x - xx;
        const dy = item.y - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < item.radius + 4) {
          item.sliced = true;

          if (item.isBomb) {
            setIsGameOver(true);
            setIsPlaying(false);

            for (let i = 0; i < 35; i++) {
              particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                radius: Math.random() * 4 + 2,
                color: 'rgba(239, 68, 68, 0.8)',
                alpha: 1
              });
            }
          } else {
            scoreVal += 100;
            setScore(scoreVal);

            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const sliceNormX = -Math.sin(angle);
            const sliceNormY = Math.cos(angle);
            const ejectForce = Math.random() * 2 + 2;

            item.halves = {
              x1: item.x, y1: item.y,
              vx1: item.vx + sliceNormX * ejectForce,
              vy1: item.vy + sliceNormY * ejectForce,
              x2: item.x, y2: item.y,
              vx2: item.vx - sliceNormX * ejectForce,
              vy2: item.vy - sliceNormY * ejectForce,
              angle: 0,
              rotSpeed: (Math.random() - 0.5) * 0.15
            };

            for (let i = 0; i < 15; i++) {
              particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7 - 2,
                radius: Math.random() * 3 + 1,
                color: `${item.color}cc`,
                alpha: 1
              });
            }
          }
        }
      });
    };

    const handlePointerStart = (x: number, y: number) => {
      isSlicing = true;
      trail = [{ x, y, time: Date.now() }];
    };

    const handlePointerMove = (x: number, y: number) => {
      if (!isSlicing) return;
      const newPoint = { x, y, time: Date.now() };
      trail.push(newPoint);
      if (trail.length > 1) {
        checkSlice(trail[trail.length - 2], newPoint);
      }
    };

    const handlePointerEnd = () => {
      isSlicing = false;
      trail = [];
    };

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      handlePointerStart((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      handlePointerMove((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      handlePointerStart((e.touches[0].clientX - rect.left) * scaleX, (e.touches[0].clientY - rect.top) * scaleY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      handlePointerMove((e.touches[0].clientX - rect.left) * scaleX, (e.touches[0].clientY - rect.top) * scaleY);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', handlePointerEnd);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', handlePointerEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handlePointerEnd);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', handlePointerEnd);
    };
  }, [isPlaying, resetTrigger, isGameOver, canvasHeight]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border-x-0 sm:border border-white/10 bg-[#0a0a0c] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl p-0 sm:p-1 w-full max-w-[900px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={canvasHeight}
          className="w-full h-auto bg-[#070709] rounded-none sm:rounded-xl block cursor-crosshair"
        />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-none sm:rounded-xl p-6">
            <button
              onClick={() => {
                setScore(0);
                setLives(3);
                setIsPlaying(true);
              }}
              className="bg-white text-black font-semibold font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/90 shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Boot Cyber Slice
            </button>
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-4">Click and Drag or Swipe to Slash fruits. Avoid Spiky Red Bombs!</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-none sm:rounded-xl">
            <h3 className="font-heading text-xl font-bold text-red-500 mb-1">Blade Terminated</h3>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-5">Data Slashed: {score} | Best: {highScore}</p>
            <button
              onClick={() => {
                setScore(0);
                setLives(3);
                setIsGameOver(false);
                setIsPlaying(true);
                setResetTrigger(p => p + 1);
              }}
              className="font-mono text-[10px] uppercase tracking-widest border border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reload Blade
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center font-mono text-[8.5px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-4 pb-4 px-4 sm:px-2 w-full max-w-[900px]">
        <span>Score: <strong className="text-red-400 font-heading text-xs sm:text-base">{score}</strong></span>
        <span>Lives: <strong className="text-red-500 font-heading text-xs sm:text-base">{'❤️'.repeat(Math.max(0, lives)) || '☠️'}</strong></span>
        <span>High Score: <strong className="text-amber-400 font-heading text-xs sm:text-base">{highScore}</strong></span>
        <span className="hidden md:inline">Drag mouse / finger to slice</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MAIN PAGE COMPONENT
// =========================================================
export default function GamesPage() {
  const [activeGameId, setActiveGameId] = useState<string>('breaker');
  const activeGame = PREMIUM_GAMES.find(g => g.id === activeGameId) || PREMIUM_GAMES[0];
  const [canvasHeight, setCanvasHeight] = useState(500);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width < 640) {
          // Mobile layout
          // Subtract estimated non-canvas elements' vertical footprint (header, padding, buttons, footer, etc.)
          const availableHeight = height - 380;
          const cabinetWidth = width - 32; // 16px padding on left & right
          
          let calculatedHeight = Math.floor((availableHeight / cabinetWidth) * 900);
          // Clamp to reasonable ranges to preserve gameplay physics & visuals
          if (calculatedHeight < 650) calculatedHeight = 650;
          if (calculatedHeight > 1050) calculatedHeight = 1050;
          
          setCanvasHeight(calculatedHeight);
        } else {
          setCanvasHeight(500);
        }
      };
      
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white relative overflow-x-hidden font-body selection:bg-white selection:text-black flex flex-col">
      <CanvasParticles accentColor={activeGame.accent} />

      {/* Dynamic Ambient Background Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000 ease-in-out opacity-[0.08]"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeGame.accent} 0%, transparent 60%)`,
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#0a0a0c]/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/?mode=portfolio"
              className="group flex items-center gap-1.5 sm:gap-2 font-heading text-[10px] uppercase tracking-widest text-white/60 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 bg-white/[0.02]"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-white/80" />
              <span className="hidden xs:inline">Back to Portfolio</span>
              <span className="xs:hidden">Back</span>
            </a>
            <div className="hidden xs:block w-px h-4 bg-white/10" />
            <span className="font-heading text-[10px] sm:text-xs md:text-sm font-bold text-white tracking-[0.15em] sm:tracking-[0.25em] uppercase select-none">
              <span className="hidden sm:inline">HAMMAD.DESIGN <span className="text-white/30 font-normal">/</span> </span>
              <span className="font-extrabold tracking-[0.2em] transition-colors duration-500" style={{ color: activeGame.accent }}>ARCADE</span>
            </span>
          </div>

          <a
            href={CONTACT_DATA.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black font-semibold font-heading text-[8.5px] sm:text-[10px] uppercase tracking-widest rounded-full px-3.5 sm:px-5.5 py-1.5 sm:py-2 hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-200 select-none"
          >
            Resume
          </a>
        </div>
      </header>

      {/* Main Workspace (Stacked Vertical Layout for Larger Canvas Area) */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-4 relative z-10 flex flex-col items-center gap-6">
        
        {/* Game deck selector: Horizontal list at the top */}
        <div className="w-full max-w-[960px] select-none">
          <div className="flex overflow-x-auto md:grid md:grid-cols-6 gap-3 pb-3 md:pb-0 w-full select-none scrollbar-none snap-x scroll-smooth">
            {PREMIUM_GAMES.map((game) => {
              const IconComponent = game.icon;
              const isSelected = activeGameId === game.id;
              
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveGameId(game.id)}
                  className="flex-shrink-0 w-[110px] sm:w-[130px] md:w-auto snap-center text-center p-3 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 md:gap-3.5 group cursor-pointer relative overflow-hidden"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.04)' : '#121217',
                    borderColor: isSelected ? game.accent : 'rgba(255,255,255,0.05)',
                    boxShadow: isSelected ? `0 0 25px ${game.accent}15` : 'none',
                  }}
                >
                  {/* Subtle top indicator bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
                    style={{
                      backgroundColor: isSelected ? game.accent : 'transparent',
                    }}
                  />

                  <div 
                    className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl border flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isSelected ? `${game.accent}20` : 'rgba(255,255,255,0.02)',
                      borderColor: isSelected ? `${game.accent}40` : 'rgba(255,255,255,0.1)',
                      color: isSelected ? game.accent : 'rgba(255,255,255,0.4)',
                      boxShadow: isSelected ? `0 0 15px ${game.accent}20` : 'none',
                    }}
                  >
                    <IconComponent className="w-4 h-4 md:w-5.5 md:h-5.5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <h4 
                      className="font-heading text-[9.5px] md:text-[11px] font-bold tracking-widest uppercase transition-colors duration-200"
                      style={{ color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)' }}
                    >
                      {game.title}
                    </h4>
                    <p 
                      className="text-[7.5px] md:text-[9px] font-mono transition-colors duration-200"
                      style={{ color: isSelected ? game.accent : 'rgba(255,255,255,0.3)' }}
                    >
                      {isSelected ? 'ACTIVE' : 'PLAY'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* High Contrast Arcade Monitor cabinet (Fills remaining width, larger dimensions) */}
        <div 
          className="w-full md:max-w-[960px] p-0 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border bg-[#121217] relative flex flex-col shadow-2xl transition-all duration-500"
          style={{
            borderColor: `${activeGame.accent}25`,
            boxShadow: `0 10px 40px -10px rgba(0,0,0,0.7), 0 0 30px ${activeGame.accent}08`,
          }}
        >
          
          {/* Cabinet view header status */}
          <div className="flex items-center justify-between px-4 pt-4 sm:px-0 sm:pt-0 pb-4 border-b border-white/10 mb-4 sm:mb-6 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Tv 
                className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-500 shrink-0" 
                style={{ color: activeGame.accent }}
              />
              <div>
                <h2 className="font-heading text-sm sm:text-lg md:text-xl font-bold text-white tracking-wide">
                  {activeGameId === 'breaker' && 'Classic Brick Breaker'}
                  {activeGameId === 'multiball' && 'Multi-Ball Chaos'}
                  {activeGameId === 'pong' && 'Astro Pong (vs AI)'}
                  {activeGameId === 'jump' && 'Neon Astro Run'}
                  {activeGameId === 'snake' && 'Retro Cyber Snake'}
                  {activeGameId === 'slice' && 'Cyber Slasher'}
                </h2>
              </div>
            </div>
            
            <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/45 flex items-center gap-1 shrink-0">
              <span 
                className="w-1.5 h-1.5 rounded-full animate-pulse mr-1 transition-colors duration-500" 
                style={{ backgroundColor: activeGame.accent }}
              />
              Cabinet Ready
            </div>
          </div>

          {/* Large Game Workspace */}
          <div className="flex-1 flex flex-col justify-center items-center w-full">
            {activeGameId === 'breaker' && <NeonBrickBreaker canvasHeight={canvasHeight} />}
            {activeGameId === 'multiball' && <MultiBallChaos canvasHeight={canvasHeight} />}
            {activeGameId === 'pong' && <AstroPong canvasHeight={canvasHeight} />}
            {activeGameId === 'jump' && <NeonDinoJump canvasHeight={canvasHeight} />}
            {activeGameId === 'snake' && <RetroCyberSnake canvasHeight={canvasHeight} />}
            {activeGameId === 'slice' && <NeonFruitSlasher canvasHeight={canvasHeight} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#050507] py-6 mt-auto relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[9px] text-white/30 uppercase tracking-widest select-none">
          <span>© {new Date().getFullYear()} Hammad Zia · All rights reserved</span>
          <a href="/?mode=portfolio" className="hover:text-white transition-colors duration-200">
            Back to Home
          </a>
        </div>
      </footer>
    </div>
  );
}
