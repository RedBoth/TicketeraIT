"use server";

import { UserService } from "@/services/user.service";
import { TenantService } from "@/services/tenant.service";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(userId: string, path: string, formData: FormData) {
  const name = formData.get("name") as string;
  const newPassword = formData.get("password") as string;

  if (!name && !newPassword) {
    throw new Error("Completá al menos un campo para actualizar.");
  }

  await UserService.updateUserProfile({
    userId,
    name: name || undefined,
    password: newPassword || undefined,
  });

  revalidatePath(path);
}

export async function updateTenantBrandingAction(tenantId: string, tenantSlug: string, formData: FormData) {
  const name = formData.get("name") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const accentColor = formData.get("accentColor") as string;

  await TenantService.updateTenantBranding({
    tenantId,
    name,
    primaryColor,
    accentColor,
  });

  revalidatePath(`/${tenantSlug}/settings`);
  revalidatePath(`/${tenantSlug}/dashboard`);
}