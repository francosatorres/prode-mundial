"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Calendar, Settings, RefreshCw, Check, X, Trash2 } from "lucide-react";

type Tab = "usuarios" | "resultados" | "config";

export function AdminView({ users: initialUsers, matches, settings: initialSettings }: {
  users: any[]; matches: any[]; settings: any;
}) {
  const [tab, setTab] = useState<Tab>("usuarios");
  const [users, setUsers] = useState(initialUsers);
  const [results, setResults] = useState<Record<string, { local: string; visitante: string }>>(
    Object.fromEntries(matches.map((m: any) => [m.id, { local: m.resultado_real_local?.toString() ?? "", visitante: m.resultado_real_visitante?.toString() ?? "" }]))
  );
  const [deadline, setDeadline] = useState(initialSettings?.prediction_deadline ?? "");
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [syncStatus, setSyncStatus] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const sb = createClient();

  const toggleApproved = async (userId: string, current: boolean) => {
    await sb.from("profiles").update({ approved: !current }).eq("id", userId);
    setUsers(us => us.map(u => u.id === userId ? { ...u, approved: !current } : u));
  };

  const setRole = async (userId: string, role: string) => {
    await sb.from("profiles").update({ role }).eq("id", userId);
    setUsers(us => us.map(u => u.id === userId ? { ...u, role } : u));
  };

  const saveResult = async (matchId: string) => {
    const r = results[matchId];
    if (r.local === "" || r.visitante === "") return;
    setSaving(s => ({ ...s, [matchId]: true }));
    await sb.from("matches").update({
      resultado_real_local: parseInt(r.local),
      resultado_real_visitante: parseInt(r.visitante),
    }).eq("id", matchId);
    setSaving(s => ({ ...s, [matchId]: false }));
  };

  const clearResult = async (matchId: string) => {
    await sb.from("matches").update({ resultado_real_local: null, resultado_real_visitante: null }).eq("id", matchId);
    setResults(r => ({ ...r, [matchId]: { local: "", visitante: "" } }));
  };

  const saveDeadline = async () => {
    await sb.from("settings").upsert({ id: 1, prediction_deadline: deadline || null });
    alert("✓ Configuración guardada");
  };

  const syncResults = async () => {
    setSyncStatus("Sincronizando...");
    try {
      const res = await fetch("/api/sync-results", { method: "POST" });
      const data = await res.json();
      setSyncStatus(`✓ ${data.updated ?? 0} resultados actualizados`);
    } catch { setSyncStatus("Error al sincronizar"); }
  };

  const clearAllPredictions = async () => {
    setClearing(true);
    await sb.from("predictions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setClearing(false);
    setClearConfirm(false);
    alert("✓ Todos los pronósticos fueron eliminados");
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "resultados", label: "Resultados", icon: Calendar },
    { id: "config", label: "Config", icon: Settings },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-white/5 pb-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${tab === id ? "border-orange-500 text-orange-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* USERS */}
      {tab === "usuarios" && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-semibold text-white">Participantes ({users.length})</h2>
            <p className="text-xs text-gray-600">Aprobá usuarios para que aparezcan en el ranking</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-prode">
              <thead><tr><th>Nombre</th><th>Email</th><th className="text-center">Aprobado</th><th className="text-center">Rol</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="font-medium text-white">{u.nombre} {u.apellido}</td>
                    <td className="text-gray-500 text-sm">{u.email}</td>
                    <td className="text-center">
                      <button onClick={() => toggleApproved(u.id, u.approved)} className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors ${u.approved ? "bg-orange-500/15 text-orange-400 hover:bg-red-500/15 hover:text-red-400" : "bg-white/5 text-gray-600 hover:bg-orange-500/15 hover:text-orange-400"}`}>
                        {u.approved ? <Check size={14} /> : <X size={14} />}
                      </button>
                    </td>
                    <td className="text-center">
                      <select value={u.role} onChange={e => setRole(u.id, e.target.value)} className="bg-black/50 border border-white/10 text-gray-300 text-xs px-2 py-1 rounded-lg outline-none">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {tab === "resultados" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-white">Cargar resultados</h2>
              <p className="text-xs text-gray-600 mt-0.5">Podés cargar manualmente o sincronizar con football-data.org</p>
            </div>
            <div className="flex items-center gap-3">
              {syncStatus && <span className="text-sm text-orange-400">{syncStatus}</span>}
              <button onClick={syncResults} className="btn-secondary text-sm flex items-center gap-2">
                <RefreshCw size={14} />Actualizar resultados
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {matches.map((m: any) => (
              <div key={m.id} className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{m.equipo_local} vs {m.equipo_visitante}</div>
                  <div className="text-xs text-gray-600">{m.fase}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input type="number" min={0} max={99} value={results[m.id]?.local ?? ""} onChange={e => setResults(r => ({ ...r, [m.id]: { ...r[m.id], local: e.target.value } }))} className="w-12 text-center bg-black/50 border border-white/10 text-white font-mono px-1 py-1.5 rounded-lg text-sm focus:outline-none focus:border-orange-500" placeholder="–" />
                  <span className="text-gray-700">:</span>
                  <input type="number" min={0} max={99} value={results[m.id]?.visitante ?? ""} onChange={e => setResults(r => ({ ...r, [m.id]: { ...r[m.id], visitante: e.target.value } }))} className="w-12 text-center bg-black/50 border border-white/10 text-white font-mono px-1 py-1.5 rounded-lg text-sm focus:outline-none focus:border-orange-500" placeholder="–" />
                  <button onClick={() => saveResult(m.id)} disabled={saving[m.id]} className="btn-primary text-xs py-1.5 px-3">{saving[m.id] ? "..." : "✓ Guardar"}</button>
                  {(results[m.id]?.local !== "" || results[m.id]?.visitante !== "") && (
                    <button onClick={() => clearResult(m.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20"><X size={13} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFIG */}
      {tab === "config" && (
        <div className="flex flex-col gap-5 max-w-lg">
          <div className="card p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white">Fecha límite de pronósticos</h2>
            <p className="text-xs text-gray-600">Si se especifica, los usuarios no podrán modificar pronósticos después de esta fecha, sin importar el horario del partido.</p>
            <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} className="input-field" />
            <div className="flex gap-2">
              <button onClick={saveDeadline} className="btn-primary flex-1">Guardar</button>
              {deadline && <button onClick={() => { setDeadline(""); sb.from("settings").upsert({ id: 1, prediction_deadline: null }); }} className="btn-ghost">Quitar límite</button>}
            </div>
          </div>

          {/* VACIAR PRODE */}
          <div className="card p-6 flex flex-col gap-4 border-red-500/20">
            <div>
              <h2 className="font-semibold text-white flex items-center gap-2"><Trash2 size={16} className="text-red-400" />Vaciar prode</h2>
              <p className="text-xs text-gray-600 mt-1">Elimina TODOS los pronósticos de todos los usuarios. No se puede deshacer.</p>
            </div>
            {!clearConfirm ? (
              <button onClick={() => setClearConfirm(true)} className="btn-danger">Vaciar todos los pronósticos</button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-red-400 text-sm font-medium">⚠️ ¿Estás seguro? Esto borra TODOS los pronósticos permanentemente.</p>
                <div className="flex gap-2">
                  <button onClick={clearAllPredictions} disabled={clearing} className="btn-danger flex-1">{clearing ? "Borrando..." : "Sí, vaciar todo"}</button>
                  <button onClick={() => setClearConfirm(false)} className="btn-ghost flex-1">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
