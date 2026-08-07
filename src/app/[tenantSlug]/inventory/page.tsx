/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EquipmentModal from "@/components/EquipmentModal";
import { EquipmentService } from "@/services/equipment.service";
import { addEquipmentAction } from "@/actions/inventory.actions";
import { Laptop, Server, Printer } from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function InventoryPage({ params }: Props) {
  const { tenantSlug } = await params;
  const user = await getCurrentUser();
  const isTechnician = user?.role === "TECNICO" || user?.role === "SUPER_ADMIN";

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
      className="flex min-h-screen bg-slate-950 text-slate-100 font-sans"
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
        userRole={user?.role}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header user={user} />
      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* HEADER PRINCIPAL */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Inventario de {tenant.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {isTechnician 
                  ? `Auditoría del parque de infraestructura asignado a ${tenant.name}.` 
                  : `Hardware y dispositivos registrados bajo el soporte de ${tenant.name}.`}
              </p>
            </div>

            {/* CONDICIONAL DE BOTÓN/MODAL SEGÚN ROL */}
            {isTechnician ? (
              <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                Auditoría (Solo Lectura)
              </span>
            ) : (
              <EquipmentModal 
                handleAddEquipment={handleAddEquipment} 
                tenantPrimaryColor={tenant.primaryColor}
              />
            )}
          </div>

          {/* LISTADO DE INVENTARIO */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white">Dispositivos Registrados</h2>
                <p className="text-xs text-slate-400 mt-0.5">Listado detallado para trazabilidad de soporte.</p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-md">
                Total: {tenant.equipment.length} equipos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs font-semibold tracking-wider uppercase font-mono">
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Marca</th>
                    <th className="px-6 py-4">Modelo</th>
                    <th className="px-6 py-4">Nº Serie</th>
                    <th className="px-6 py-4 text-center">Estado Casos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
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
                          <td className="px-6 py-4 font-semibold text-white flex items-center gap-2.5">
                            <span style={{ color: 'var(--tenant-accent)' }}>{getIcon(item.type)}</span>
                            {item.type}
                          </td>
                          <td className="px-6 py-4 text-slate-300">{item.brand}</td>
                          <td className="px-6 py-4 text-slate-300">{item.model}</td>
                          <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{item.serialNumber}</td>
                          <td className="px-6 py-4 text-center">
                            {activeTicketsCount > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {activeTicketsCount} {activeTicketsCount === 1 ? "Caso Activo" : "Casos Activos"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

        </div>
      </main>
      </div>
    </div>
  );
}