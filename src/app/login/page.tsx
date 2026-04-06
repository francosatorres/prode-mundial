"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const sb = createClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/mis-pronosticos");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="section-title text-5xl text-white mt-2">INGRESAR</h1>
          <p className="text-green-500 mt-1">Accedé a tus pronósticos</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-green-400 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="text-sm text-green-400 mb-1.5 block">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 px-4 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary mt-2 py-3 text-base">
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
          <p className="text-center text-green-600 text-sm mt-6">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-green-400 hover:text-green-200 font-semibold">Registrarse</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
