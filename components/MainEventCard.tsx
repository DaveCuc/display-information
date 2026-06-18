"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { format } from "date-fns";
import GlassSurface from "./GlassSurface";
import { SplitFlap } from "clackboard";

interface MainEventCardProps {
  title: string;
  description: string;
  time: string;
  remainingTime: string; // Failsafe
  startTimeIso?: string;
  endTimeIso?: string;
  calendarName?: string;
  calendarColor?: string;
}

export default function MainEventCard({ title, description, time, remainingTime, startTimeIso, endTimeIso, calendarName, calendarColor }: MainEventCardProps) {
  const { theme, themeName, is24Hour } = useTheme();
  const [dynamicTime, setDynamicTime] = useState(remainingTime);

  useEffect(() => {
    if (!startTimeIso) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const startTarget = new Date(startTimeIso);
      const diffStartMs = startTarget.getTime() - now.getTime();
      
      const pad = (num: number) => num.toString().padStart(2, "0");
      
      if (diffStartMs <= 0) {
        // Event has started, check against endTime if available
        if (endTimeIso) {
          const endTarget = new Date(endTimeIso);
          const diffEndMs = endTarget.getTime() - now.getTime();
          
          if (diffEndMs <= 0) {
            setDynamicTime("¡FINALIZADO!");
            return;
          }
          
          if (diffEndMs <= 60000) {
            setDynamicTime("¡FINALIZANDO!");
            return;
          }
          
          // Toggle every 5 seconds (5000ms)
          const isShowingInCourse = Math.floor(now.getTime() / 5000) % 2 === 0;
          if (isShowingInCourse) {
            setDynamicTime("¡EN CURSO!");
          } else {
            const diffEndSecs = Math.floor(diffEndMs / 1000);
            const h = Math.floor(diffEndSecs / 3600);
            const m = Math.floor((diffEndSecs % 3600) / 60);
            const s = diffEndSecs % 60;
            setDynamicTime(`Fin: ${pad(h)}:${pad(m)}:${pad(s)}`);
          }
        } else {
          setDynamicTime("¡EN CURSO!");
        }
        return;
      }
      
      // Event hasn't started yet
      const diffSecs = Math.floor(diffStartMs / 1000);
      const h = Math.floor(diffSecs / 3600);
      const m = Math.floor((diffSecs % 3600) / 60);
      const s = diffSecs % 60;
      
      setDynamicTime(`Faltan: ${pad(h)}:${pad(m)}:${pad(s)}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTimeIso, endTimeIso]);
  
  // Para el tema AIRPLANE, añadimos una animación de rotación X extra al montar
  const isAirplane = themeName === "AIRPLANE";
  const initialAnim = isAirplane ? { opacity: 0, rotateX: 90 } : { opacity: 0, y: 20 };
  const animateAnim = isAirplane ? { opacity: 1, rotateX: 0 } : { opacity: 1, y: 0 };
  
  // Si no tenemos startTimeIso por alguna razón, caemos de vuelta al 'time' preformateado
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
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ perspective: isAirplane ? "1000px" : "none" }}
      className={`relative overflow-hidden ${isModern ? "" : theme.cardBg + " " + theme.border} ${isBus || isMetro ? "rounded-none md:rounded-2xl" : "rounded-2xl"} flex flex-col md:flex-row shadow-xl`}
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

      {/* BUS Sidebar (Izquierda - Estilo ADO) */}
      {isBus && (
        <div className={`${theme.sidebarColor} w-full md:w-64 p-8 flex flex-col justify-center items-center text-white shrink-0`}>
          <div className="text-sm font-bold tracking-widest uppercase mb-1">Hora Local</div>
          <div className="text-5xl md:text-6xl font-black mb-8">{displayTime}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold uppercase">Puerta</span>
            <span className="text-5xl font-black">14</span>
          </div>
        </div>
      )}

      <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1 max-w-full overflow-hidden">
          {calendarName && calendarColor && (
            <div className="mb-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-md border shadow-sm" style={{ borderColor: calendarColor, backgroundColor: `${calendarColor}15` }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: calendarColor, boxShadow: `0 0 8px ${calendarColor}` }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: calendarColor }}>{calendarName}</span>
            </div>
          )}
          
          {isAirplane ? (
            <div className="mb-4 overflow-hidden w-full max-w-[60vw]">
               <SplitFlap value={title.toUpperCase()} size="sm" color="dark" />
            </div>
          ) : (
            <h2 className={`text-4xl md:text-6xl font-extrabold leading-tight ${theme.textPrimary} tracking-tight ${theme.glow}`}>
              {title}
            </h2>
          )}
          
          {description && (
            <p className={`text-xl md:text-3xl ${theme.textSecondary} mt-4 font-medium tracking-wide`}>
              {description}
            </p>
          )}
        </div>
        
        {/* Bloques de Tiempo para AIRPLANE y MODERN */}
        {(!isBus && !isMetro) && (
          <div className="flex flex-col items-end mt-8 md:mt-0 md:ml-12 text-right min-w-[300px] shrink-0">
            {isAirplane ? (
              <div className="mb-4">
                 <SplitFlap value={displayTime} size="md" color="dark" />
              </div>
            ) : (
              <div className={`text-5xl md:text-6xl font-black ${theme.textAccent} ${theme.accentGlow} tracking-wider relative overflow-hidden py-2 h-[80px] flex items-center justify-end`}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={is24Hour ? "24" : "12"}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {displayTime}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
            
            <div className={`text-2xl md:text-3xl font-bold ${theme.textAccentSecondary} mt-4 uppercase tracking-widest ${theme.glow} relative overflow-hidden h-[40px] md:h-[48px] flex items-center justify-end w-full min-w-[200px]`}>
              {isAirplane ? (
                 <SplitFlap value={dynamicTime.toUpperCase()} size="sm" color="dark" />
              ) : (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={dynamicTime.split(":")[0]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {dynamicTime}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        {/* METRO: Time inside, remaining time on the right sidebar */}
        {isMetro && (
          <div className="flex flex-col items-end mt-8 md:mt-0 md:ml-12 text-right shrink-0">
            <div className={`text-5xl md:text-6xl font-black ${theme.textPrimary}`}>
              {displayTime}
            </div>
          </div>
        )}
        
        {/* BUS: Remaining time inside, local time on the left sidebar */}
        {isBus && (
          <div className="flex flex-col items-end mt-8 md:mt-0 md:ml-12 text-right shrink-0">
             <div className={`text-2xl font-bold text-gray-500 uppercase tracking-widest`}>
                {dynamicTime}
             </div>
          </div>
        )}
      </div>

      {/* METRO Sidebar (Derecha - Estilo Flinders) */}
      {isMetro && (
        <div className={`${theme.sidebarColor} w-full md:w-56 p-8 flex flex-col justify-center items-center text-white shrink-0`}>
           <div className="text-sm font-bold uppercase mb-1 text-white/80">Plat</div>
           <div className="text-6xl font-black mb-8">1</div>
           <div className="text-sm font-bold uppercase mb-1 text-white/80">Estado</div>
           <div className="text-2xl font-bold text-center leading-tight">
             {dynamicTime}
           </div>
        </div>
      )}
    </motion.div>
  );
}
