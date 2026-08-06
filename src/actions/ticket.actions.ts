"use server";

import prisma from "@/lib/db";
import { TicketService } from "@/services/ticket.service";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createTicketAction(
  tenantSlug: string, 
  tenantId: string, 
  formData: FormData
) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const equipmentIdRaw = formData.get("equipmentId") as string;

  if (!title || !description || !priority) return;

  // Traemos provisoriamente el primer usuario para la foreign key obligatoria
  const defaultUser = await prisma.user.findFirst();
  if (!defaultUser) {
    console.error("No se encontró ningún usuario de respaldo en la base de datos.");
    return;
  }

  const equipmentId = equipmentIdRaw === "none" ? null : equipmentIdRaw;

  try {
    await TicketService.createTicket({
      title,
      description,
      priority,
      tenantId,
      userId: defaultUser.id,
      equipmentId,
    });
  } catch (error) {
    console.error("Error al crear el ticket en action:", error);
  }

  redirect(`/${tenantSlug}/tickets`);
}

export async function addWorkLogAction(
  tenantSlug: string,
  ticketId: string,
  formData: FormData
) {
  const description = formData.get("description") as string;
  const hours = parseFloat(formData.get("hours") as string);

  if (!description || isNaN(hours)) return;

  try {
    await TicketService.createWorkLog({
      description,
      hours,
      ticketId
    });
  } catch (error) {
    console.error("Error al registrar horas en action:", error);
  }

  redirect(`/${tenantSlug}/tickets/${ticketId}`);
}

export async function resolveTicketAction(
  ticketId: string, 
  tenantSlug: string, 
  formData: FormData
) {
  const description = formData.get("description") as string;
  const hours = parseFloat(formData.get("hours") as string);
  const newStatus = (formData.get("status") as "RESOLVED" | "CLOSED") || "RESOLVED";

  if (!description || isNaN(hours) || hours <= 0) {
    throw new Error("Por favor ingresá una descripción válida y una cantidad de horas mayor a 0.");
  }

  await TicketService.resolveTicket({
    ticketId,
    description,
    hours,
    newStatus
  });

  // Revalidamos la ruta del detalle y los dashboards
  revalidatePath(`/${tenantSlug}/tickets/${ticketId}`);
  revalidatePath(`/admin/tickets`);
  revalidatePath(`/admin/dashboard`);
}