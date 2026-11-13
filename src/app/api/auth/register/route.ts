import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);
    const name = parsed.name.trim();
    const email = parsed.email.toLowerCase().trim();
    const password = parsed.password;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarColor: ["#2E86DE", "#10B981", "#A855F7", "#EF4444", "#D4A843", "#F97316"][
          Math.floor(Math.random() * 6)
        ],
      },
    });

    // Create default categories for new user
    await prisma.category.createMany({
      data: [
        { userId: user.id, name: "Kerja", color: "#2E86DE", icon: "briefcase" },
        { userId: user.id, name: "Personal", color: "#10B981", icon: "user" },
        { userId: user.id, name: "Belajar", color: "#A855F7", icon: "book-open" },
        { userId: user.id, name: "Kesehatan", color: "#EF4444", icon: "heart" },
        { userId: user.id, name: "Ibadah", color: "#D4A843", icon: "sun" },
      ],
    });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}