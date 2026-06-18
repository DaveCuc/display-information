"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { format } from "date-fns";
import GlassSurface from "./GlassSurface";
import { SplitFlap } from "clackboard";

interface SmallEventCardProps {
  title: string;
  time: string; // Failsafe
  startTimeIso?: string;
  index?: number;
  calendarName?: string;
  calendarColor?: string;
}

export default function SmallEventCard({ title, time, startTimeIso, index = 0, calendarName, calendarColor }: SmallEventCardProps) {
  const { theme, themeName, is24Hour } = useTheme();

  const isAirplane = themeName === "AIRPLANE";
  const initialAnim = isAirplane ? { opacity: 0, rotateX: 90 } : { opacity: 0, x: -20 };
  const animateAnim = isAirplane ? { opacity: 1, rotateX: 0 } : { opacity: 1, x: 0 };

  const displayTime = startTimeIso 
    ? format(new Date(startTimeIso), is24Hour ? "HH:mm" : "hh:mm a") 
    : time;

  const isBus = themeName === "BUS";
  const isMetro = themeName === "METRO";
  const isModern = themeName === "MODERN";

  return (
    <motion.div 
      initial={initialAnim}
      animate={animateAnim}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      style={{ perspective: isAirplane ? "1000px" : "none" }}
      className={`relative overflow-hidden ${isModern ? "" : theme.cardBg + " " + theme.border} ${isBus || isMetro ? "rounded-none" : "rounded-xl"} flex hover:opacity-80 transition-all shadow-md group`}
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

      {/* BUS Sidebar (Izquierda) */}
      {isBus && (
        <div className={`${theme.sidebarColor} w-24 md:w-32 p-4 flex flex-col justify-center items-center text-white shrink-0`}>
          <div className="text-xl md:text-3xl font-black">{displayTime}</div>
        </div>
      )}

      {/* Contenido (AIRPLANE usa clackboard, los demás texto normal) */}
      <div className={`p-6 md:p-8 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 ${isBus || isMetro ? "ml-6 md:ml-10" : ""}`}>
        <div className="flex-1 min-w-0 pr-4 w-full">
          {isAirplane ? (
             <div className="mb-2 max-w-[50vw]">
                <SplitFlap value={title.toUpperCase()} size="sm" color="dark" />
             </div>
          ) : (
            <h3 className={`text-2xl md:text-3xl font-bold truncate ${theme.textPrimary}`}>
              {title}
            </h3>
          )}
          
          {/* Calendar Badge */}
          {calendarName && calendarColor && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded border shadow-sm" style={{ borderColor: calendarColor, backgroundColor: `${calendarColor}15` }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: calendarColor, boxShadow: `0 0 5px ${calendarColor}` }} />
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: calendarColor }}>{calendarName}</span>
            </div>
          )}
          
          {/* Failsafe for description if added later */}
        </div>
        
        {/* Tiempo (AIRPLANE usa clackboard) */}
        {(!isBus && !isMetro) && (
          <div className="mt-4 md:mt-0 flex-shrink-0 text-right ml-0 md:ml-6 flex items-center justify-end w-full md:w-auto h-[48px] overflow-hidden">
             {isAirplane ? (
                <SplitFlap value={displayTime} size="sm" color="dark" />
             ) : (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={displayTime}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className={`text-3xl md:text-4xl font-black ${theme.textAccent}`}
                  >
                    {displayTime}
                  </motion.div>
                </AnimatePresence>
             )}
          </div>
        )}
      </div>

      {/* METRO Sidebar (Derecha) */}
      {isMetro && (
        <div className={`${theme.sidebarColor} w-24 md:w-32 p-4 flex flex-col justify-center items-center text-white shrink-0`}>
           <div className="text-xs font-bold uppercase mb-1 text-white/80">Plat</div>
           <div className="text-3xl font-black">{index + 2}</div>
        </div>
      )}
    </motion.div>
  );
}
