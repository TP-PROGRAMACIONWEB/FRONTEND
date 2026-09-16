"use client";

import { X, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExternalAuthModalProps {
  onClose: () => void;
  onContinue: () => void;
}

export function ExternalAuthModal({ onClose, onContinue }: ExternalAuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#F0F4EF] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Browser Chrome Header */}
        <div className="bg-[#213144] px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-[#15202B] rounded-md px-3 py-1 flex items-center gap-2">
            <Lock className="w-3 h-3 text-green-400" />
            <span className="text-xs text-[#B4CDED] font-medium truncate">
              accounts.google.com/signin/oauth
            </span>
          </div>
          <button onClick={onClose} className="text-[#B4CDED] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-[#0D1821] mb-2">Iniciar sesión con Google</h2>
          <p className="text-sm text-gray-500 mb-8">
            Selecciona una cuenta para continuar a OFFIX
          </p>

          <div className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-6 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              U
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-[#0D1821] truncate">Usuario de Prueba</p>
              <p className="text-xs text-gray-500 truncate">usuario@ejemplo.com</p>
            </div>
          </div>

          <Button 
            onClick={onContinue}
            className="w-full bg-[#213144] hover:bg-[#15202B] text-white rounded-xl h-11 font-medium"
          >
            Continuar con Google
          </Button>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Simulación de entorno local</span>
          </div>
        </div>
      </div>
    </div>
  );
}
