import { motion } from 'motion/react';
import { Bomb, Star, Zap, Circle, Triangle, Square } from 'lucide-react';

export const BackgroundDecor = () => {
  const icons = [
    <Bomb className="w-12 h-12" />,
    <Star className="w-10 h-10" />,
    <Zap className="w-8 h-8" />,
    <Circle className="w-14 h-14" />,
    <Triangle className="w-12 h-12" />,
    <Square className="w-10 h-10" />,
  ];

  const colors = [
    'text-orange-200', 'text-yellow-200', 'text-blue-200', 
    'text-red-200', 'text-green-200', 'text-purple-200',
    'text-orange-100', 'text-zinc-100'
  ];

  // Generate 40 random elements distributed towards the edges
  const elements = Array.from({ length: 40 }).map((_, i) => {
    // Attempt to avoid the center (30%-70% area)
    const side = Math.random();
    let x, y;
    if (side < 0.25) { // Left strip
      x = Math.random() * 25;
      y = Math.random() * 100;
    } else if (side < 0.5) { // Right strip
      x = 75 + Math.random() * 25;
      y = Math.random() * 100;
    } else if (side < 0.75) { // Top strip
      x = Math.random() * 100;
      y = Math.random() * 25;
    } else { // Bottom strip
      x = Math.random() * 100;
      y = 75 + Math.random() * 25;
    }

    return {
      icon: icons[i % icons.length],
      color: colors[i % colors.length],
      x: `${x}%`,
      y: `${y}%`,
      rotate: Math.random() * 360,
      duration: 8 + Math.random() * 15,
      delay: Math.random() * 5
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 0.5, 
            scale: [0.7, 1, 0.7],
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [el.rotate, el.rotate + 20, el.rotate],
          }}
          transition={{ 
            duration: el.duration, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: el.delay
          }}
          className={`absolute ${el.color}`}
          style={{ left: el.x, top: el.y }}
        >
          {el.icon}
        </motion.div>
      ))}

      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-orange-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px]" />
    </div>
  );
};
