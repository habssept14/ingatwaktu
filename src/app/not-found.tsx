export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--bg-deep))] px-6">
      <div className="text-center">
        <h1 className="font-heading text-7xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-light))] bg-clip-text text-transparent">
          404
        </h1>
        <p className="mt-3 text-lg text-[hsl(var(--bone-muted))]">
          Halaman yang kamu cari tidak ditemukan.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-[hsl(var(--primary))] px-6 text-sm font-semibold text-white hover:bg-[hsl(var(--primary-dark))] transition-all"
        >
          Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
}