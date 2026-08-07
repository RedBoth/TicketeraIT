import { User } from "lucide-react";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const userName = user?.name || user?.email?.split("@")[0] || "Usuario";
  const isTechnician = user?.role === "TECNICO" || user?.role === "SUPER_ADMIN";

  // Obtenemos las dos primeras iniciales para el avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="w-full bg-slate-900/60 border-b border-slate-800 px-8 py-4 flex items-center justify-end backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="flex items-center gap-4">
        
        {/* Etiqueta de Rol / Portal */}
        <div className="text-right hidden sm:block">
          <span className="text-md font-semibold text-white block leading-tight">
            {userName}
          </span>
          <span className="text-sm font-mono text-amber-400/90 block mt-0.5">
            {isTechnician ? "Tecnico" : "Cliente"}
          </span>
        </div>

        {/* Separador vertical */}
        <div className="h-7 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Avatar con Iniciales */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-amber-400 text-xs shadow-inner">
            {initials || <User className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

      </div>
    </header>
  );
}