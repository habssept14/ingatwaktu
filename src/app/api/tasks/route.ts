import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Judul wajib diisi" }).max(200),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "SKIPPED"]).default("TODO"),
  scheduledStart: z.string().datetime().optional().nullable(),
  scheduledEnd: z.string().datetime().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  estimateMinutes: z.number().int().positive().default(30),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (from || to) {
    where.scheduledStart = {};
    if (from) (where.scheduledStart as Record<string, string>).gte = from;
    if (to) (where.scheduledStart as Record<string, string>).lte = to;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: { category: true, subtasks: true, _count: { select: { timeEntries: true } } },
    orderBy: [{ status: "asc" }, { scheduledStart: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...data,
        userId: session.user.id,
        scheduledStart: data.scheduledStart ? new Date(data.scheduledStart) : null,
        scheduledEnd: data.scheduledEnd ? new Date(data.scheduledEnd) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: { category: true },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}