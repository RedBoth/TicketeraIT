import { TicketService } from "@/services/ticket.service";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import MetricCard from "@/components/MetricCard";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Wrench,
  Activity
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const metrics = await TicketService.getAdminDashboardMetrics();
  const criticalAlerts = await TicketService.getCriticalAlerts();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Reutilizable */}
      <Sidebar 
        tenantSlug="admin"
        tenantName="Control Center"
        tenantPrimaryColor="#f59e0b"
        tenantAccentColor="#f59e0b"
        currentPath="dashboard"
        userRole={user?.role}
      />

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Live System Status
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Métricas globales e incidencias activas en la infraestructura de todos los clientes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/admin/tickets" 
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs px-4 py-2.5 rounded-lg transition-all"
              >
                Ver Todos los Tickets
              </Link>
            </div>
          </div>

          {/* Tarjetas de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Tickets Activos"
              value={metrics.totalActive}
              icon={<Activity className="w-5 h-5 text-blue-400" />}
              subtext="Total de casos en atención actualmente"
            />

            <MetricCard 
              title="Nuevos / Pendientes"
              value={metrics.totalPending}
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              subtext="• Requieren primera atención"
              subtextClass="text-amber-400/80 font-medium"
            />

            <MetricCard 
              title="Fallos Críticos"
              value={metrics.totalCritical}
              icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
              subtext="Prioridad máxima / Crítica"
              subtextClass="text-red-400 font-medium"
            />
          </div>

          {/* Sección Principal: Alertas y Tickets Críticos / Nuevos */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Alertas Críticas & Incidentes Prioritarios</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Casos urgentes que requieren acción inmediata.</p>
                </div>
              </div>
              <Link 
                href="/admin/tickets" 
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <span>Ver Todos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/60">
              {criticalAlerts.length === 0 ? (
                <div className="p-12 text-center text-slate-500 italic flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/60" />
                  <span>No hay alertas críticas ni tickets urgentes pendientes en este momento.</span>
                </div>
              ) : (
                criticalAlerts.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="p-6 hover:bg-slate-800/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Tenant Label */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                          <Building2 className="w-3 h-3" />
                          {ticket.tenant.name}
                        </span>
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                      </div>

                      <h3 className="font-semibold text-white text-base">{ticket.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{ticket.description}</p>
                      
                      {ticket.equipment && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Equipo: <strong>{ticket.equipment.brand} {ticket.equipment.model}</strong></span>
                          <span className="font-mono text-[11px]">({ticket.equipment.serialNumber})</span>
                        </div>
                      )}
                    </div>
                    
                    <a 
                      href={`/${ticket.tenant.slug}/tickets/${ticket.id}`} 
                      className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2.5 rounded-lg border border-amber-500/20 transition-all self-start md:self-center shrink-0"
                    >
                      <span>Atender Ticket</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}