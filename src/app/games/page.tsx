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
} from "lucide-react";
import { CONTACT_DATA } from "@/components/ArtboardContent";

// --- Background Particles ---
const CanvasParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const colors = [
      'rgba(139, 92, 246, 0.4)', // Violet
      'rgba(6, 182, 212, 0.4)',  // Cyan
      'rgba(236, 72, 153, 0.35)', // Pink
      'rgba(245, 158, 11, 0.3)'   // Amber
    ];
    
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      glow: Math.random() * 12 + 6,
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

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.color;
        ctx.fill();
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
  }
];

// =========================================================
// 🕹️ MODULE 1: NEON BRICK BREAKER COMPONENT
// =========================================================
function NeonBrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paddle = { x: canvas.width / 2 - 50, width: 100, height: 12 };
    const ball = { x: canvas.width / 2, y: canvas.height - 35, vx: 3, vy: -5, radius: 8 };
    
    const rowCount = 4;
    const colCount = 8;
    const brickWidth = 72;
    const brickHeight = 18;
    const brickPadding = 10;
    const offsetTop = 50;
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
  }, [isPlaying, resetTrigger, isGameOver, isGameWon]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border border-white/10 bg-[#0a0a0c] rounded-2xl overflow-hidden shadow-2xl p-1 w-full max-w-[700px]">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-auto bg-[#070709] rounded-xl block"
        />
        
        {!isPlaying && !isGameOver && !isGameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl p-6">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl">
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

      <div className="flex justify-between items-center font-mono text-[10px] text-white/50 uppercase tracking-widest mt-4 px-2 w-full max-w-[700px]">
        <span>Score: <strong className="text-cyan-400 font-heading text-base">{score}</strong></span>
        <span>Drag / move mouse to play</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MODULE 2: MULTI-BALL CHAOS COMPONENT
// =========================================================
function MultiBallChaos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paddle = { x: canvas.width / 2 - 50, width: 100, height: 12 };
    
    // 3 Bouncing balls
    const balls = [
      { x: canvas.width / 2, y: canvas.height - 35, vx: 3, vy: -5, radius: 8, active: true },
      { x: canvas.width / 2 - 30, y: canvas.height - 45, vx: -2.5, vy: -5.5, radius: 8, active: true },
      { x: canvas.width / 2 + 30, y: canvas.height - 45, vx: 4, vy: -4.5, radius: 8, active: true },
    ];
    
    const rowCount = 4;
    const colCount = 8;
    const brickWidth = 72;
    const brickHeight = 18;
    const brickPadding = 10;
    const offsetTop = 50;
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
  }, [isPlaying, resetTrigger, isGameOver, isGameWon]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border border-white/10 bg-[#0a0a0c] rounded-2xl overflow-hidden shadow-2xl p-1 w-full max-w-[700px]">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-auto bg-[#070709] rounded-xl block"
        />
        
        {!isPlaying && !isGameOver && !isGameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl p-6">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl">
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

      <div className="flex justify-between items-center font-mono text-[10px] text-white/50 uppercase tracking-widest mt-4 px-2 w-full max-w-[700px]">
        <span>Score: <strong className="text-violet-400 font-heading text-base">{score}</strong></span>
        <span>Drag / move mouse to play</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MODULE 3: ASTRO PONG COMPONENT (VS AI)
// =========================================================
function AstroPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pWidth = 12;
    const pHeight = 80;
    const player = { x: 20, y: canvas.height / 2 - pHeight / 2 };
    const ai = { x: canvas.width - 20 - pWidth, y: canvas.height / 2 - pHeight / 2 };
    const ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 4, vy: 2, radius: 8 };

    let animationFrameId: number;

    const resetBall = (dir: number) => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.vx = dir * 4;
      ball.vy = (Math.random() - 0.5) * 6;
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
        const aiSpeed = 3.6; // capped speed to make game beatable
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
  }, [isPlaying, resetTrigger, isGameOver]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative border border-white/10 bg-[#0a0a0c] rounded-2xl overflow-hidden shadow-2xl p-1 w-full max-w-[700px]">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-auto bg-[#070709] rounded-xl block"
        />

        {/* Score Ticker on Screen Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-10 select-none pointer-events-none font-heading text-4xl font-extrabold text-white/30 tracking-widest">
          <span className={playerScore > aiScore ? 'text-white/60' : ''}>{playerScore}</span>
          <span>:</span>
          <span className={aiScore > playerScore ? 'text-pink-400' : ''}>{aiScore}</span>
        </div>
        
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl p-6">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl">
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

      <div className="flex justify-between items-center font-mono text-[10px] text-white/50 uppercase tracking-widest mt-4 px-2 w-full max-w-[700px]">
        <span>Player (Left) vs AI (Right)</span>
        <span>Drag / move mouse vertically to steer</span>
      </div>
    </div>
  );
}

// =========================================================
// 🕹️ MAIN PAGE COMPONENT
// =========================================================
export default function GamesPage() {
  const [activeGameId, setActiveGameId] = useState<string>('breaker');

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white relative overflow-x-hidden font-body selection:bg-white selection:text-black flex flex-col">
      <CanvasParticles />

      {/* Navigation Header */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#0a0a0c]/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="/?mode=portfolio"
              className="group flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-white/60 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-4 py-2 transition-all duration-200 bg-white/[0.02]"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-white/80" />
              Back to Portfolio
            </a>
            <div className="w-px h-4 bg-white/10" />
            <span className="font-heading text-xs font-semibold text-white tracking-[0.2em] uppercase select-none">
              HAMMAD.DESIGN <span className="text-white/30">/</span> <span className="text-violet-400 font-semibold tracking-widest">ARCADE</span>
            </span>
          </div>

          <a
            href={CONTACT_DATA.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black font-semibold font-heading text-[10px] uppercase tracking-widest rounded-full px-5.5 py-2 hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-200 select-none"
          >
            Resume
          </a>
        </div>
      </header>

      {/* Main Workspace (Stacked Vertical Layout for Larger Canvas Area) */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-3 md:px-6 py-4 relative z-10 flex flex-col items-center gap-6">
        
        {/* Game deck selector: Horizontal list at the top */}
        <div className="w-full max-w-[760px] select-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PREMIUM_GAMES.map((game) => {
              const IconComponent = game.icon;
              const isSelected = activeGameId === game.id;
              
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveGameId(game.id)}
                  className={`text-left p-4.5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                    isSelected
                      ? 'bg-white/[0.04] border-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)] scale-[1.01]'
                      : 'bg-[#121217] border-white/5 hover:border-white/15 text-white/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      isSelected ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' : 'bg-white/[0.02] border-white/10 text-white/40'
                    }`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-heading text-[10px] font-semibold tracking-widest uppercase">{game.title}</h4>
                      <p className="text-[9px] font-mono text-white/35 mt-0.5">Click to play</p>
                    </div>
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/40 border border-white/15 rounded-full px-2 py-0.5">
                    Launch
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* High Contrast Arcade Monitor cabinet (Fills remaining width, larger dimensions) */}
        <div className="w-full max-w-[760px] p-3 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-[#121217] relative flex flex-col justify-between shadow-2xl">
          
          {/* Cabinet view header status */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-violet-400" />
              <div>
                <h2 className="font-heading text-base font-semibold text-white">
                  {activeGameId === 'breaker' && 'Classic Brick Breaker'}
                  {activeGameId === 'multiball' && 'Multi-Ball Chaos'}
                  {activeGameId === 'pong' && 'Astro Pong (vs AI)'}
                </h2>
              </div>
            </div>
            
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/45 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
              Cabinet Ready
            </div>
          </div>

          {/* Large Game Workspace */}
          <div className="flex-1 flex flex-col justify-center items-center w-full">
            {activeGameId === 'breaker' && <NeonBrickBreaker />}
            {activeGameId === 'multiball' && <MultiBallChaos />}
            {activeGameId === 'pong' && <AstroPong />}
          </div>

          {/* Cabinet view footer info */}
          <div className="pt-4 border-t border-white/10 mt-6 text-center text-white/35 font-mono text-[8px] uppercase tracking-[0.2em] shrink-0">
            Hammad Zia Playground Laboratory Output
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
