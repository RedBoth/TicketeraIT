import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CreateUserModal from "@/components/CreateUserModal";
import UserTableRow from "@/components/UserTableRow";
import { TenantService } from "@/services/tenant.service";
import { createUserAction, updateUserAction } from "@/actions/user.actions";

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
                  Gestión de empleados autorizados para abrir tickets en esta compañía.
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
                      <th className="py-3.5 px-6 font-semibold">Nombre Completo</th>
                      <th className="py-3.5 px-6 font-semibold">Email</th>
                      <th className="py-3.5 px-6 font-semibold">Rol</th>
                      <th className="py-3.5 px-6 font-semibold">Contraseña</th>
                      <th className="py-3.5 px-6 font-semibold">Fecha Registro</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-500 italic">
                          No hay usuarios registrados para esta empresa todavía.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <UserTableRow 
                          key={u.id} 
                          user={u} 
                          tenantSlug={tenantSlug} 
                          handleUpdateUser={updateUserAction.bind(null, tenantSlug)} 
                        />
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