import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const authOptions: NextAuthOptions = {
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = await loginSchema.parseAsync(credentials);
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
        if (!user) return null;
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarColor: user.avatarColor,
          timezone: user.timezone,
          wakeTime: user.wakeTime,
          sleepTime: user.sleepTime,
        };
      },
    }),
  ],
};

// NextAuth handler for the [...nextauth] catch-all route
const nextAuthHandler = NextAuth(authOptions);

// App Router catch-all: NextAuth v4 exposes the handler directly.
export const handler = nextAuthHandler;

// Server-side session helper — uses getServerSession, the proven v4 App Router pattern.
// Works in page.tsx, layout.tsx, and route handlers.
export async function auth() {
  return getServerSession(authOptions);
}