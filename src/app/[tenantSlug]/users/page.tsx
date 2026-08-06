import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CreateUserModal from "@/components/CreateUserModal";
import { TenantService } from "@/services/tenant.service";
import { createUserAction } from "@/actions/user.actions";
import { Mail, Shield, User as UserIcon } from "lucide-react";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function TenantUsersPage({ params }: Props) {
  const { tenantSlug } = await params;
  const user = await getCurrentUser();
  const isTechnician = user?.role === "TECNICO" || user?.role === "SUPER_ADMIN";

  // Si no es técnico, no tiene permiso de ver ni administrar usuarios del tenant
  if (!isTechnician) {
    redirect(`/${tenantSlug}/dashboard`);
  }

  const tenant = await TenantService.getTenantBySlug(tenantSlug);
  if (!tenant) notFound();

  const users = await TenantService.getTenantUsers(tenantSlug);
  const handleCreateUser = createUserAction.bind(null, tenantSlug, tenant.id);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar 
        tenantSlug={tenantSlug}
        tenantName={tenant.name}
        tenantPrimaryColor={tenant.primaryColor}
        tenantAccentColor={tenant.accentColor}
        currentPath="users"
        userRole={user?.role}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Usuarios de {tenant.name}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Gestión e id de empleados autorizados para abrir tickets en esta compañía.
                </p>
              </div>

              <CreateUserModal handleCreateUser={handleCreateUser} />
            </div>

            {/* Tabla de Usuarios */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
                      <th className="py-3.5 px-6 font-semibold">Usuario / Nombre</th>
                      <th className="py-3.5 px-6 font-semibold">Email</th>
                      <th className="py-3.5 px-6 font-semibold">Rol</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-500 italic">
                          No hay usuarios registrados para esta empresa todavía.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                                {u.name ? u.name.substring(0, 2).toUpperCase() : <UserIcon className="w-4 h-4 text-slate-400" />}
                              </div>
                              <span className="font-semibold text-white">{u.name || "Sin nombre"}</span>
                            </div>
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap text-slate-300 font-mono">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              {u.email}
                            </span>
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
                              <Shield className="w-3 h-3 text-slate-400" />
                              {u.role}
                            </span>
                          </td>

                          <td className="py-4 px-6 whitespace-nowrap text-right text-slate-400 font-mono text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString("es-AR")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}