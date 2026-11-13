import type { NextAuthOptions } from "next-auth";

// Edge-safe auth config (NO Prisma, NO bcrypt, NO node:fs)
// Used by middleware (Edge runtime).
// Full provider setup (Credentials + PrismaAdapter) lives in src/lib/auth.ts.
export const authConfig: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [], // real providers wired in src/lib/auth.ts
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.avatarColor = user.avatarColor;
        token.timezone = user.timezone;
        token.wakeTime = user.wakeTime;
        token.sleepTime = user.sleepTime;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.avatarColor = token.avatarColor;
        session.user.timezone = token.timezone;
        session.user.wakeTime = token.wakeTime;
        session.user.sleepTime = token.sleepTime;
      }
      return session;
    },
  },
};