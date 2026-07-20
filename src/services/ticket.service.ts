import prisma from "@/lib/db";

export class TicketService {
  /**
   * Obtiene el Tenant con sus equipos y todos sus tickets ordenados por fecha de creación
   */
  static async getTicketsPageData(slug: string) {
    return await prisma.tenant.findUnique({
      where: { slug },
      include: {
        equipment: true,
        tickets: {
          orderBy: { createdAt: "desc" },
          include: { equipment: true }
        }
      }
    });
  }

  /**
   * Registra un nuevo ticket en la base de datos
   */
  static async createTicket(data: {
    title: string;
    description: string;
    priority: string;
    tenantId: string;
    userId: string;
    equipmentId: string | null;
  }) {
    return await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: "OPEN",
        tenantId: data.tenantId,
        userId: data.userId,
        equipmentId: data.equipmentId,
      },
    });
  }

  /**
   * Obtiene la información detallada de un ticket, su equipamiento y su historial de horas (workLogs)
   */
  static async getTicketDetails(id: string) {
    return await prisma.ticket.findUnique({
      where: { id },
      include: {
        equipment: true,
        workLogs: { orderBy: { createdAt: "desc" } }
      }
    });
  }

  /**
   * Agrega un nuevo registro de trabajo (horas) a un ticket específico
   */
  static async createWorkLog(data: {
    description: string;
    hours: number;
    ticketId: string;
  }) {
    return await prisma.workLog.create({
      data: {
        description: data.description,
        hours: data.hours,
        ticketId: data.ticketId
      }
    });
  }
}