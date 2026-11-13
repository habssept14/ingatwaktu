import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      avatarColor: string;
      timezone: string;
      wakeTime: string;
      sleepTime: string;
    } & DefaultSession["user"];
  }

  interface User {
    avatarColor: string;
    timezone: string;
    wakeTime: string;
    sleepTime: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    avatarColor: string;
    timezone: string;
    wakeTime: string;
    sleepTime: string;
  }
}