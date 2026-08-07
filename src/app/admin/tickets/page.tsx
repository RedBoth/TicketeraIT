import Link from "next/link";
import { TicketService } from "@/services/ticket.service";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { 
  Building2, 
  ChevronRight, 
  Ticket as TicketIcon, 
  Activity, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

export default async function AdminTicketsPage() {
  const user = await getCurrentUser();
  const tickets = await TicketService.getAllTicketsForAdmin();
  const metrics = await TicketService.getAdminDashboardMetrics();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Reutilizable */}
      <Sidebar 
        tenantSlug="admin"
        tenantName="Control Center"
        tenantPrimaryColor="#f59e0b"
        tenantAccentColor="#f59e0b"
        currentPath="tickets"
        userRole={user?.role}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header user={user} />
      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Tickets</h1>
              <p className="text-xs text-slate-400 mt-1">
                Bandeja de entrada unificada para monitorear y gestionar todas las incidencias de la plataforma.
              </p>
            </div>
            
            <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg font-mono">
              Total Histórico: <span className="font-bold text-amber-400">{tickets.length}</span> casos
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Tickets Activos"
              value={metrics.totalActive}
              icon={<Activity className="w-5 h-5 text-blue-400" />}
              subtext="En proceso de resolución"
            />

            <MetricCard 
              title="Nuevos / Por Atender"
              value={metrics.totalPending}
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              subtext="Esperando asignación"
              subtextClass="text-amber-400/80 font-medium"
            />

            <MetricCard 
              title="Prioridad Crítica"
              value={metrics.totalCritical}
              icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
              subtext="Requieren atención inmediata"
              subtextClass="text-red-400 font-medium"
            />
          </div>

          {/* Tabla de Tickets */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {tickets.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic flex flex-col items-center gap-2">
                <TicketIcon className="w-8 h-8 text-slate-600" />
                <span>No hay tickets abiertos en la plataforma actualmente.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6 font-semibold">Cliente / Empresa</th>
                      <th className="py-3.5 px-6 font-semibold">Asunto</th>
                      <th className="py-3.5 px-6 font-semibold">Estado</th>
                      <th className="py-3.5 px-6 font-semibold">Prioridad</th>
                      <th className="py-3.5 px-6 font-semibold">Fecha</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {tickets.map((ticket) => (
                      <tr 
                        key={ticket.id} 
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        {/* Empresa / Tenant */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                            <Building2 className="w-3.5 h-3.5" />
                            {ticket.tenant.name}
                          </span>
                        </td>

                        {/* Título y Descripción */}
                        <td className="py-4 px-6 max-w-md">
                          <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                            {ticket.title}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {ticket.description}
                          </p>
                        </td>

                        {/* Estado */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <StatusBadge status={ticket.status} />
                        </td>

                        {/* Prioridad */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <PriorityBadge priority={ticket.priority} />
                        </td>

                        {/* Fecha */}
                        <td className="py-4 px-6 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                          {new Date(ticket.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>

                        {/* Botón de Acción */}
                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          {ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? (
                            <Link 
                              href={`/${ticket.tenant.slug}/tickets/${ticket.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-all"
                            >
                              <span>Ver detalles</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </Link>
                          ) : (
                            <Link 
                              href={`/${ticket.tenant.slug}/tickets/${ticket.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all"
                            >
                              <span>Atender Ticket</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>
      </main>
      </div>
    </div>
  );
}