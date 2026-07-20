import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Laptop, 
  Settings, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  tenantSlug: string;
  tenantName: string;
  tenantPrimaryColor: string;
  tenantAccentColor: string;
  currentPath: "dashboard" | "tickets" | "inventory" | "settings";
}

export default function Sidebar({ 
  tenantSlug, 
  tenantName, 
  tenantPrimaryColor, 
  tenantAccentColor,
  currentPath 
}: SidebarProps) {
  
  const linkClass = (path: typeof currentPath) => {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all";
    return currentPath === path
      ? `${base} bg-slate-800 text-white`
      : `${base} text-slate-400 hover:bg-slate-800/50 hover:text-slate-200`;
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky h-screen top-0 select-none">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md"
            style={{ backgroundColor: tenantPrimaryColor }}
          >
            {tenantName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white leading-none capitalize">{tenantSlug} Portal</h2>
            <span className="text-[11px] text-slate-500">Enterprise Mode</span>
          </div>
        </div>

        <nav className="space-y-1">
          <a href={`/${tenantSlug}/dashboard`} className={linkClass("dashboard")}>
            <LayoutDashboard 
              className="w-4 h-4" 
              style={{ color: currentPath === "dashboard" ? tenantAccentColor : "#64748b" }} 
            />
            Dashboard
          </a>
          <a href={`/${tenantSlug}/tickets`} className={linkClass("tickets")}>
            <TicketIcon 
              className="w-4 h-4" 
              style={{ color: currentPath === "tickets" ? tenantAccentColor : "#64748b" }} 
            />
            Mis Tickets
          </a>
          <a href={`/${tenantSlug}/inventory`} className={linkClass("inventory")}>
            <Laptop 
              className="w-4 h-4" 
              style={{ color: currentPath === "inventory" ? tenantAccentColor : "#64748b" }} 
            />
            Mi Equipamiento
          </a>
          <a href="#" className={linkClass("settings")}>
            <Settings className="w-4 h-4 text-slate-500" />
            Configuración
          </a>
        </nav>
      </div>

      <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-950/20 hover:text-red-400 w-full mt-auto transition-all">
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </button>
    </aside>
  );
}