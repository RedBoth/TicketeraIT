import { TenantService } from "@/services/tenant.service";
import { getCurrentUser } from "@/lib/auth";
import CreateCompanyModal from "@/components/CreateCompanyModal";
import { createTenantAction } from "@/actions/tenant.actions";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ArrowRight, Laptop, Users, Building2 } from "lucide-react";

export default async function CompaniesPage() {
  const user = await getCurrentUser();
  const companies = await TenantService.getAllTenantsWithStats();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Reutilizable */}
      <Sidebar 
        tenantSlug="admin"
        tenantName="Control Center"
        tenantPrimaryColor="#f59e0b"
        tenantAccentColor="#f59e0b"
        currentPath="companies"
        userRole={user?.role}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header user={user} />
      {/* Contenido Principal (Lo marcado en el recuadro blanco) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header con Título y Botón Superior */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Empresas Registradas</h1>
              <p className="text-xs text-slate-400 mt-1">
                Lista de las empresas a las que se brinda servicio en la plataforma.
              </p>
            </div>

            {/* Botón arriba a la derecha para registrar empresa */}
            <CreateCompanyModal handleCreateTenant={createTenantAction} />
          </div>

          {/* Grilla de Tarjetas de Empresas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.length === 0 ? (
              <div className="col-span-full p-12 text-center text-slate-500 italic bg-slate-900 rounded-xl border border-slate-800">
                No hay empresas registradas en el sistema todavía.
              </div>
            ) : (
              companies.map((company) => (
                <div 
                  key={company.id} 
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700/60 transition-all shadow-xl group"
                >
                  <div>
                    {/* Cabecera de la Card */}
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-inner shrink-0"
                          style={{ backgroundColor: company.primaryColor || '#3b82f6' }}
                        >
                          {company.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors">
                            {company.name}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono">
                            slug: /{company.slug}
                          </span>
                        </div>
                      </div>

                      {/* Badge de Estado */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        • ACTIVE
                      </span>
                    </div>

                    {/* Métricas y Datos Clave de la Empresa */}
                    <div className="space-y-3 py-4 border-y border-slate-800/80 text-xs text-slate-300 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Laptop className="w-3.5 h-3.5 text-slate-500" />
                          Equipos Registrados
                        </span>
                        <span className="font-mono font-semibold text-white">
                          {company._count.equipment} nodos
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          Tickets Históricos
                        </span>
                        <span className="font-mono font-semibold text-white">
                          {company._count.tickets} casos
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          Usuarios Asignados
                        </span>
                        <span className="font-mono font-semibold text-white">
                          {company._count.users} usuarios
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Acción para entrar al Dashboard de esa empresa */}
                  <a
                    href={`/${company.slug}/dashboard`}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all border border-slate-700/50 group-hover:border-amber-500/30 group-hover:bg-amber-500/10 group-hover:text-amber-400"
                  >
                    <span>Ver Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
      </div>
    </div>
  );
}