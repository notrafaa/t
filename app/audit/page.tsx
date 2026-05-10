import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuditLogTable } from "@/components/AuditLogTable";
import { requireAdmin } from "@/lib/auth";
import { AuditLog } from "@/lib/types";

export default async function AuditPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(300);
  return (
    <main className="min-h-screen px-5 py-6 lg:px-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16} /> Retour</Link>
      <AuditLogTable logs={(data ?? []) as AuditLog[]} />
    </main>
  );
}
