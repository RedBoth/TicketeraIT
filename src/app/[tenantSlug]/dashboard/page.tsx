/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { TenantService } from "@/services/tenant.service";
import { getCurrentUser } from "@/lib/auth";
import { 
  Ticket as TicketIcon, 
  CheckCircle2,
  Clock,
  Wrench
} from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const user = await getCurrentUser();
  const { tenantSlug } = await params;

  // Consumimos el servicio unificado
  const data = await TenantService.getDashboardData(tenantSlug);

  if (!data) notFound();

  const { tenant, totalHours } = data;

  return (
    <div 
      className="flex min-h-screen bg-slate-950 text-slate-100 font-sans"
      style={{ 
        //@ts-ignore
        '--tenant-primary': tenant.primaryColor,
        '--tenant-accent': tenant.accentColor 
      }}
    >
      
      {/* SIDEBAR LATERAL */}
      <Sidebar 
        tenantSlug={tenantSlug}
        tenantName={tenant.name}
        tenantPrimaryColor={tenant.primaryColor}
        tenantAccentColor={tenant.accentColor}
        currentPath="dashboard"
        userRole={user?.role}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header user={user} />
      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard General</h1>
            <p className="text-xs text-slate-400 mt-0.5">Métricas de consumo e incidencias en tiempo real.</p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
            Cliente Activo: <span className="font-semibold text-white capitalize">{tenant.name}</span>
          </div>
        </header>

        {/* METRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard 
            title="Total Incidentes"
            value={`${tenant._count.tickets} Casos`}
            icon={<TicketIcon className="w-5 h-5" style={{ color: 'var(--tenant-primary)' }} />}
            subtext="Historial acumulado"
          />

          <MetricCard 
            title="Horas Consumidas"
            value={`${totalHours.toFixed(1)} hrs`}
            icon={<Clock className="w-5 h-5" style={{ color: 'var(--tenant-primary)' }} />}
            subtext="Dentro del abono mensual"
            subtextClass="text-emerald-400"
          />

          <MetricCard 
            title="Estado Global"
            value="Operativo"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            subtext="Todos los servicios activos"
            subtextClass="text-slate-500"
          />
        </div>

        {/* TABLA DE CASOS RECIENTES */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Tickets Recientes</h2>
            <p className="text-xs text-slate-400 mt-1">Últimas solicitudes de soporte técnico e infraestructura.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs font-semibold tracking-wider uppercase">
                  <th className="px-6 py-4">Asunto / Incidente</th>
                  <th className="px-6 py-4">Equipo Afectado</th>
                  <th className="px-6 py-4">Prioridad</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenant.tickets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                      No hay ningún ticket abierto para {tenant.name} actualmente.
                    </td>
                  </tr>
                ) : (
                  tenant.tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{ticket.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ticket.description}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {ticket.equipment ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Wrench className="w-3.5 h-3.5 text-slate-500" />
                            <span>{ticket.equipment.brand} {ticket.equipment.model}</span>
                            <span className="text-[10px] font-mono text-slate-500">({ticket.equipment.serialNumber})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Sin equipo asignado</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={ticket.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
      </div>
    </div>
  );
}