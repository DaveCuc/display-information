"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import GlassSurface from "./GlassSurface";

export default function SkeletonMainEventCard() {
  const { theme, themeName } = useTheme();
  
  const isBus = themeName === "BUS";
  const isMetro = themeName === "METRO";
  const isModern = themeName === "MODERN";
  const isAirplane = themeName === "AIRPLANE";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative overflow-hidden ${isModern ? "" : theme.cardBg + " " + theme.border} ${isBus || isMetro ? "rounded-none md:rounded-2xl" : "rounded-2xl"} flex flex-col md:flex-row shadow-xl animate-pulse`}
    >
      {/* Decorative subtle gradient background solo en MODERN */}
      {isModern && (
        <div className="absolute inset-0 pointer-events-none z-0">
           <GlassSurface 
             width="100%" 
             height="100%" 
             borderRadius={16} 
             brightness={95} 
             opacity={0.6} 
             blur={20} 
             displace={8}
             backgroundOpacity={0.35}
             className="border border-white/60 shadow-[0_8px_32px_rgba(34,211,238,0.15)]"
           />
        </div>
      )}

      {/* BUS Sidebar */}
      {isBus && (
        <div className={`${theme.sidebarColor} w-full md:w-64 p-8 flex flex-col justify-center items-center shrink-0`}>
          <div className="w-20 h-4 bg-white/20 rounded mb-2"></div>
          <div className="w-40 h-16 bg-white/20 rounded mb-8"></div>
          <div className="w-24 h-12 bg-white/20 rounded"></div>
        </div>
      )}

      <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1 w-full max-w-full overflow-hidden">
          {/* Calendar Badge Skeleton */}
          <div className={`w-32 h-8 rounded-md mb-6 ${theme.textSecondary} opacity-20 bg-current`}></div>
          
          {/* Title Skeleton */}
          <div className={`w-full h-16 md:h-24 rounded-2xl mb-6 ${theme.textPrimary} opacity-20 bg-current`}></div>
          <div className={`w-[90%] h-16 md:h-24 rounded-2xl ${theme.textPrimary} opacity-20 bg-current`}></div>
          
          {/* Description Skeleton */}
          <div className={`w-full h-8 md:h-12 mt-8 rounded-xl ${theme.textSecondary} opacity-20 bg-current`}></div>
        </div>
        
        {/* Time Blocks Skeleton for AIRPLANE and MODERN */}
        {(!isBus && !isMetro) && (
          <div className="flex flex-col items-end mt-12 md:mt-0 md:ml-12 text-right min-w-[300px] shrink-0">
            <div className={`w-[250px] h-20 md:h-[80px] rounded-2xl mb-6 ${theme.textAccent} opacity-20 bg-current`}></div>
            <div className={`w-[200px] h-10 md:h-[48px] rounded-xl ${theme.textAccentSecondary} opacity-20 bg-current`}></div>
          </div>
        )}

        {/* METRO: Time inside */}
        {isMetro && (
          <div className="flex flex-col items-end mt-12 md:mt-0 md:ml-12 text-right shrink-0">
            <div className={`w-48 h-20 md:h-[80px] rounded-2xl ${theme.textPrimary} opacity-20 bg-current`}></div>
          </div>
        )}
        
        {/* BUS: Remaining time inside */}
        {isBus && (
          <div className="flex flex-col items-end mt-8 md:mt-0 md:ml-12 text-right shrink-0">
             <div className={`w-32 h-8 rounded-lg bg-gray-500 opacity-20`}></div>
          </div>
        )}
      </div>

      {/* METRO Sidebar */}
      {isMetro && (
        <div className={`${theme.sidebarColor} w-full md:w-56 p-8 flex flex-col justify-center items-center shrink-0`}>
           <div className="w-16 h-4 bg-white/20 rounded mb-2"></div>
           <div className="w-20 h-16 bg-white/20 rounded mb-8"></div>
           <div className="w-20 h-4 bg-white/20 rounded mb-2"></div>
           <div className="w-32 h-8 bg-white/20 rounded"></div>
        </div>
      )}
    </motion.div>
  );
}
