/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { TicketService } from "@/services/ticket.service";
import { createTicketAction } from "@/actions/ticket.actions";
import { Ticket as TicketIcon, PlusCircle, Wrench, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function TicketsPage({ params }: Props) {
  const { tenantSlug } = await params;

  // 1. Consumimos el servicio unificado para traer toda la data relacional
  const tenant = await TicketService.getTicketsPageData(tenantSlug);

  if (!tenant) notFound();

  // 2. Preparamos la Server Action pasando los parámetros contextuales de forma segura
  const handleCreateTicket = createTicketAction.bind(null, tenantSlug, tenant.id);

  return (
    <div 
      className="flex min-h-screen bg-slate-950 text-slate-100"
      style={{ 
        //@ts-ignore
        '--tenant-primary': tenant.primaryColor,
        '--tenant-accent': tenant.accentColor 
      }}
    >
      {/* SIDEBAR Reutilizable */}
      <Sidebar 
        tenantSlug={tenantSlug}
        tenantName={tenant.name}
        tenantPrimaryColor={tenant.primaryColor}
        tenantAccentColor={tenant.accentColor}
        currentPath="tickets"
      />

      {/* CONTENIDO */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* FORMULARIO DE INGRESO DE TICKETS */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <TicketIcon className="w-5 h-5" style={{ color: 'var(--tenant-primary)' }} />
            <h2 className="text-base font-bold text-white">Abrir Nuevo Ticket</h2>
          </div>

          <form action={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Asunto / Incidente</label>
              <input type="text" name="title" placeholder="Ej: Error de conexión a la VPN" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descripción del Problema</label>
              <textarea name="description" rows={4} placeholder="Detallá lo más posible el inconveniente..." required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Prioridad</label>
              <select name="priority" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Equipo Afectado (Opcional)</label>
              <select name="equipmentId" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                <option value="none">Sin equipo asociado</option>
                {tenant.equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.type} - {eq.brand} {eq.model} ({eq.serialNumber})
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full text-white font-medium text-sm px-4 py-3 rounded-lg flex items-center justify-center gap-2 mt-2 shadow-lg hover:brightness-110 transition-all"
              style={{ backgroundColor: 'var(--tenant-primary)' }}
            >
              <PlusCircle className="w-4 h-4" />
              Enviar Solicitud
            </button>
          </form>
        </section>

        {/* LISTADO DE TICKETS DE LA SECCIÓN */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Historial Técnico Compaginado</h2>
            <p className="text-xs text-slate-400 mt-1">Todos los tickets abiertos y cerrados para {tenant.name}.</p>
          </div>

          <div className="divide-y divide-slate-800/60">
            {tenant.tickets.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic">
                No hay registros de tickets creados.
              </div>
            ) : (
              tenant.tickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-slate-800/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white text-base">{ticket.title}</h3>
                      <PriorityBadge priority={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{ticket.description}</p>
                    
                    {ticket.equipment && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Hardware afectado: <strong>{ticket.equipment.brand} {ticket.equipment.model}</strong></span>
                        <span className="font-mono text-[11px]">({ticket.equipment.serialNumber})</span>
                      </div>
                    )}
                  </div>
                  
                  <a 
                    href={`/${tenantSlug}/tickets/${ticket.id}`} 
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-white bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-all self-start md:self-center cursor-pointer"
                  >
                    <span>Ver Detalles</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}