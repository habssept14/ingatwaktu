export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/server-auth";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const user = await requireAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[hsl(var(--bone))]">Pengaturan</h1>
        <p className="mt-1 text-sm text-[hsl(var(--bone-muted))]">
          Sesuaikan preferensi dan profil kamu
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}