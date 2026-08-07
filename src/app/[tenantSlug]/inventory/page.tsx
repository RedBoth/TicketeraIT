/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EquipmentModal from "@/components/EquipmentModal";
import EquipmentTableRow from "@/components/EquipmentTableRow";
import { EquipmentService } from "@/services/equipment.service";
import { addEquipmentAction, updateEquipmentAction } from "@/actions/inventory.actions";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function InventoryPage({ params }: Props) {
  const { tenantSlug } = await params;
  const user = await getCurrentUser();
  const isTechnician = user?.role === "TECNICO" || user?.role === "SUPER_ADMIN";

  const tenant = await EquipmentService.getInventoryData(tenantSlug);

  if (!tenant) notFound();

  const handleAddEquipment = addEquipmentAction.bind(null, tenantSlug, tenant.id);
  const handleUpdateEquipment = updateEquipmentAction.bind(null, tenantSlug);

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
                    <th className="px-6 py-4">Dirección MAC</th>
                    <th className="px-6 py-4 text-center">Estado Casos</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                    {tenant.equipment.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                          No hay equipamiento registrado para esta compañía todavía.
                        </td>
                      </tr>
                    ) : (
                      tenant.equipment.map((item) => (
                        <EquipmentTableRow 
                          key={item.id}
                          item={item}
                          tenantSlug={tenantSlug}
                          isTechnician={isTechnician}
                          handleUpdateEquipment={handleUpdateEquipment}
                        />
                      ))
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