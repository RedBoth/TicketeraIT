/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { EquipmentService } from "@/services/equipment.service";
import { addEquipmentAction } from "@/actions/inventory.actions";
import { Laptop, Server, Printer, Cpu, PlusCircle } from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function InventoryPage({ params }: Props) {
  const { tenantSlug } = await params;

  // 1. Consumimos el servicio para traer datos
  const tenant = await EquipmentService.getInventoryData(tenantSlug);

  if (!tenant) notFound();

  // 2. Preparamos la Server Action inyectando el slug y ID de forma segura mediante bind
  const handleAddEquipment = addEquipmentAction.bind(null, tenantSlug, tenant.id);

  // Helper de UI para iconos
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "server": return <Server className="w-4 h-4" />;
      case "printer": return <Printer className="w-4 h-4" />;
      default: return <Laptop className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="flex min-h-screen bg-slate-950 text-slate-100"
      style={{ 
        //@ts-ignore
        '--tenant-primary': tenant.primaryColor,
        '--tenant-accent': tenant.accentColor 
      }}
    >
      {/* SIDEBAR REUTILIZABLE */}
      <Sidebar 
        tenantSlug={tenantSlug}
        tenantName={tenant.name}
        tenantPrimaryColor={tenant.primaryColor}
        tenantAccentColor={tenant.accentColor}
        currentPath="inventory"
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUMNA 1: FORMULARIO DE CARGA */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <Cpu className="w-5 h-5" style={{ color: 'var(--tenant-primary)' }} />
            <h2 className="text-base font-bold text-white">Añadir / Editar Equipo</h2>
          </div>

          <form action={handleAddEquipment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipo de Equipo</label>
              <select name="type" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                <option value="Server">Servidor</option>
                <option value="Laptop">Laptop / Pc</option>
                <option value="Printer">Impresora</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marca</label>
              <input type="text" name="brand" placeholder="Ej: Dell, Apple, HP" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Modelo</label>
              <input type="text" name="model" placeholder="Ej: PowerEdge R740, MacBook Pro 16" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número de Serie</label>
              <input type="text" name="serialNumber" placeholder="Ej: DP7Z-88901" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" />
            </div>

            <button 
              type="submit" 
              className="w-full text-white font-medium text-sm px-4 py-3 rounded-lg flex items-center justify-center gap-2 mt-2 shadow-lg hover:brightness-110 transition-all"
              style={{ backgroundColor: 'var(--tenant-primary)' }}
            >
              <PlusCircle className="w-4 h-4" />
              Añadir Equipo
            </button>
          </form>
        </section>

        {/* COLUMNA 2 y 3: TABLA LISTADO DE INVENTARIO */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Inventario de Equipos</h2>
            <p className="text-xs text-slate-400 mt-1">Hardware registrado bajo el soporte corporativo de {tenant.name}.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs font-semibold tracking-wider uppercase">
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Marca</th>
                  <th className="px-6 py-4">Modelo</th>
                  <th className="px-6 py-4">Nº Serie</th>
                  <th className="px-6 py-4 text-center">Estado Casos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenant.equipment.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                      No hay equipamiento registrado para esta compañía todavía.
                    </td>
                  </tr>
                ) : (
                  tenant.equipment.map((item) => {
                    const activeTicketsCount = item._count.tickets;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2.5">
                          <span style={{ color: 'var(--tenant-accent)' }}>{getIcon(item.type)}</span>
                          {item.type}
                        </td>
                        <td className="px-6 py-4 text-slate-300">{item.brand}</td>
                        <td className="px-6 py-4 text-slate-300">{item.model}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.serialNumber}</td>
                        <td className="px-6 py-4 text-center">
                          {activeTicketsCount > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {activeTicketsCount} {activeTicketsCount === 1 ? "Caso Activo" : "Casos Activos"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              0 Activos
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}