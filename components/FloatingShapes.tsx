"use client";

import { motion } from "framer-motion";

export default function FloatingShapes() {
  const shapes = [
    // Circles
    { type: 'circle', color: 'bg-cyan-400/40', size: 'w-32 h-32', initX: '10vw', initY: '20vh', animX: [0, 100, -50, 0], animY: [0, -100, 50, 0], duration: 15 },
    { type: 'circle', color: 'bg-blue-500/30', size: 'w-48 h-48', initX: '80vw', initY: '60vh', animX: [0, -150, 100, 0], animY: [0, 100, -100, 0], duration: 20 },
    // Squares
    { type: 'square', color: 'bg-purple-400/30', size: 'w-24 h-24', initX: '70vw', initY: '10vh', animX: [0, -80, 40, 0], animY: [0, 80, 20, 0], duration: 18, rotate: [0, 90, 180, 360] },
    { type: 'square', color: 'bg-teal-400/40', size: 'w-40 h-40', initX: '20vw', initY: '70vh', animX: [0, 120, -60, 0], animY: [0, -60, 80, 0], duration: 22, rotate: [0, -90, -180, -360] },
    // Triangles
    { type: 'triangle', color: 'bg-indigo-400/30', size: 'w-36 h-36', initX: '40vw', initY: '40vh', animX: [0, 90, -90, 0], animY: [0, -120, 60, 0], duration: 17, rotate: [0, 120, 240, 360] },
    { type: 'triangle', color: 'bg-sky-400/40', size: 'w-28 h-28', initX: '50vw', initY: '80vh', animX: [0, -100, 80, 0], animY: [0, 100, -50, 0], duration: 19, rotate: [0, -120, -240, -360] },
    // More elements
    { type: 'circle', color: 'bg-emerald-400/30', size: 'w-16 h-16', initX: '30vw', initY: '10vh', animX: [0, -50, 30, 0], animY: [0, 50, -20, 0], duration: 12 },
    { type: 'square', color: 'bg-pink-400/20', size: 'w-20 h-20', initX: '15vw', initY: '85vh', animX: [0, 80, -40, 0], animY: [0, -40, 60, 0], duration: 16, rotate: [0, 180, 360] },
    { type: 'triangle', color: 'bg-fuchsia-400/30', size: 'w-24 h-24', initX: '85vw', initY: '25vh', animX: [0, -60, 90, 0], animY: [0, 80, -40, 0], duration: 14, rotate: [0, -180, -360] },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background soft glow orbes (existing) */}
      <motion.div 
        animate={{ x: [0, 100, -100, 0], y: [0, -100, 50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-300/30 rounded-full blur-[120px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ x: [0, -150, 100, 0], y: [0, 100, -100, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-300/20 rounded-full blur-[120px] mix-blend-multiply" 
      />

      {/* Floating geometric shapes */}
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          animate={{
            x: s.animX,
            y: s.animY,
            rotate: s.rotate || [0, 0],
          }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute ${s.size} ${s.color} shadow-2xl blur-[1px]`}
          style={{
             left: s.initX, 
             top: s.initY,
             borderRadius: s.type === 'circle' ? '50%' : s.type === 'square' ? '16px' : '0',
             clipPath: s.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
          }}
        />
      ))}
    </div>
  );
}
