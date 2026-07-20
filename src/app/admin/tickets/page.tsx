import { TicketService } from "@/services/ticket.service";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { Wrench, ChevronRight, Building2, ShieldAlert } from "lucide-react";

export default async function AdminTicketsPage() {
  // Traemos todos los tickets de la plataforma sin filtro de tenant
  const tickets = await TicketService.getAllTicketsForAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera del Panel Técnico */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">Console Mode</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Panel de Control Técnico</h1>
            <p className="text-xs text-slate-400 mt-0.5">Bandeja de entrada unificada de incidencias de todos los clientes.</p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
            Modo: <span className="font-semibold text-white">Técnico / Admin</span>
          </div>
        </header>

        {/* Listado Global */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Todas las Solicitudes</h2>
              <p className="text-xs text-slate-400 mt-1">Gestión transversal de soporte e infraestructura.</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-400">
              Total: {tickets.length} tickets
            </span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {tickets.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic">
                No hay ningun ticket abierto en la plataforma actualmente.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-slate-800/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Badge con la Empresa (Tenant) */}
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        <Building2 className="w-3 h-3" />
                        {ticket.tenant.name}
                      </span>
                      <PriorityBadge priority={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>

                    <h3 className="font-semibold text-white text-base mt-1">{ticket.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{ticket.description}</p>
                    
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
                    className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 rounded-lg border border-amber-500/20 transition-all self-start md:self-center font-medium"
                  >
                    <span>Atender / Imputar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}