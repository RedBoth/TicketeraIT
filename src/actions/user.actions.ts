"use server";

import { TenantService } from "@/services/tenant.service";
import { revalidatePath } from "next/cache";

export async function createUserAction(tenantSlug: string, tenantId: string, formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = (formData.get("role") as string) || "USER";

  if (!email) {
    throw new Error("El correo electrónico es obligatorio.");
  }

  await TenantService.createUserForTenant({
    email,
    name,
    role,
    tenantId
  });

  revalidatePath(`/${tenantSlug}/users`);
  revalidatePath(`/admin/companies`);
}