import { notFound } from "next/navigation";
import { TicketService } from "@/services/ticket.service";
import { addWorkLogAction } from "@/actions/ticket.actions";
import { Clock, ArrowLeft, Plus, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string; ticketId: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const { tenantSlug, ticketId } = await params;

  // 1. Obtenemos la data mediante el servicio desacoplado
  const ticket = await TicketService.getTicketDetails(ticketId);

  if (!ticket) notFound();

  // 2. Preparamos la Server Action usando bind
  const handleAddWorkLog = addWorkLogAction.bind(null, tenantSlug, ticket.id);

  // Calculamos el total de horas acumuladas en este ticket
  const totalHours = ticket.workLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Retorno */}
        <a href={`/${tenantSlug}/tickets`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </a>

        {/* Cabecera del caso */}
        <header className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
              Caso: {ticket.id.substring(0,8)}
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">{ticket.title}</h1>
            <p className="text-sm text-slate-400 mt-1">{ticket.description}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-lg text-center min-w-[140px]">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Horas</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{totalHours.toFixed(1)} hrs</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Carga de Horas */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Imputar Tiempo
            </h2>
            <form action={handleAddWorkLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Horas Dedicadas</label>
                <input 
                  type="number" 
                  name="hours" 
                  step="0.1" 
                  placeholder="Ej: 1.5" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Descripción de la Tarea</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  placeholder="Detallá qué reparación o mantenimiento hiciste..." 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" /> Registrar Horas
              </button>
            </form>
          </section>

          {/* Historial de Tareas / Logs */}
          <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Línea de Tiempo del Soporte</h2>
            </div>
            <div className="divide-y divide-slate-800/60">
              {ticket.workLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 italic text-sm">
                  No se computaron horas sobre este incidente todavía.
                </div>
              ) : (
                ticket.workLogs.map((log) => (
                  <div key={log.id} className="p-5 hover:bg-slate-800/10 transition-colors flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-200">{log.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono text-xs font-bold whitespace-nowrap">
                      +{log.hours.toFixed(1)} hrs
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}