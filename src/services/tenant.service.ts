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

  //Obtiene todas las empresas registradas con su conteo de equipos y datos para la vista del Técnico
  static async getAllTenantsWithStats() {
    return await prisma.tenant.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            equipment: true,
            tickets: true,
            users: true,
          }
        }
      }
    });
  }

  //Crea una nueva empresa (Tenant) en la base de datos
  static async createTenant(data: {
    name: string;
    slug: string;
    primaryColor?: string;
    accentColor?: string;
  }) {
    // Verificamos que el slug no esté en uso
    const existing = await prisma.tenant.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new Error("Ya existe una empresa registrada con ese slug / identificador.");
    }

    return await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug.toLowerCase().trim(),
        primaryColor: data.primaryColor || "#3b82f6",
        accentColor: data.accentColor || "#60a5fa",
      },
    });
  }

  //Obtiene los usuarios pertenecientes a un Tenant específico
  static async getTenantUsers(tenantSlug: string) {
    return await prisma.user.findMany({
      where: { tenant: { slug: tenantSlug } },
      orderBy: { createdAt: "desc" }
    });
  }

  //Crea un usuario y lo vincula directamente a un Tenant
  static async createUserForTenant(data: {
    email: string;
    name?: string;
    role?: string;
    tenantId: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error("Ya existe un usuario registrado con este correo electrónico.");
    }

    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || "USER",
        tenantId: data.tenantId,
      }
    });
  }

  //Obtiene los datos básicos de un Tenant por su Slug
  static async getTenantBySlug(slug: string) {
    return await prisma.tenant.findUnique({
      where: { slug }
    });
  }
}