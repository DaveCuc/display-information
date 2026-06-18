"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Clock from "./Clock";
import MainEventCard from "./MainEventCard";
import SmallEventCard from "./SmallEventCard";
import { RefreshCw, LogOut, Eye, EyeOff, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import { useTheme } from "./ThemeProvider";
import ThemeSelector from "./ThemeSelector";
import FloatingShapes from "./FloatingShapes";
import { isToday, isTomorrow, format } from "date-fns";
import { es } from "date-fns/locale";
import SkeletonMainEventCard from "./SkeletonMainEventCard";
import SkeletonSmallEventCard from "./SkeletonSmallEventCard";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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

  const [selectedSound, setSelectedSound] = useState<"notification" | "chord" | "none">("notification");
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);

  useEffect(() => {
    const savedSound = localStorage.getItem("fids-sound");
    if (savedSound) setSelectedSound(savedSound as any);
  }, []);

  const [playNotification] = useSound("/sounds/notification.mp3", { volume: 0.5 });
  const [playChord] = useSound("/sounds/chord.mp3", { volume: 0.5 });

  const playCurrentSound = () => {
    if (selectedSound === "notification") playNotification();
    if (selectedSound === "chord") playChord();
  };

  const handleSoundChange = (sound: "notification" | "chord" | "none") => {
    setSelectedSound(sound);
    localStorage.setItem("fids-sound", sound);
    setIsSoundMenuOpen(false);
    if (sound === "notification") playNotification();
    if (sound === "chord") playChord();
  };

  const fetchEvents = async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      // Agregamos un retraso artificial de 2 segundos junto con la petición real
      const fetchPromise = fetch(`/api/calendar?t=${new Date().getTime()}`);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));
      
      const [res] = await Promise.all([fetchPromise, delayPromise]);
      
      if (res.ok) {
        setErrorMsg(null);
        const data = await res.json();
        
        // Recalculamos isMain por seguridad
        const finalEvents = data.map((e: CalendarEvent, i: number) => ({
          ...e,
          isMain: i === 0
        }));

        setEvents(finalEvents);
      } else {
        const errText = await res.text();
        console.error("Failed to fetch events", errText);
        setErrorMsg(`Error del servidor: ${res.status} ${errText}`);
      }
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setErrorMsg(error?.message || "Error desconocido al conectar con API");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para auto-recargar cada minuto
  useEffect(() => {
    if (status === "authenticated") {
      fetchEvents();
      // Refrescar automáticamente cada hora (3600000 ms)
      const interval = setInterval(() => {
        // En los refrescos de fondo NO borramos los eventos visualmente para evitar un parpadeo de 2s a los usuarios
        // Solo ocurre de fondo, pero si se clica manual sí borra los eventos
        fetchEvents();
      }, 3600000); // 1 hora
      return () => clearInterval(interval);
    }
  }, [status]);

  // Efecto inteligente para tocar la campana SÓLO cuando cambia el evento principal
  useEffect(() => {
    const currentMainEvent = events.find((e) => e.isMain);
    const currentId = currentMainEvent ? currentMainEvent.id : null;
    
    // Si ya teníamos un evento anterior, y el nuevo es distinto, tocamos la campana
    if (prevMainEventIdRef.current !== null && currentId !== null && prevMainEventIdRef.current !== currentId) {
      playCurrentSound();
    }
    
    // Actualizamos la referencia
    if (currentId !== null) {
      prevMainEventIdRef.current = currentId;
    }
  }, [events, selectedSound, playNotification, playChord]);

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

      {/* Theme Selector - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <ThemeSelector />
      </div>

      {/* Sound Selector - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-30 hidden md:block">
        <div className="relative">
          <AnimatePresence>
            {isSoundMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute bottom-16 left-0 w-48 rounded-xl shadow-xl border overflow-hidden ${theme.cardBg} ${theme.border} backdrop-blur-xl`}
              >
                <div className="flex flex-col p-2 gap-1">
                  <button
                    onClick={() => handleSoundChange("notification")}
                    className={`px-4 py-2 text-left rounded-lg transition-colors font-medium ${selectedSound === "notification" ? "bg-cyan-500/20 text-cyan-400" : `hover:bg-white/10 ${theme.textSecondary}`}`}
                  >
                    Notification (Futurista)
                  </button>
                  <button
                    onClick={() => handleSoundChange("chord")}
                    className={`px-4 py-2 text-left rounded-lg transition-colors font-medium ${selectedSound === "chord" ? "bg-cyan-500/20 text-cyan-400" : `hover:bg-white/10 ${theme.textSecondary}`}`}
                  >
                    Chord (Arpa)
                  </button>
                  <button
                    onClick={() => handleSoundChange("none")}
                    className={`px-4 py-2 text-left rounded-lg transition-colors font-medium ${selectedSound === "none" ? "bg-red-500/20 text-red-400" : `hover:bg-white/10 ${theme.textSecondary}`}`}
                  >
                    Silenciar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
            className={`p-3 rounded-full border shadow-lg transition-all flex items-center justify-center gap-2 ${isSoundMenuOpen ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400" : `${theme.cardBg} ${theme.border} ${theme.textSecondary} hover:${theme.textPrimary} hover:border-white/30`}`}
            title="Sonido de Notificación"
          >
            <Music size={20} />
          </button>
        </div>
      </div>

      {/* Top left controls */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => {
            playCurrentSound();
            setEvents([]); // Borramos los eventos para mostrar los Skeletons
            fetchEvents();
          }}
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

      <div className="w-full flex flex-col gap-8 md:gap-10 relative z-10">
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
            {errorMsg && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-red-500 text-center text-xl font-bold py-10 border border-red-500/50 rounded-2xl bg-white/30 backdrop-blur-[40px] shadow-xl"
              >
                Error: {errorMsg}
              </motion.div>
            )}

            {events.length === 0 && loading && !errorMsg && (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-6 w-full"
              >
                <SkeletonMainEventCard />
                <motion.div 
                   initial={{ scaleX: 0 }} 
                   animate={{ scaleX: 1 }} 
                   className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-2" 
                />
                {[1, 2, 3].map((_, idx) => (
                  <SkeletonSmallEventCard key={`sk-${idx}`} index={idx} />
                ))}
              </motion.div>
            )}

            {events.length === 0 && !loading && !errorMsg && (
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

            {/* Separador brillante debajo del evento principal */}
            {mainEvent && (
               <motion.div 
                 initial={{ scaleX: 0 }} 
                 animate={{ scaleX: 1 }} 
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-2" 
               />
            )}

            {(() => {
              const nodes: React.ReactNode[] = [];
              let lastDateStr = mainEvent 
                  ? new Date(mainEvent.startTimeIso).toDateString()
                  : "";

              smallEvents.forEach((event, index) => {
                const eventDate = new Date(event.startTimeIso);
                const eventDateStr = eventDate.toDateString();
                
                // Si la fecha del evento actual es distinta a la anterior, agregamos un divisor
                if (eventDateStr !== lastDateStr) {
                  let dateLabel = format(eventDate, "EEEE d 'de' MMMM", { locale: es });
                  if (isToday(eventDate)) dateLabel = "Hoy";
                  else if (isTomorrow(eventDate)) dateLabel = "Mañana";

                  nodes.push(
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={`divider-${eventDateStr}`} 
                      className={`w-full flex items-center gap-4 my-2 ${theme.textSecondary}`}
                    >
                      <div className="h-px bg-current flex-1 opacity-20"></div>
                      <span className="text-sm md:text-base font-bold tracking-widest uppercase">{dateLabel}</span>
                      <div className="h-px bg-current flex-1 opacity-20"></div>
                    </motion.div>
                  );
                  lastDateStr = eventDateStr;
                }

                // Agregamos la tarjeta del evento
                nodes.push(
                  <SmallEventCard
                    key={event.id}
                    index={index}
                    title={event.title}
                    time={event.time}
                    startTimeIso={event.startTimeIso}
                    calendarName={event.calendarName}
                    calendarColor={event.calendarColor}
                  />
                );
              });

              return nodes;
            })()}
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
