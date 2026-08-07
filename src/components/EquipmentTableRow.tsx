"use client";

import { useState } from "react";
import { Laptop, Server, Printer, Pencil, X, Save, Wrench } from "lucide-react";

interface EquipmentItem {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  macAddress?: string | null;
  _count: {
    tickets: number;
  };
}

interface EquipmentTableRowProps {
  item: EquipmentItem;
  tenantSlug: string;
  isTechnician: boolean;
  handleUpdateEquipment: (equipmentId: string, formData: FormData) => Promise<void>;
}

export default function EquipmentTableRow({
  item,
  isTechnician,
  handleUpdateEquipment,
}: EquipmentTableRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "server": return <Server className="w-4 h-4" />;
      case "printer": return <Printer className="w-4 h-4" />;
      default: return <Laptop className="w-4 h-4" />;
    }
  };

  const onEditSubmit = async (formData: FormData) => {
    try {
      setIsPending(true);
      setErrorMsg(null);
      await handleUpdateEquipment(item.id, formData);
      setIsPending(false);
      setIsEditOpen(false);
    } catch (err: any) {
      setIsPending(false);
      setErrorMsg(err.message || "Error al actualizar el equipo.");
    }
  };

  const activeTicketsCount = item._count.tickets;

  return (
    <>
      <tr className="hover:bg-slate-800/20 transition-colors">
        <td className="px-6 py-4 font-semibold text-white flex items-center gap-2.5">
          <span style={{ color: "var(--tenant-accent)" }}>{getIcon(item.type)}</span>
          {item.type}
        </td>
        <td className="px-6 py-4 text-slate-300">{item.brand}</td>
        <td className="px-6 py-4 text-slate-300">{item.model}</td>
        <td className="px-6 py-4 font-mono text-[12px] text-slate-400">{item.serialNumber}</td>
        <td className="px-6 py-4 font-mono text-[12px] text-slate-400">
          {item.macAddress || <span className="text-slate-600 font-sans italic">N/D</span>}
        </td>
        <td className="px-6 py-4 text-center">
          {activeTicketsCount > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {activeTicketsCount} {activeTicketsCount === 1 ? "Caso Activo" : "Casos Activos"}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              0 Activos
            </span>
          )}
        </td>

        {/* Columna Acciones */}
        <td className="px-6 py-4 text-right">
          {!isTechnician && (
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              title="Editar Equipamiento"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </td>
      </tr>

      {/* MODAL DE EDICIÓN DE EQUIPO */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">Editar Equipamiento</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Modificar especificaciones o credenciales del dispositivo.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsEditOpen(false)}
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
            <form action={onEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Tipo de Dispositivo
                </label>
                <select 
                  name="type" 
                  defaultValue={item.type}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Laptop">Laptop / Notebook</option>
                  <option value="Desktop">PC de Escritorio</option>
                  <option value="Server">Servidor</option>
                  <option value="Printer">Impresora / Multifunción</option>
                  <option value="Networking">Switch / Router / AP</option>
                  <option value="Otro">Otro Dispositivo</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Marca
                  </label>
                  <input 
                    type="text" 
                    name="brand" 
                    defaultValue={item.brand} 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Modelo
                  </label>
                  <input 
                    type="text" 
                    name="model" 
                    defaultValue={item.model} 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Número de Serie
                  </label>
                  <input 
                    type="text" 
                    name="serialNumber" 
                    defaultValue={item.serialNumber} 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Dirección MAC (Opcional)
                  </label>
                  <input 
                    type="text" 
                    name="macAddress" 
                    defaultValue={item.macAddress || ""} 
                    placeholder="Ej: 00:1B:44:11:3A:B7" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono" 
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? "Guardando..." : "Guardar Cambios"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}