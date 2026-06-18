"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import GlassSurface from "./GlassSurface";

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);
  const [isLongDate, setIsLongDate] = useState(false);
  const { theme, themeName, is24Hour, setIs24Hour } = useTheme();

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className={`flex justify-center gap-6 text-5xl md:text-6xl font-bold ${theme.textAccent} opacity-50`}>
        <span>00:00</span>
        <span>DD/MM/AA</span>
      </div>
    );
  }

  // Truco para hacer que el countdown cuente hacia ARRIBA y muestre la hora local actual
  const getFakeNow = () => {
    const d = new Date();
    let hours = d.getHours();
    if (!is24Hour) {
      hours = hours % 12 || 12;
    }
    const msSinceMidnight = hours * 3600000 + d.getMinutes() * 60000 + d.getSeconds() * 1000;
    return -msSinceMidnight;
  };

  const isModern = theme.background.includes("eef2f6"); 
  const isAirplane = themeName === "AIRPLANE";

  // Estilos mecánicos para el panel de aeropuerto
  const splitFlapStyle = {
    background: '#111',
    color: '#fbbf24', // yellow-400
    border: '2px solid #333',
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.5)',
    fontSize: '3rem',
    fontWeight: '700',
    borderRadius: '8px',
    width: '45px',
    height: '65px',
  };

  return (
    <div 
      onClick={() => setIs24Hour(!is24Hour)}
      className={`flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity select-none relative overflow-hidden py-4 px-8 rounded-2xl ${isModern ? "" : ""}`}
      title="Cambiar formato de hora"
    >
      {isModern && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <GlassSurface 
             width="100%" 
             height="100%" 
             borderRadius={16} 
             brightness={95} 
             opacity={0.5} 
             blur={18} 
             displace={5}
             backgroundOpacity={0.35}
             className="border border-white/60 shadow-lg"
           />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        {isAirplane ? (
        <FlipClockCountdown
          to={0}
          now={getFakeNow}
          renderMap={[false, true, true, true]} // Ocultar días, mostrar H M S
          showLabels={false}
          digitBlockStyle={splitFlapStyle}
          separatorStyle={{ color: '#fbbf24', size: '6px' }}
          dividerStyle={{ color: 'rgba(0,0,0,0.8)', height: '2px' }}
        />
      ) : (
        <div className={`flex justify-center gap-6 text-5xl md:text-6xl font-black ${theme.textAccent} tracking-widest ${theme.accentGlow}`}>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={is24Hour ? "24" : "12"}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {format(time, is24Hour ? "HH:mm" : "hh:mm a")}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
      <span 
        onClick={(e) => {
          e.stopPropagation();
          setIsLongDate(!isLongDate);
        }}
        title="Cambiar formato de fecha"
        className={`uppercase font-bold tracking-widest mt-2 cursor-pointer hover:scale-105 transition-transform ${isModern ? 'text-slate-600' : theme.textSecondary}`}
      >
        {isLongDate 
          ? format(time, "EEEE d 'de' MMMM 'del' yyyy", { locale: es }) 
          : format(time, "dd/MM/yy")
        } {isAirplane && !is24Hour ? format(time, "a") : ''}
      </span>
      </div>
    </div>
  );
}
