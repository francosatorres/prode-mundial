"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const sb = createClient();
    const { data, error: authError } = await sb.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nombre: form.nombre, apellido: form.apellido } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await sb.from("profiles").upsert({
        id: data.user.id,
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        role: "user",
        approved: false,
      });
    }
    router.push("/mis-pronosticos");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🏆</span>
          <h1 className="section-title text-5xl text-white mt-2">REGISTRARSE</h1>
          <p className="text-green-500 mt-1">Creá tu cuenta y empezá a pronósticar</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-green-400 mb-1.5 block">Nombre</label>
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="input-field" placeholder="Juan" required />
              </div>
              <div>
                <label className="text-sm text-green-400 mb-1.5 block">Apellido</label>
                <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} className="input-field" placeholder="García" required />
              </div>
            </div>
            <div>
              <label className="text-sm text-green-400 mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="text-sm text-green-400 mb-1.5 block">Contraseña</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Mínimo 6 caracteres" minLength={6} required />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 px-4 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary mt-2 py-3 text-base">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
          <p className="text-center text-green-600 text-sm mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-green-400 hover:text-green-200 font-semibold">Ingresar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
