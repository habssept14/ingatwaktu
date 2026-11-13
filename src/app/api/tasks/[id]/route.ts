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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
    include: { category: true, subtasks: true, timeEntries: true, reminders: true },
  });

  if (!task) {
    return NextResponse.json({ error: "Task tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const data = taskSchema.partial().parse(body);

    const updateData: Record<string, unknown> = { ...data };
    if (data.scheduledStart !== undefined)
      updateData.scheduledStart = data.scheduledStart ? new Date(data.scheduledStart) : null;
    if (data.scheduledEnd !== undefined)
      updateData.scheduledEnd = data.scheduledEnd ? new Date(data.scheduledEnd) : null;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    // Auto-set completedAt when status changes to DONE
    if (data.status === "DONE") {
      updateData.completedAt = new Date();
    }

    const task = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Update task error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.task.delete({
      where: { id, userId: session.user.id },
    });
  } catch {
    return NextResponse.json({ error: "Task tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}