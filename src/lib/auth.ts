import { cookies } from "next/headers";
import { AuthService } from "@/services/auth.service";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) return null;

  return await AuthService.getUserById(userId);
}