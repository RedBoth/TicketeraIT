import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const isTechnician = user.role === "TECNICO" || user.role === "SUPER_ADMIN";

  if (isTechnician) {
    redirect("/admin/dashboard");
  }

  if (user.tenant?.slug) {
    redirect(`/${user.tenant.slug}/dashboard`);
  }

  redirect("/login");
}