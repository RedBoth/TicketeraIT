"use client";

import { useState } from "react";
import { KeyRound, User, Save, Building2, Paintbrush } from "lucide-react";

interface SettingsFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  tenant?: {
    id: string;
    slug: string;
    name: string;
    primaryColor: string;
    accentColor: string;
  } | null;
  isTechnician: boolean;
  currentPath: string;
  handleUpdateProfile: (formData: FormData) => Promise<void>;
  handleUpdateTenant?: (formData: FormData) => Promise<void>;
}

export default function SettingsForm({
  user,
  tenant,
  isTechnician,
  currentPath,
  handleUpdateProfile,
  handleUpdateTenant,
}: SettingsFormProps) {
  const [userPending, setUserPending] = useState(false);
  const [userSuccess, setUserSuccess] = useState(false);

  const [tenantPending, setTenantPending] = useState(false);
  const [tenantSuccess, setTenantSuccess] = useState(false);

  const onProfileSubmit = async (formData: FormData) => {
    setUserPending(true);
    setUserSuccess(false);
    await handleUpdateProfile(formData);
    setUserPending(false);
    setUserSuccess(true);
    setTimeout(() => setUserSuccess(false), 3000);
  };

  const onTenantSubmit = async (formData: FormData) => {
    if (!handleUpdateTenant) return;
    setTenantPending(true);
    setTenantSuccess(false);
    await handleUpdateTenant(formData);
    setTenantPending(false);
    setTenantSuccess(true);
    setTimeout(() => setTenantSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* SECCIÓN 1: PERFIL DE USUARIO */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Mi Perfil</h2>
              <p className="text-xs text-slate-400 mt-0.5">Actualizá tu información de acceso y nombre público.</p>
            </div>
          </div>
          {userSuccess && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md animate-in fade-in">
              ¡Perfil actualizado!
            </span>
          )}
        </div>

        <form action={onProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                value={user.email || ""} 
                disabled 
                className="w-full bg-slate-950/50 border border-slate-800/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed font-mono" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre Completo
              </label>
              <input 
                type="text" 
                name="name" 
                defaultValue={user.name || ""} 
                placeholder="Ej: Mauro Kolman" 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input 
                type="password" 
                name="password" 
                placeholder="Dejá este campo vacío si no querés cambiarla" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono" 
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={userPending}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{userPending ? "Guardando..." : "Guardar Perfil"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* SECCIÓN 2: BRANDING DEL TENANT (Solo visible si hay Tenant y es Técnico) */}
      {isTechnician && tenant && handleUpdateTenant && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">Personalización de {tenant.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Ajustá la identidad corporativa y paleta cromática del cliente.</p>
              </div>
            </div>
            {tenantSuccess && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md animate-in fade-in">
                ¡Branding actualizado!
              </span>
            )}
          </div>

          <form action={onTenantSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre Comercial de la Empresa
              </label>
              <input 
                type="text" 
                name="name" 
                defaultValue={tenant.name} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Color Primario
                </label>
                <div className="flex items-center gap-3 bg-slate-950 p-2 border border-slate-800 rounded-lg">
                  <input 
                    type="color" 
                    name="primaryColor" 
                    defaultValue={tenant.primaryColor} 
                    className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" 
                  />
                  <span className="text-xs font-mono text-slate-300">{tenant.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Color de Acento
                </label>
                <div className="flex items-center gap-3 bg-slate-950 p-2 border border-slate-800 rounded-lg">
                  <input 
                    type="color" 
                    name="accentColor" 
                    defaultValue={tenant.accentColor} 
                    className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" 
                  />
                  <span className="text-xs font-mono text-slate-300">{tenant.accentColor}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={tenantPending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                <Paintbrush className="w-4 h-4" />
                <span>{tenantPending ? "Actualizando..." : "Aplicar Branding"}</span>
              </button>
            </div>
          </form>
        </section>
      )}

    </div>
  );
}