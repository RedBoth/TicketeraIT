"use client";

import { useState } from "react";
import { Ticket as TicketIcon, PlusCircle, X, Plus } from "lucide-react";

interface Equipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
}

interface CreateTicketModalProps {
  handleCreateTicket: (formData: FormData) => Promise<void>;
  equipmentList: Equipment[];
  tenantPrimaryColor?: string;
}

export default function CreateTicketModal({ 
  handleCreateTicket, 
  equipmentList,
  tenantPrimaryColor = "#f59e0b" 
}: CreateTicketModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    await handleCreateTicket(formData);
    setIsPending(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón Disparador */}
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-lg cursor-pointer hover:brightness-110"
        style={{ backgroundColor: tenantPrimaryColor }}
      >
        <Plus className="w-4 h-4" />
        <span>Abrir Nuevo Ticket</span>
      </button>

      {/* Backdrop y Ventana Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div 
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800"
                  style={{ color: tenantPrimaryColor }}
                >
                  <TicketIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">Abrir Nuevo Ticket</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Ingresá los detalles del incidente para el equipo técnico.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Asunto / Incidente
                </label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Ej: Error de conexión a la VPN" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Descripción del Problema
                </label>
                <textarea 
                  name="description" 
                  rows={4} 
                  placeholder="Detallá lo más posible el inconveniente..." 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Prioridad
                  </label>
                  <select 
                    name="priority" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Equipo Afectado
                  </label>
                  <select 
                    name="equipmentId" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="none">Sin equipo asociado</option>
                    {equipmentList.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.type} - {eq.brand} {eq.model}
                      </option>
                    ))}
                  </select>
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
                  className="text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                  style={{ backgroundColor: tenantPrimaryColor }}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isPending ? "Enviando..." : "Enviar Solicitud"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}