import prisma from "@/lib/db";

export class UserService {

  // Actualiza el perfil del usuario (Nombre y/o Contraseña)
  static async updateUserProfile(data: {
    userId: string;
    name?: string;
    password?: string;
  }) {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.password) updateData.password = data.password;

    return await prisma.user.update({
      where: { id: data.userId },
      data: updateData,
    });
  }
}