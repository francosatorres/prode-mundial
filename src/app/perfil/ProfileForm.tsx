"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({ profile, userId }: { profile: any; userId: string }) {
  const [form, setForm] = useState({ nombre: profile?.nombre ?? "", apellido: profile?.apellido ?? "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const save = async () => {
    setSaving(true);
    const sb = createClient();
    await sb.from("profiles").update(form).eq("id", userId);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-green-400 mb-1.5 block">Nombre</label>
          <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="text-sm text-green-400 mb-1.5 block">Apellido</label>
          <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} className="input-field" />
        </div>
      </div>
      <div>
        <label className="text-sm text-green-400 mb-1.5 block">Email</label>
        <input value={profile?.email ?? ""} disabled className="input-field opacity-50 cursor-not-allowed" />
      </div>
      <button onClick={save} disabled={saving} className="btn-primary">
        {saving ? "Guardando..." : success ? "✓ Guardado" : "Guardar cambios"}
      </button>
    </div>
  );
}
