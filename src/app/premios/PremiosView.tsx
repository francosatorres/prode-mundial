"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Plus, Trash2, Edit2, Check, X } from "lucide-react";

type Premio = { id: string; posicion: number; titulo: string; descripcion: string; emoji: string };

export function PremiosView({ premios: initial, isAdmin }: { premios: Premio[]; isAdmin: boolean }) {
  const [premios, setPremios] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ posicion: 1, titulo: "", descripcion: "", emoji: "🏆" });
  const [adding, setAdding] = useState(false);
  const [editData, setEditData] = useState<Premio | null>(null);

  const sb = createClient();

  const addPremio = async () => {
    if (!form.titulo) return;
    const { data } = await sb.from("premios").insert(form).select().single();
    if (data) { setPremios(p => [...p, data].sort((a,b) => a.posicion - b.posicion)); setAdding(false); setForm({ posicion: premios.length + 2, titulo: "", descripcion: "", emoji: "🏆" }); }
  };

  const deletePremio = async (id: string) => {
    await sb.from("premios").delete().eq("id", id);
    setPremios(p => p.filter(x => x.id !== id));
  };

  const saveEdit = async () => {
    if (!editData) return;
    await sb.from("premios").update({ titulo: editData.titulo, descripcion: editData.descripcion, emoji: editData.emoji, posicion: editData.posicion }).eq("id", editData.id);
    setPremios(p => p.map(x => x.id === editData.id ? editData : x).sort((a,b) => a.posicion - b.posicion));
    setEditing(null);
    setEditData(null);
  };

  const emojis = ["🏆", "🥇", "🥈", "🥉", "🎖️", "⭐", "🎁", "💰", "🍕", "🍺", "🎟️", "👑"];

  return (
    <div>
      {premios.length === 0 && !isAdmin && (
        <div className="card p-16 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-500 text-lg">Todavía no se cargaron los premios</p>
          <p className="text-gray-700 text-sm mt-1">El organizador los cargará próximamente</p>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-6">
        {premios.map((p, i) => (
          <div key={p.id} className={`card card-hover p-5 flex items-start gap-4 ${i === 0 ? "border-orange-500/30" : ""}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${i === 0 ? "bg-orange-500/10 border border-orange-500/20" : "bg-white/5"}`}>
              {editing === p.id && editData ? (
                <select value={editData.emoji} onChange={e => setEditData({...editData, emoji: e.target.value})} className="bg-transparent text-2xl outline-none">
                  {emojis.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              ) : p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              {editing === p.id && editData ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input type="number" value={editData.posicion} onChange={e => setEditData({...editData, posicion: parseInt(e.target.value)})} className="input-field w-16 text-center" min={1} />
                    <input value={editData.titulo} onChange={e => setEditData({...editData, titulo: e.target.value})} className="input-field flex-1" placeholder="Título del premio" />
                  </div>
                  <input value={editData.descripcion} onChange={e => setEditData({...editData, descripcion: e.target.value})} className="input-field" placeholder="Descripción (ej: $5000, una pizza, etc.)" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-orange-500/60">#{p.posicion}</span>
                    <span className="font-bold text-white">{p.titulo}</span>
                  </div>
                  {p.descripcion && <p className="text-gray-400 text-sm">{p.descripcion}</p>}
                </>
              )}
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                {editing === p.id ? (
                  <>
                    <button onClick={saveEdit} className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center hover:bg-orange-500/20"><Check size={14} /></button>
                    <button onClick={() => { setEditing(null); setEditData(null); }} className="w-8 h-8 rounded-lg bg-white/5 text-gray-500 flex items-center justify-center hover:bg-white/10"><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(p.id); setEditData(p); }} className="w-8 h-8 rounded-lg bg-white/5 text-gray-500 flex items-center justify-center hover:bg-white/10"><Edit2 size={14} /></button>
                    <button onClick={() => deletePremio(p.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20"><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div>
          {!adding ? (
            <button onClick={() => { setAdding(true); setForm({ posicion: premios.length + 1, titulo: "", descripcion: "", emoji: "🏆" }); }} className="btn-secondary w-full">
              <Plus size={16} /> Agregar premio
            </button>
          ) : (
            <div className="card p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-white">Nuevo premio</h3>
              <div className="flex gap-2">
                <select value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} className="input-field w-16 text-center text-xl">
                  {emojis.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <input type="number" value={form.posicion} onChange={e => setForm({...form, posicion: parseInt(e.target.value)})} className="input-field w-16 text-center" min={1} placeholder="Pos" />
                <input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} className="input-field flex-1" placeholder="Ej: 1° Puesto" />
              </div>
              <input value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="input-field" placeholder="Descripción del premio (ej: $5000, pizza para todos, etc.)" />
              <div className="flex gap-2">
                <button onClick={addPremio} className="btn-primary flex-1">Guardar</button>
                <button onClick={() => setAdding(false)} className="btn-ghost flex-1">Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
