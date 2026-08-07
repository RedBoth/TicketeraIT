"use server";

import { EquipmentService } from "@/services/equipment.service";
import { redirect } from "next/navigation";

export async function addEquipmentAction(tenantSlug: string, tenantId: string, formData: FormData) {
  const type = formData.get("type") as string;
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const macAddress = formData.get("macAddress") as string;

  if (!type || !brand || !model || !serialNumber) return;

  try {
    await EquipmentService.createEquipment({
      type,
      brand,
      model,
      serialNumber,
      macAddress: macAddress?.trim() || undefined,
      tenantId,
    });
  } catch (error) {
    console.error("Error al guardar equipo en action:", error);
  }

  redirect(`/${tenantSlug}/inventory`);
}