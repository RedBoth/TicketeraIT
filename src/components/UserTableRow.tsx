"use client";

import { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  Pencil, 
  Mail, 
  Shield, 
  User as UserIcon, 
  X, 
  Save, 
  KeyRound 
} from "lucide-react";

interface UserTableRowProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    password?: string | null;
    createdAt: Date;
  };
  tenantSlug: string;
  handleUpdateUser: (userId: string, formData: FormData) => Promise<void>;
}

export default function UserTableRow({ user, tenantSlug, handleUpdateUser }: UserTableRowProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const onEditSubmit = async (formData: FormData) => {
    setIsPending(true);
    await handleUpdateUser(user.id, formData);
    setIsPending(false);
    setIsEditOpen(false);
  };

  return (
    <>
      <tr className="hover:bg-slate-800/30 transition-colors">
        {/* Nombre */}
        <td className="py-4 px-6 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs">
              {user.name ? user.name.substring(0, 2).toUpperCase() : <UserIcon className="w-4 h-4 text-slate-400" />}
            </div>
            <span className="font-semibold text-white">{user.name || "Sin nombre"}</span>
          </div>
        </td>

        {/* Email */}
        <td className="py-4 px-6 whitespace-nowrap text-slate-300 font-mono">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            {user.email}
          </span>
        </td>

        {/* Rol */}
        <td className="py-4 px-6 whitespace-nowrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
            <Shield className="w-3 h-3 text-slate-400" />
            {user.role}
          </span>
        </td>

        {/* Contraseña con Ojito */}
        <td className="py-4 px-6 whitespace-nowrap font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {showPassword ? user.password || "••••••••" : "••••••••"}
            </span>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </td>

        {/* Fecha */}
        <td className="py-4 px-6 whitespace-nowrap text-slate-400 font-mono text-[11px]">
          {new Date(user.createdAt).toLocaleDateString("es-AR")}
        </td>

        {/* Acciones: Botón Lápiz para Editar */}
        <td className="py-4 px-6 whitespace-nowrap text-right">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="p-1.5 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Editar Usuario / Cambiar Clave"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>

      {/* MODAL DE EDICIÓN RÁPIDA */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">Editar Usuario</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Modificar datos o clave de {user.email}</p>
                </div>
              </div>

              <button 
                onClick={() => setIsEditOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form action={onEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nombre Completo
                </label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={user.name || ""} 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="password" 
                    defaultValue={user.password || ""} 
                    placeholder="Escribí la nueva contraseña" 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-amber-400 focus:outline-none focus:border-amber-500 font-mono" 
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? "Guardando..." : "Guardar Cambios"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}