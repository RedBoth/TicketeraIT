import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Laptop, 
  Settings, 
  LogOut,
  Building2,
  ArrowLeft,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import Link from "next/link";

interface SidebarProps {
  tenantSlug: string;
  tenantName: string;
  tenantPrimaryColor: string;
  tenantAccentColor: string;
  currentPath: "dashboard" | "tickets" | "inventory" | "settings" | "companies";
  userRole?: string;
}

export default function Sidebar({ 
  tenantSlug, 
  tenantName, 
  tenantPrimaryColor, 
  tenantAccentColor,
  currentPath,
  userRole
}: SidebarProps) {

  const isTechnician = userRole === "TECNICO" || userRole === "SUPER_ADMIN";
  const isInAdminConsole = tenantSlug === "admin";

  const linkClass = (path: typeof currentPath) => {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all";
    return currentPath === path
      ? `${base} bg-slate-800 text-white font-semibold`
      : `${base} text-slate-400 hover:bg-slate-800/50 hover:text-slate-200`;
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky h-screen top-0 select-none shrink-0">
      <div>
        
        {/* BOTÓN DE RETORNO */}
        {isTechnician && !isInAdminConsole && (
          <div className="mb-4">
            <Link 
              href="/admin/companies" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Compañías</span>
            </Link>
          </div>
        )}

        {/* Branding Principal del Tenant o del Control Center */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800 mb-6">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0"
            style={{ backgroundColor: tenantPrimaryColor }}
          >
            {tenantName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-semibold text-white leading-tight truncate capitalize">
              {tenantName}
            </h2>
            
            {/* Badge de Rol y Contexto */}
            <div className="flex items-center gap-1 mt-1">
              {isTechnician ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  {isInAdminConsole ? "TÉCNICO / ADMIN" : "MODO AUDITORÍA"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  <UserCheck className="w-3 h-3 text-slate-500" />
                  CLIENTE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navegación Adaptativa */}
        <nav className="space-y-1">
          
          {/* Dashboard */}
          <Link 
            href={isInAdminConsole ? "/admin/dashboard" : `/${tenantSlug}/dashboard`} 
            className={linkClass("dashboard")}
          >
            <LayoutDashboard 
              className="w-4 h-4" 
              style={{ color: currentPath === "dashboard" ? tenantAccentColor : "#64748b" }} 
            />
            <span>Dashboard</span>
          </Link>

          {/* Tickets */}
          <Link 
            href={isInAdminConsole ? "/admin/tickets" : `/${tenantSlug}/tickets`} 
            className={linkClass("tickets")}
          >
            <TicketIcon 
              className="w-4 h-4" 
              style={{ color: currentPath === "tickets" ? tenantAccentColor : "#64748b" }} 
            />
            <span>{isInAdminConsole ? "Todos los Tickets" : isTechnician ? "Tickets Tenant" : "Mis Tickets"}</span>
          </Link>

          {/* Equipamiento */}
          {!isInAdminConsole && (
            <Link href={`/${tenantSlug}/inventory`} className={linkClass("inventory")}>
              <Laptop 
                className="w-4 h-4" 
                style={{ color: currentPath === "inventory" ? tenantAccentColor : "#64748b" }} 
              />
              <span>{isTechnician ? "Equipamiento Tenant" : "Mi Equipamiento"}</span>
            </Link>
          )}

          {/* Compañías */}
          {isTechnician && (
            <Link href="/admin/companies" className={linkClass("companies")}>
              <Building2 
                className="w-4 h-4" 
                style={{ color: currentPath === "companies" ? tenantAccentColor : "#64748b" }} 
              />
              <span>Todas las Compañías</span>
            </Link>
          )}

          {/* Configuración */}
          <a href="#" className={linkClass("settings")}>
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Configuración</span>
          </a>

        </nav>
      </div>

      {/* Botón de Logout */}
      <form action={logoutAction} className="mt-auto pt-4 border-t border-slate-800/60">
        <button 
          type="submit" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-950/20 hover:text-red-400 w-full transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </form>
    </aside>
  );
}