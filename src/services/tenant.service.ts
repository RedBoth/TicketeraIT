import prisma from "@/lib/db";

export class TenantService {
  
  static async getDashboardData(slug: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { tickets: true, equipment: true }
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            equipment: true,
            workLogs: {
              select: { hours: true }
            }
          }
        }
      }
    });

    if (!tenant) return null;

    // Calculamos el total de horas consumidas por este tenant de forma directa
    const totalHours = await this.calculateTotalHours(tenant.id);

    return {
      tenant,
      totalHours
    };
  }

  // Calcula la sumatoria total de horas imputadas en todos los tickets de un tenant
  private static async calculateTotalHours(tenantId: string): Promise<number> {
    const allTicketsWithHours = await prisma.ticket.findMany({
      where: { tenantId },
      include: {
        workLogs: {
          select: { hours: true }
        }
      }
    });

    return allTicketsWithHours.reduce((total, ticket) => {
      const ticketHours = ticket.workLogs.reduce((sum, log) => sum + log.hours, 0);
      return total + ticketHours;
    }, 0);
  }
}