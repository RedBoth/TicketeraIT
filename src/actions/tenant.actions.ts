"use server";

import { TenantService } from "@/services/tenant.service";
import { revalidatePath } from "next/cache";

export async function createTenantAction(formData: FormData) {
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;
  const primaryColor = formData.get("primaryColor") as string;

  if (!name) {
    throw new Error("El nombre de la empresa es obligatorio.");
  }

  // Generamos un slug automático si viene vacío (ej: "Tech Corp" -> "tech-corp")
  if (!slug || slug.trim() === "") {
    slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  await TenantService.createTenant({
    name,
    slug,
    primaryColor: primaryColor || "#3b82f6",
    accentColor: primaryColor || "#3b82f6",
  });

  // Revalidamos la lista de empresas y el dashboard
  revalidatePath("/admin/companies");
  revalidatePath("/admin/dashboard");
}