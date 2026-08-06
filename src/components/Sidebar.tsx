import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Laptop, 
  Settings, 
  LogOut,
  Building2,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Users
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import Link from "next/link";

interface SidebarProps {
  tenantSlug: string;
  tenantName: string;
  tenantPrimaryColor: string;
  tenantAccentColor: string;
  currentPath: "dashboard" | "tickets" | "inventory" | "settings" | "companies" | "users";
  userRole?: string;
}

export default function Sidebar({ 
  tenantSlug, 
  tenantName, 
  tenantPrimaryColor, 
  currentPath,
  userRole
}: SidebarProps) {

  const isTechnician = userRole === "TECNICO" || userRole === "SUPER_ADMIN";
  const isInAdminConsole = tenantSlug === "admin";

  const linkClass = (isActive: boolean) => {
    const base = "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all";
    return isActive
      ? `${base} bg-slate-800 text-white font-semibold`
      : `${base} text-slate-400 hover:bg-slate-800/50 hover:text-slate-200`;
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky h-screen top-0 select-none shrink-0 overflow-y-auto">
      <div className="space-y-6">
        
        {/* BRANDING CABECERA */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-800">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0"
            style={{ backgroundColor: isInAdminConsole ? '#f59e0b' : tenantPrimaryColor }}
          >
            {isInAdminConsole ? "CO" : tenantName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white leading-tight truncate">
              {isInAdminConsole ? "Control Center" : tenantName}
            </h2>
            
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

        {/* SI ES CLIENTE FINAL: Menú simple tradicional */}
        {!isTechnician && (
          <nav className="space-y-1">
            <Link href={`/${tenantSlug}/dashboard`} className={linkClass(currentPath === "dashboard")}>
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
            </Link>
            <Link href={`/${tenantSlug}/tickets`} className={linkClass(currentPath === "tickets")}>
              <TicketIcon className="w-4 h-4 text-slate-400" />
              <span>Mis Tickets</span>
            </Link>
            <Link href={`/${tenantSlug}/inventory`} className={linkClass(currentPath === "inventory")}>
              <Laptop className="w-4 h-4 text-slate-400" />
              <span>Mi Equipamiento</span>
            </Link>
            <Link href={`/${tenantSlug}/settings`} className={linkClass(currentPath === "settings")}>
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Configuración</span>
            </Link>
          </nav>
        )}

        {/* SI ES TÉCNICO: Menú Global Superior + Sección Inferior del Tenant */}
        {isTechnician && (
          <div className="space-y-6">
            
            {/* 1. SECCIÓN GLOBAL (ADMIN) */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-3 block mb-1">
                Global Console
              </span>
              <Link href="/admin/dashboard" className={linkClass(isInAdminConsole && currentPath === "dashboard")}>
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Dashboard General</span>
              </Link>
              <Link href="/admin/tickets" className={linkClass(isInAdminConsole && currentPath === "tickets")}>
                <TicketIcon className="w-4 h-4 text-amber-400" />
                <span>Todos los Tickets</span>
              </Link>
              <Link href="/admin/companies" className={linkClass(isInAdminConsole && currentPath === "companies")}>
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Todas las Compañías</span>
              </Link>
              <Link href={`/${tenantSlug}/settings`} className={linkClass(currentPath === "settings")}>
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Configuración</span>
              </Link>
            </div>

            {/* 2. SECCIÓN DEL TENANT (Solo aparece cuando está inspeccionando una empresa en particular) */}
            {!isInAdminConsole && (
              <div className="pt-4 border-t border-slate-800 space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-3 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block truncate">
                    Auditoría: {tenantName}
                  </span>
                  <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />
                </div>

                <Link href={`/${tenantSlug}/dashboard`} className={linkClass(!isInAdminConsole && currentPath === "dashboard")}>
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span className="truncate">Dashboard {tenantName}</span>
                </Link>

                <Link href={`/${tenantSlug}/tickets`} className={linkClass(!isInAdminConsole && currentPath === "tickets")}>
                  <TicketIcon className="w-4 h-4 text-indigo-400" />
                  <span className="truncate">Tickets {tenantName}</span>
                </Link>

                <Link href={`/${tenantSlug}/inventory`} className={linkClass(!isInAdminConsole && currentPath === "inventory")}>
                  <Laptop className="w-4 h-4 text-indigo-400" />
                  <span className="truncate">Equipamiento {tenantName}</span>
                </Link>

                <Link href={`/${tenantSlug}/users`} className={linkClass(!isInAdminConsole && currentPath === "users")}>
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="truncate">Usuarios {tenantName}</span>
                </Link>
              </div>
            )}

          </div>
        )}

      </div>

      {/* BOTÓN DE CERRAR SESIÓN */}
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