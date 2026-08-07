import prisma from "@/lib/db";

export class EquipmentService {
  /**
   * Obtiene el tenant y su lista de equipamiento con el conteo de tickets activos por equipo
   */
  static async getInventoryData(slug: string) {
    return await prisma.tenant.findUnique({
      where: { slug },
      include: { 
        equipment: {
          include: {
            _count: {
              select: {
                tickets: {
                  where: {
                    status: {
                      in: ["OPEN", "IN_PROGRESS"]
                    }
                  }
                }
              }
            }
          }
        } 
      },
    });
  }

  /**
   * Registra un nuevo equipo asociado a un Tenant
   */
  static async createEquipment(data: {
    type: string;
    brand: string;
    model: string;
    serialNumber: string;
    macAddress?: string; // <-- Opcional
    tenantId: string;
  }) {
    return await prisma.equipment.create({
      data: {
        type: data.type,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        macAddress: data.macAddress || null,
        tenantId: data.tenantId,
      },
    });
  }
}