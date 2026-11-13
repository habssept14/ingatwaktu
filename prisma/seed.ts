// IngatWaktu seed — creates admin user + sample data
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminEmail = "admin@ingatwaktu.id";
  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      name: "Administrator",
      avatarColor: "#D4A843",
      timezone: "Asia/Jakarta",
    },
  });

  console.log(`✓ Admin user: ${admin.email}`);

  // Demo user
  const demoEmail = "demo@ingatwaktu.id";
  const demoPassword = await bcrypt.hash("demo1234", 12);

  const demo = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      passwordHash: demoPassword,
      name: "Yohanes Joko",
      avatarColor: "#2E86DE",
      timezone: "Asia/Jakarta",
    },
  });

  console.log(`✓ Demo user: ${demo.email}`);

  // Categories for demo user
  const categories = [
    { name: "Kerja", color: "#2E86DE", icon: "briefcase" },
    { name: "Personal", color: "#10B981", icon: "user" },
    { name: "Belajar", color: "#A855F7", icon: "book-open" },
    { name: "Kesehatan", color: "#EF4444", icon: "heart" },
    { name: "Ibadah", color: "#D4A843", icon: "sun" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { userId_name: { userId: demo.id, name: cat.name } },
      update: {},
      create: { ...cat, userId: demo.id },
    });
  }
  console.log(`✓ ${categories.length} categories`);

  // Sample tasks for today and tomorrow
  const workCat = await prisma.category.findFirst({
    where: { userId: demo.id, name: "Kerja" },
  });
  const studyCat = await prisma.category.findFirst({
    where: { userId: demo.id, name: "Belajar" },
  });
  const healthCat = await prisma.category.findFirst({
    where: { userId: demo.id, name: "Kesehatan" },
  });

  const now = new Date();
  const today9am = new Date(now);
  today9am.setHours(9, 0, 0, 0);
  const today1030 = new Date(today9am);
  today1030.setHours(10, 30);
  const today2pm = new Date(today9am);
  today2pm.setHours(14, 0);

  const sampleTasks = [
    {
      title: "Morning standup dengan tim",
      description: "Sinkronisasi progress harian dan blocker",
      priority: "HIGH",
      status: "DONE",
      categoryId: workCat?.id,
      scheduledStart: today9am,
      scheduledEnd: today1030,
      estimateMinutes: 30,
      completedAt: new Date(),
    },
    {
      title: "Review code PR #142",
      description: "Review fitur authentication",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      categoryId: workCat?.id,
      scheduledStart: today2pm,
      scheduledEnd: new Date(today2pm.getTime() + 60 * 60 * 1000),
      estimateMinutes: 60,
    },
    {
      title: "Belajar Next.js App Router",
      description: "Selesaikan chapter 5 - Server Components",
      priority: "MEDIUM",
      status: "TODO",
      categoryId: studyCat?.id,
      scheduledStart: new Date(today9am.getTime() + 7 * 60 * 60 * 1000),
      estimateMinutes: 90,
    },
    {
      title: "Olahraga pagi",
      description: "Jogging 30 menit di taman",
      priority: "LOW",
      status: "TODO",
      categoryId: healthCat?.id,
      scheduledStart: new Date(today9am.getTime() + -3 * 60 * 60 * 1000),
      estimateMinutes: 30,
    },
    {
      title: "Planning sprint berikutnya",
      priority: "HIGH",
      status: "TODO",
      categoryId: workCat?.id,
      dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      estimateMinutes: 60,
    },
  ];

  for (const task of sampleTasks) {
    await prisma.task.create({ data: { ...task, userId: demo.id } });
  }
  console.log(`✓ ${sampleTasks.length} sample tasks`);

  // Sample habits
  const habits = [
    { name: "Olahraga", icon: "dumbbell", color: "#EF4444" },
    { name: "Baca buku", icon: "book", color: "#A855F7" },
    { name: "Meditasi", icon: "sparkles", color: "#10B981" },
  ];

  for (const habit of habits) {
    await prisma.habit.upsert({
      where: { userId_name: { userId: demo.id, name: habit.name } },
      update: {},
      create: { ...habit, userId: demo.id },
    });
  }
  console.log(`✓ ${habits.length} habits`);

  console.log("\n✅ Seed selesai!");
  console.log("\nLogin credentials:");
  console.log(`  Admin: ${adminEmail} / admin123`);
  console.log(`  Demo:  ${demoEmail} / demo1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
