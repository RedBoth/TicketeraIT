import prisma from "@/lib/db";

export class AuthService {
  /**
   * Valida un usuario por email y contraseña, retornando sus datos y su tenant si aplica
   */
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true
      }
    });

    if (!user) return null;

    // En un entorno de producción comparamos usando bcrypt/argon2
    // Por ahora verificamos coincidencia directa
    if (user.password !== password) return null;

    return user;
  }

  /**
   * Obtiene la información del usuario por ID
   */
  static async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    });
  }
}