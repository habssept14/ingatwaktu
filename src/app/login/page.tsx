"use client";
export const dynamic = "force-dynamic";


import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[hsl(var(--bone-muted))]">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("demo@ingatwaktu.id");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Email atau password salah");
      setLoading(false);
      return;
    }

    toast.success("Selamat datang kembali");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[hsl(var(--primary))]/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[hsl(var(--accent-gold))]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-light))] shadow-[0_4px_14px_hsl(var(--primary)/0.4)] group-hover:shadow-[0_6px_20px_hsl(var(--primary)/0.5)] transition-shadow">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-[hsl(var(--bone))]">
            IngatWaktu
          </span>
        </Link>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/80 p-8 backdrop-blur-xl shadow-2xl">
          <h1 className="font-heading text-2xl font-bold text-[hsl(var(--bone))]">
            Masuk
          </h1>
          <p className="mt-2 text-sm text-[hsl(var(--bone-muted))]">
            Lanjutkan perjalanan mengatur waktumu.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] placeholder:text-[hsl(var(--bone-subtle))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] transition-all"
                placeholder="kamu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] placeholder:text-[hsl(var(--bone-subtle))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-base font-semibold text-white shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary-dark))] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))]/60 p-4">
            <p className="text-xs font-medium text-[hsl(var(--bone-muted))]">
              🎯 Demo credentials
            </p>
            <div className="mt-2 space-y-1 font-mono text-xs text-[hsl(var(--bone-subtle))]">
              <p>demo@ingatwaktu.id / demo1234</p>
              <p>admin@ingatwaktu.id / admin123</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[hsl(var(--bone-muted))]">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-light))] transition-colors">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}