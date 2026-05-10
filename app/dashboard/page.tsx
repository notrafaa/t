import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import { DeviceGrid } from "@/components/DeviceGrid";
import { requireAdmin } from "@/lib/auth";
import { Device } from "@/lib/types";

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("devices").select("*").order("updated_at", { ascending: false });
  const devices = (data ?? []) as Device[];

  return (
    <main className="min-h-screen px-5 py-6 lg:px-8">
      <nav className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/60">Controlled AV Supervision</p>
          <h1 className="mt-2 text-4xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link className="focus-ring flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm" href="/audit"><Shield size={16} /> Audit</Link>
          <form action="/api/auth/logout" method="post"><button className="focus-ring flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm"><LogOut size={16} /> Sortir</button></form>
        </div>
      </nav>
      <DeviceGrid devices={devices} />
    </main>
  );
}
