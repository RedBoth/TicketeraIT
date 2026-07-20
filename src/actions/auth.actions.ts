"use server";

import { AuthService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor, completá todos los campos." };
  }

  const user = await AuthService.login(email, password);

  if (!user) {
    return { error: "Credenciales inválidas. Verificá tu email o contraseña." };
  }

  // Guardamos el ID del usuario en una Cookie HTTP-Only segura
  const cookieStore = await cookies();
  cookieStore.set("user_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 días de sesión
  });

  // REDIRECCIÓN SEGÚN ROL
  let redirectUrl = "/login";

  if (user.role === "CLIENTE_FINAL") {
    if (!user.tenant) {
      return { error: "Tu usuario no tiene una empresa asignada." };
    }
    redirectUrl = `/${user.tenant.slug}/dashboard`;
  } else {
    redirectUrl = `/admin/tickets`;
  }

  redirect(redirectUrl);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  redirect("/login");
}