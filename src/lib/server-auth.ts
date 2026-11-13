import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarColor: true,
      timezone: true,
      wakeTime: true,
      sleepTime: true,
      createdAt: true,
    },
  });

  return user;
}

// Redirects to /login when unauthenticated (works in Server Components & RSC trees).
// This matches the dashboard layout behavior — no more hard 500s on protected pages.
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}