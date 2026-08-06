/* eslint-disable @typescript-eslint/ban-ts-comment */
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SettingsForm from "@/components/SettingsForm";
import { TenantService } from "@/services/tenant.service";
import { updateProfileAction, updateTenantBrandingAction } from "@/actions/settings.actions";

interface Props {
  params: Promise<{ tenantSlug: string }>;
}

export default async function TenantSettingsPage({ params }: Props) {
  const { tenantSlug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isTechnician = user.role === "TECNICO" || user.role === "SUPER_ADMIN";
  const isInAdminConsole = tenantSlug === "admin";

  let tenant = null;
  if (!isInAdminConsole) {
    tenant = await TenantService.getTenantBySlug(tenantSlug);
    if (!tenant) notFound();
  }

  const currentPath = `/${tenantSlug}/settings`;
  const handleUpdateProfile = updateProfileAction.bind(null, user.id, currentPath);
  const handleUpdateTenant = tenant 
    ? updateTenantBrandingAction.bind(null, tenant.id, tenant.slug) 
    : undefined;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar 
        tenantSlug={tenantSlug}
        tenantName={tenant?.name || "Control Center"}
        tenantPrimaryColor={tenant?.primaryColor || "#f59e0b"}
        tenantAccentColor={tenant?.accentColor || "#f59e0b"}
        currentPath="settings"
        userRole={user.role}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="pb-6 border-b border-slate-800">
              <h1 className="text-2xl font-bold text-white tracking-tight">Configuración del Sistema</h1>
              <p className="text-xs text-slate-400 mt-1">
                Administrá tus credenciales personales y preferencias del entorno.
              </p>
            </div>

            <SettingsForm 
              user={user}
              tenant={tenant}
              isTechnician={isTechnician}
              currentPath={currentPath}
              handleUpdateProfile={handleUpdateProfile}
              handleUpdateTenant={handleUpdateTenant}
            />

          </div>
        </main>
      </div>
    </div>
  );
}