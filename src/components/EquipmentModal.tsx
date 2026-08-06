"use client";

import { useState } from "react";
import { Cpu, PlusCircle, X, Plus } from "lucide-react";

interface EquipmentModalProps {
  handleAddEquipment: (formData: FormData) => Promise<void>;
  tenantPrimaryColor?: string;
}

export default function EquipmentModal({ 
  handleAddEquipment, 
  tenantPrimaryColor = "#f59e0b" 
}: EquipmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    await handleAddEquipment(formData);
    setIsPending(false);
    setIsOpen(false); // Cerramos el modal tras guardar
  };

  return (
    <>
      {/* Botón Disparador */}
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-slate-950 font-bold text-white text-xs px-4 py-2.5 rounded-lg transition-all shadow-lg cursor-pointer hover:brightness-110"
        style={{ backgroundColor: tenantPrimaryColor }}
      >
        <Plus className="w-4 h-4" />
        <span>Agregar Dispositivo</span>
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
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">Añadir Nuevo Equipo</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Registrá el dispositivo en el parque del cliente.</p>
                </div>
              </div>

              {/* Botón para cerrar */}
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
                  Tipo de Equipo
                </label>
                <select 
                  name="type" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Server">Servidor</option>
                  <option value="Laptop">Laptop / Pc</option>
                  <option value="Printer">Impresora</option>
                  <option value="Network">Switch / Router</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Marca
                </label>
                <input 
                  type="text" 
                  name="brand" 
                  placeholder="Ej: Dell, Apple, HP" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Modelo
                </label>
                <input 
                  type="text" 
                  name="model" 
                  placeholder="Ej: PowerEdge R740, MacBook Pro 16" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Número de Serie
                </label>
                <input 
                  type="text" 
                  name="serialNumber" 
                  placeholder="Ej: DP7Z-88901" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500" 
                />
              </div>

              {/* Botones del Footer */}
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
                  <span>{isPending ? "Guardando..." : "Añadir Equipo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}