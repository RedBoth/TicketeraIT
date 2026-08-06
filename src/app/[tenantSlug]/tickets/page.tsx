/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import CreateTicketModal from "@/components/CreateTicketModal";
import { TicketService } from "@/services/ticket.service";
import { createTicketAction } from "@/actions/ticket.actions";
import { Ticket as TicketIcon, Wrench, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function TicketsPage({ params }: Props) {
  const { tenantSlug } = await params;
  const user = await getCurrentUser();
  const isTechnician = user?.role === "TECNICO" || user?.role === "SUPER_ADMIN";
  const tenant = await TicketService.getTicketsPageData(tenantSlug);
  if (!tenant) notFound();
  const handleCreateTicket = createTicketAction.bind(null, tenantSlug, tenant.id);

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
        currentPath="tickets"
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
                {isTechnician ? "Tickets del Tenant" : "Mis Tickets"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {isTechnician 
                  ? `Monitoreo de solicitudes e incidencias creadas por ${tenant.name}.` 
                  : `Historial de solicitudes de soporte para ${tenant.name}.`}
              </p>
            </div>

            {/* CONDICIONAL: TÉCNICO EN MODO AUDITORÍA VS CLIENTE CON MODAL */}
            {isTechnician ? (
              <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                Auditoría (Solo Lectura)
              </span>
            ) : (
              <CreateTicketModal 
                handleCreateTicket={handleCreateTicket} 
                equipmentList={tenant.equipment}
                tenantPrimaryColor={tenant.primaryColor}
              />
            )}
          </div>

          {/* LISTADO DE TICKETS */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-5 h-5" style={{ color: 'var(--tenant-primary)' }} />
                <div>
                  <h2 className="text-base font-bold text-white">Historial de Incidencias</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Seguimiento en tiempo real del estado de cada caso.</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-md">
                Total: {tenant.tickets.length} tickets
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {tenant.tickets.length === 0 ? (
                <div className="p-12 text-center text-slate-500 italic">
                  No hay registros de tickets creados para esta empresa todavía.
                </div>
              ) : (
                tenant.tickets.map((ticket) => (
                  <div key={ticket.id} className="p-6 hover:bg-slate-800/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(ticket.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </span>
                      </div>

                      <h3 className="font-semibold text-white text-base mt-1">{ticket.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{ticket.description}</p>
                      
                      {ticket.equipment && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Hardware afectado: <strong>{ticket.equipment.brand} {ticket.equipment.model}</strong></span>
                          <span className="font-mono text-[11px]">({ticket.equipment.serialNumber})</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Lógica dinámica de acción según Rol y Estado del Ticket */}
                    {(() => {
                      const isTicketPending = ticket.status !== "RESOLVED" && ticket.status !== "CLOSED";
                      const shouldShowAttend = isTechnician && isTicketPending;

                      return (
                        <Link 
                          href={`/${tenantSlug}/tickets/${ticket.id}`} 
                          className={`flex items-center gap-2 text-xs transition-all self-start md:self-center px-4 py-2.5 rounded-lg border ${
                            shouldShowAttend
                              ? "font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 shadow-md"
                              : "font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border-slate-800"
                          }`}
                        >
                          <span>{shouldShowAttend ? "Atender Ticket" : "Ver detalles"}</span>
                          <ChevronRight className={`w-3.5 h-3.5 ${shouldShowAttend ? "text-amber-400" : "text-slate-400"}`} />
                        </Link>
                      );
                    })()}
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
      </div>
    </div>
  );
}