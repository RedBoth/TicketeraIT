/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { TicketService } from "@/services/ticket.service";
import { resolveTicketAction } from "@/actions/ticket.actions";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { 
  Building2, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  User, 
  FileText, 
  Send 
} from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string; ticketId: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const { tenantSlug, ticketId } = await params;
  const user = await getCurrentUser();
  const isTechnician = user?.role === "TECNICO" || user?.role === "SUPER_ADMIN";

  const ticket = await TicketService.getTicketDetails(ticketId);

  if (!ticket) notFound();

  const handleResolveTicket = resolveTicketAction.bind(null, ticket.id, tenantSlug);

  const totalHoursLogged = ticket.workLogs.reduce((acc, log) => acc + log.hours, 0);

  return (
    <div 
      className="flex min-h-screen bg-slate-950 text-slate-100 font-sans"
      style={{ 
        //@ts-ignore
        '--tenant-primary': ticket.tenant.primaryColor,
        '--tenant-accent': ticket.tenant.accentColor 
      }}
    >
      {/* SIDEBAR REUTILIZABLE */}
      <Sidebar 
        tenantSlug={tenantSlug}
        tenantName={ticket.tenant.name}
        tenantPrimaryColor={ticket.tenant.primaryColor}
        tenantAccentColor={ticket.tenant.accentColor}
        currentPath="tickets"
        userRole={user?.role}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header user={user} />
      {/* CONTENIDO PRINCIPAL EN 2 COLUMNAS */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* HEADER DEL TICKET */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
                  <Building2 className="w-3.5 h-3.5" />
                  {ticket.tenant.name}
                </span>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{ticket.title}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Reportado por: <strong>{ticket.user.name || ticket.user.email}</strong></span>
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center gap-4 self-start md:self-center">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Horas Invertidas</span>
                <span className="text-lg font-bold font-mono text-amber-400">{totalHoursLogged} hs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA (2 COLS): DETALLES E HISTORIAL WORKLOGS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* DESCRIPCIÓN Y EQUIPO ASOCIADO */}
              <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Detalle de la Solicitud</span>
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {ticket.description}
                </p>

                {ticket.equipment && (
                  <div className="mt-4 p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3 text-xs">
                    <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block">Equipo Asignado:</span>
                      <strong className="text-white">{ticket.equipment.brand} {ticket.equipment.model}</strong>
                      <span className="font-mono text-slate-500 ml-2">({ticket.equipment.serialNumber})</span>
                    </div>
                  </div>
                )}
              </section>

              {/* TIMELINE / HISTORIAL DE INTERVENCIONES */}
              <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Historial de Intervenciones ({ticket.workLogs.length})</span>
                </h2>

                {ticket.workLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    Aún no hay intervenciones ni registro de horas cargadas en este ticket.
                  </p>
                ) : (
                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                    {ticket.workLogs.map((log) => (
                      <div key={log.id} className="relative pl-8 space-y-1">
                        <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-900" />
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-amber-400 font-mono">+{log.hours} hs Imputadas</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {new Date(log.createdAt).toLocaleDateString("es-AR", {
                                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{log.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* COLUMNA DERECHA (1 COL): ATENDER TICKET (SOLO TÉCNICO) VS RESUMEN CLIENTE */}
            <div className="lg:col-span-1">
              {isTechnician ? ( ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" ? (
                /* FORMULARIO DE RESOLUCIÓN EXCLUSIVO PARA TÉCNICOS */
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl sticky top-8 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    <h2 className="text-sm font-bold text-white">Atender e Imputar Horas</h2>
                  </div>

                  <form action={handleResolveTicket} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Horas Trabajadas
                      </label>
                      <input 
                        type="number" 
                        name="hours" 
                        step="0.5" 
                        min="0.5" 
                        placeholder="Ej: 1.5" 
                        required 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Estado del Ticket
                      </label>
                      <select 
                        name="status" 
                        defaultValue="RESOLVED"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="RESOLVED">Resuelto / Completado</option>
                        <option value="CLOSED">Cerrado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Nota / Solución Aplicada
                      </label>
                      <textarea 
                        name="description" 
                        rows={4} 
                        placeholder="Describe qué trabajo se realizó o cómo se solucionó la falla..." 
                        required 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Registrar Trabajo y Guardar</span>
                    </button>
                  </form>
                </section>
              ) : (
                  /* SI ES TÉCNICO PERO EL TICKET YA FUE RESUELTO/CERRADO */
                  <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl sticky top-8 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <h2 className="text-sm font-bold text-white">Incidencia Finalizada</h2>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Este ticket se encuentra cerrado o resuelto. No se pueden seguir imputando horas de trabajo.
                    </p>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-xs text-center font-semibold">
                      Estado Actual: {ticket.status}
                    </div>
                  </section>
                )
              ): (
                /* VISTA PARA CLIENTE FINAL */
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl sticky top-8 space-y-4 text-xs">
                  <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                    Estado de tu Solicitud
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Nuestros técnicos están trabajando en este caso. Podrás seguir los avances y las horas asignadas desde la línea de tiempo.
                  </p>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                    SLA Activo: <strong className="text-amber-400">Atención Garantizada</strong>
                  </div>
                </section>
              )}
            </div>

          </div>

        </div>
      </main>
      </div>
    </div>
  );
}