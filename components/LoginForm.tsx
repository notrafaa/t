"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password })
    });
    setLoading(false);
    if (!res.ok) {
      setError("Identifiants invalides ou accès refusé.");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Control room</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Connexion admin</h1>
      </div>
      <label className="mb-5 block text-sm text-white/70">
        Mot de passe
        <input className="focus-ring mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </label>
      {error && <p className="mb-4 rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
      <button className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-3 font-semibold text-slate-950 transition hover:bg-white" disabled={loading}>
        <LogIn size={18} />
        {loading ? "Connexion..." : "Entrer"}
      </button>
    </form>
  );
}
