import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DeviceDetail } from "@/components/DeviceDetail";
import { requireAdmin } from "@/lib/auth";
import { Device, DeviceLog } from "@/lib/types";

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: device }, { data: logs }] = await Promise.all([
    supabase.from("devices").select("*").eq("id", id).single(),
    supabase.from("device_logs").select("*").eq("device_id", id).order("created_at", { ascending: false }).limit(100)
  ]);

  if (!device) {
    return <main className="p-8">Device introuvable.</main>;
  }

  return (
    <main className="min-h-screen px-5 py-6 lg:px-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16} /> Retour</Link>
      <DeviceDetail device={device as Device} logs={(logs ?? []) as DeviceLog[]} />
    </main>
  );
}
