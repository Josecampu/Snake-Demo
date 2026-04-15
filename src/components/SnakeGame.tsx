import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isGameOver: boolean;
  setIsGameOver: (isGameOver: boolean) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, isGameOver, setIsGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  
  const snakeRef = useRef<Point[]>(INITIAL_SNAKE);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const scoreRef = useRef<number>(0);
  const speedRef = useRef<number>(150);
  const lastUpdateTimeRef = useRef<number>(0);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = INITIAL_SNAKE;
    setSnake(INITIAL_SNAKE);
    
    directionRef.current = INITIAL_DIRECTION;
    
    const newFood = generateFood(INITIAL_SNAKE);
    foodRef.current = newFood;
    setFood(newFood);
    
    scoreRef.current = 0;
    setScore(0);
    onScoreChange(0);
    
    speedRef.current = 150;
    setSpeed(150);
    
    setIsGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const update = useCallback((time: number) => {
    if (isGameOver) return;

    if (time - lastUpdateTimeRef.current < speedRef.current) {
      requestAnimationFrame(update);
      return;
    }
    lastUpdateTimeRef.current = time;

    const currentSnake = snakeRef.current;
    const head = currentSnake[0];
    const newHead = {
      x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
    };

    // Check collision with self
    if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead, ...currentSnake];

    // Check collision with food
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);
      onScoreChange(newScore);
      
      const newFood = generateFood(newSnake);
      foodRef.current = newFood;
      setFood(newFood);
      
      const newSpeed = Math.max(50, speedRef.current - 2);
      speedRef.current = newSpeed;
      setSpeed(newSpeed);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    setSnake(newSnake);

    requestAnimationFrame(update);
  }, [isGameOver, onScoreChange, setIsGameOver, generateFood]);

  useEffect(() => {
    const animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#00ffff22';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#00ffffaa';
      ctx.shadowBlur = isHead ? 25 : 10;
      ctx.shadowColor = '#00ffff';
      
      const padding = isHead ? 1 : 2;
      const x = segment.x * cellSize + padding;
      const y = segment.y * cellSize + padding;
      const size = cellSize - padding * 2;
      
      ctx.fillRect(x, y, size, size);
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full font-pixel">
      <div className="relative w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-transparent cursor-none max-w-full max-h-full border-2 border-[#00ffff]/20"
        />
        
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-10 border-4 border-[#ff00ff]"
            >
              <h2 className="text-6xl font-black text-[#ff00ff] mb-2 tracking-tighter uppercase italic glitch-text" data-text="CRITICAL_FAILURE">
                CRITICAL_FAILURE
              </h2>
              <p className="text-[#00ffff] text-2xl mb-8 tracking-widest">SCORE_LOGGED: {score}</p>
              <button
                onClick={resetGame}
                className="px-12 py-4 bg-[#00ffff] text-black font-bold uppercase tracking-[0.3em] hover:bg-[#ff00ff] hover:text-white transition-all duration-200 border-b-4 border-r-4 border-black active:border-0 active:translate-y-1 active:translate-x-1"
              >
                REBOOT_SYSTEM
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


