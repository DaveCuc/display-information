"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, ThemeType } from "./ThemeProvider";
import { ChevronUp, ChevronDown, MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

const THEME_OPTIONS: { id: ThemeType; label: string; desc: string }[] = [
  { id: "MODERN", label: "Holograma", desc: "Cian, Cristal, Transparente" },
  { id: "AIRPLANE", label: "Aeropuerto", desc: "Clásico, LED Amarillos" },
  { id: "BUS", label: "Autobús (ADO)", desc: "Barra Roja, Limpio" },
  { id: "METRO", label: "Metro", desc: "Barra Azul, Oscuro" }
];

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { themeName, setTheme } = useTheme();

  return (
    <>
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">
      {/* Botón para abrir/cerrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-t-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.3)] transition-colors flex items-center gap-2 font-semibold"
      >
        Temas {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>

      {/* Menú Desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-gray-900 border-t border-gray-700 shadow-2xl overflow-hidden"
          >
            <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                      themeName === opt.id
                        ? "border-cyan-400 bg-gray-800"
                        : "border-gray-700 hover:border-gray-500 bg-gray-800/50"
                    }`}
                  >
                    <span className={`font-bold text-lg ${themeName === opt.id ? "text-cyan-400" : "text-white"}`}>
                      {opt.label}
                    </span>
                    <span className="text-sm text-gray-400 mt-1 text-left">{opt.desc}</span>
                  </button>
                ))}
              </div>

              {/* Botón de Comentarios / Feedback */}
              <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-gray-400 text-sm font-medium text-center sm:text-left">
                  ¿Tienes alguna propuesta de diseño o queja?
                </span>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setIsFeedbackOpen(true);
                  }}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-2.5 rounded-xl border border-gray-600 hover:border-gray-500 transition-all text-sm font-bold shadow-lg"
                >
                  <MessageSquare size={18} />
                  Enviar Comentarios
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <FeedbackModal 
      isOpen={isFeedbackOpen} 
      onClose={() => setIsFeedbackOpen(false)} 
    />
    </>
  );
}
