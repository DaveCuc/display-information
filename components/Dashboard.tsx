"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Clock from "./Clock";
import MainEventCard from "./MainEventCard";
import SmallEventCard from "./SmallEventCard";
import { RefreshCw, LogOut, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import { useTheme } from "./ThemeProvider";
import ThemeSelector from "./ThemeSelector";
import FloatingShapes from "./FloatingShapes";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  remainingTime: string;
  startTimeIso: string;
  endTimeIso: string;
  isMain: boolean;
  calendarName?: string;
  calendarColor?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClockHidden, setIsClockHidden] = useState(false);
  const { theme, themeName } = useTheme();
  
  // Ref para detectar cuando el evento principal cambia
  const prevMainEventIdRef = useRef<string | null>(null);

  // Reset clock visibility if theme changes from DIGITAL
  useEffect(() => {
    if (themeName !== "DIGITAL") {
      setIsClockHidden(false);
    }
  }, [themeName]);

  // We assume the user will drop a chime.mp3 in public/sounds
  // If the file is not there, it simply won't play
  const [playChime] = useSound("/sounds/chime.mp3", { volume: 0.5 });

  const fetchEvents = async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const data = await res.json();
        
        // Filtramos estrictamente los eventos que suceden "hoy" según la zona horaria del usuario
        const todayStr = new Date().toDateString();
        const todaysEvents = data.filter((e: CalendarEvent) => {
          const startStr = new Date(e.startTimeIso).toDateString();
          return startStr === todayStr;
        });

        // Recalculamos isMain por si el primer evento de la lista general no era de hoy
        const finalEvents = todaysEvents.map((e: CalendarEvent, i: number) => ({
          ...e,
          isMain: i === 0
        }));

        // Eliminado playChime de aquí, se maneja en un useEffect separado
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para auto-recargar cada minuto
  useEffect(() => {
    if (status === "authenticated") {
      fetchEvents();
      const interval = setInterval(() => {
        fetchEvents();
      }, 60000); // 1 minuto
      return () => clearInterval(interval);
    }
  }, [status]);

  // Efecto inteligente para tocar la campana SÓLO cuando cambia el evento principal
  useEffect(() => {
    const currentMainEvent = events.find((e) => e.isMain);
    const currentId = currentMainEvent ? currentMainEvent.id : null;
    
    // Si ya teníamos un evento anterior, y el nuevo es distinto, tocamos la campana
    if (prevMainEventIdRef.current !== null && currentId !== null && prevMainEventIdRef.current !== currentId) {
      playChime();
    }
    
    // Actualizamos la referencia
    if (currentId !== null) {
      prevMainEventIdRef.current = currentId;
    }
  }, [events, playChime]);

  if (status === "loading") {
    return <div className={`min-h-screen flex items-center justify-center text-3xl font-bold ${theme.textPrimary}`}>Cargando FIDS...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Fondo llamativo y claro */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ x: [0, 100, -100, 0], y: [0, -100, 50, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-300/60 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ x: [0, -150, 100, 0], y: [0, 100, -100, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-400/30 rounded-full blur-[150px]" 
          />
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* Columna Izquierda: Texto Corto y Directo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-800">
                Display Information
              </h1>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-700 leading-tight">
              Tu día a día, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">de un vistazo.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
              Siente la experiencia visual de esperar un avión o un tren. Conecta tu calendario de Google y visualiza todas tus actividades de forma espectacular sin esfuerzo.
            </p>
          </motion.div>

          {/* Columna Derecha: Tarjeta de Login (Cristal Claro) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-white/60 backdrop-blur-3xl border border-white/80 rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(34,211,238,0.15)] flex flex-col gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Comienza ahora</h3>
                <p className="text-sm text-slate-500 font-medium">Sincroniza tus eventos en un clic</p>
              </div>

              <button 
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 text-slate-700 px-6 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continuar con Google</span>
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Footer Legal Links */}
        <div className="absolute bottom-6 flex gap-6 text-sm text-slate-500 font-medium z-20">
          <a href="/privacy" className="hover:text-cyan-600 transition-colors">Política de Privacidad</a>
          <a href="/terms" className="hover:text-cyan-600 transition-colors">Condiciones de Servicio</a>
        </div>
      </div>
    );
  }

  const mainEvent = events.find((e) => e.isMain);
  const smallEvents = events.filter((e) => !e.isMain);

  return (
    <div className={`min-h-screen p-4 md:p-12 relative overflow-hidden flex flex-col`}>
      {/* Estética futurista de fondo (solo en Modern) */}
      {themeName === "MODERN" && <FloatingShapes />}

      {/* Top left controls */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={fetchEvents}
          disabled={loading}
          className={`p-4 ${theme.cardBg} ${theme.border} border-2 ${theme.textAccent} hover:${theme.textPrimary} rounded-full transition-all shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Actualizar eventos manualmente"
        >
          <RefreshCw className={`w-7 h-7 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Top right controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center justify-center w-14 h-14 rounded-full overflow-hidden border-2 ${theme.border} hover:opacity-80 transition-opacity shadow-lg focus:outline-none`}
            title={session?.user?.name || "Usuario"}
          >
            {session?.user?.image ? (
              <img src={session.user.image} alt="Perfil" className="w-full h-full object-cover pointer-events-none" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center font-bold ${theme.cardBg} ${theme.textPrimary}`}>
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            )}
          </button>
          
          {/* Dropdown Cerrar Sesión */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-3"
              >
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    signOut();
                  }}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl ${theme.cardBg} ${theme.border} border-2 ${theme.textPrimary} hover:text-red-500 font-bold shadow-2xl whitespace-nowrap backdrop-blur-xl transition-colors`}
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-10 relative z-10">
        <header className="mb-4 flex flex-col items-center relative">
          {!isClockHidden && <Clock />}
          
          {/* Toggle Reloj solo para el tema DIGITAL */}
          {themeName === "DIGITAL" && (
            <button
              onClick={() => setIsClockHidden(!isClockHidden)}
              className={`absolute -right-4 md:right-0 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors`}
              title={isClockHidden ? "Mostrar reloj" : "Ocultar reloj"}
            >
              {isClockHidden ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          )}
        </header>

        <main className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {events.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-cyan-600 text-center text-3xl font-bold py-20 border border-white/50 rounded-2xl bg-white/30 backdrop-blur-[40px] shadow-xl"
              >
                No hay actividades próximas
              </motion.div>
            )}

            {mainEvent && (
              <MainEventCard
                key={mainEvent.id}
                title={mainEvent.title}
                description={mainEvent.description}
                time={mainEvent.time}
                remainingTime={mainEvent.remainingTime}
                startTimeIso={mainEvent.startTimeIso}
                endTimeIso={mainEvent.endTimeIso}
                calendarName={mainEvent.calendarName}
                calendarColor={mainEvent.calendarColor}
              />
            )}

            {/* Separador brillante */}
            {mainEvent && (
               <motion.div 
                 initial={{ scaleX: 0 }} 
                 animate={{ scaleX: 1 }} 
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-2" 
               />
            )}

            {smallEvents.map((event, index) => (
              <SmallEventCard
                key={event.id}
                index={index}
                title={event.title}
                time={event.time}
                startTimeIso={event.startTimeIso}
                calendarName={event.calendarName}
                calendarColor={event.calendarColor}
              />
            ))}
          </AnimatePresence>
        </main>
      </div>
      <ThemeSelector />

      {/* Version Tag */}
      <div className={`absolute bottom-4 right-6 z-20 text-xs md:text-sm font-bold opacity-50 tracking-wider ${theme.textPrimary}`}>
        1.0.0v
      </div>
    </div>
  );
}
