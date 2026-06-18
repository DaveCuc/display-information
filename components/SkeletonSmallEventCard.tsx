"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import GlassSurface from "./GlassSurface";

interface SkeletonSmallEventCardProps {
  index?: number;
}

export default function SkeletonSmallEventCard({ index = 0 }: SkeletonSmallEventCardProps) {
  const { theme, themeName } = useTheme();

  const isBus = themeName === "BUS";
  const isMetro = themeName === "METRO";
  const isModern = themeName === "MODERN";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={`relative overflow-hidden ${isModern ? "" : theme.cardBg + " " + theme.border} ${isBus || isMetro ? "rounded-none" : "rounded-xl"} flex shadow-md animate-pulse`}
    >
      {/* Decorative subtle gradient background solo en MODERN */}
      {isModern && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <GlassSurface 
             width="100%" 
             height="100%" 
             borderRadius={12} 
             brightness={95} 
             opacity={0.5} 
             blur={18} 
             displace={5}
             backgroundOpacity={0.35}
             className="border border-white/60 shadow-lg"
           />
        </div>
      )}

      {/* BUS Sidebar */}
      {isBus && (
        <div className={`${theme.sidebarColor} w-24 md:w-32 p-4 flex flex-col justify-center items-center shrink-0`}>
          <div className="w-16 h-8 bg-white/20 rounded"></div>
        </div>
      )}

      {/* Contenido */}
      <div className={`p-6 md:p-8 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 ${isBus || isMetro ? "ml-6 md:ml-10" : ""}`}>
        <div className="flex-1 min-w-0 pr-4 w-full">
          <div className={`w-full h-10 md:h-[48px] rounded-xl ${theme.textPrimary} opacity-20 bg-current`}></div>
          
          {/* Calendar Badge Skeleton */}
          <div className={`mt-6 w-32 h-6 rounded ${theme.textSecondary} opacity-20 bg-current`}></div>
        </div>
        
        {/* Tiempo */}
        {(!isBus && !isMetro) && (
          <div className="mt-6 md:mt-0 flex-shrink-0 text-right ml-0 md:ml-6 flex items-center justify-end w-full md:w-auto h-[48px] overflow-hidden">
             <div className={`w-40 md:w-[200px] h-10 md:h-[48px] rounded-xl ${theme.textAccent} opacity-20 bg-current`}></div>
          </div>
        )}
      </div>

      {/* METRO Sidebar */}
      {isMetro && (
        <div className={`${theme.sidebarColor} w-24 md:w-32 p-4 flex flex-col justify-center items-center shrink-0`}>
           <div className="w-10 h-3 bg-white/20 rounded mb-2"></div>
           <div className="w-8 h-8 bg-white/20 rounded"></div>
        </div>
      )}
    </motion.div>
  );
}
