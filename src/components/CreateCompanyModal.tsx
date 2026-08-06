"use client";

import { useState } from "react";
import { Building2, Plus, X, PlusCircle } from "lucide-react";

interface CreateCompanyModalProps {
  handleCreateTenant: (formData: FormData) => Promise<void>;
}

export default function CreateCompanyModal({ handleCreateTenant }: CreateCompanyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsPending(true);
      setErrorMsg(null);
      await handleCreateTenant(formData);
      setIsPending(false);
      setIsOpen(false);
    } catch (err: any) {
      setIsPending(false);
      setErrorMsg(err.message || "Error al registrar la empresa.");
    }
  };

  return (
    <>
      {/* Botón Disparador */}
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-lg cursor-pointer self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Registrar Nueva Empresa</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">Registrar Nueva Empresa</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Alta de nuevo cliente corporativo en el sistema.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Formulario */}
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nombre de la Empresa
                </label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ej: Globex Corporation" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Slug / Identificador URL
                </label>
                <span className="block text-[11px] text-slate-500 mb-2">
                  Se usarán para las URLs (ej: app.com/<strong>globex</strong>/dashboard). Opcional.
                </span>
                <input 
                  type="text" 
                  name="slug" 
                  placeholder="Ej: globex (se autogenera si se deja vacío)" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Color Identificativo
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    name="primaryColor" 
                    defaultValue="#3b82f6" 
                    className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer p-1" 
                  />
                  <span className="text-xs text-slate-400">Personaliza la insignia y avatar del cliente</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isPending ? "Guardando..." : "Crear Empresa"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}