"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Calendar, Settings, RefreshCw, Check, X } from "lucide-react";

type Tab = "usuarios" | "resultados" | "config";

export function AdminView({ users: initialUsers, matches, settings: initialSettings }: {
  users: any[];
  matches: any[];
  settings: any;
}) {
  const [tab, setTab] = useState<Tab>("usuarios");
  const [users, setUsers] = useState(initialUsers);
  const [results, setResults] = useState<Record<string, { local: string; visitante: string }>>(
    Object.fromEntries(matches.map((m: any) => [m.id, { local: m.resultado_real_local?.toString() ?? "", visitante: m.resultado_real_visitante?.toString() ?? "" }]))
  );
  const [deadline, setDeadline] = useState(initialSettings?.prediction_deadline ?? "");
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [syncStatus, setSyncStatus] = useState("");

  const toggleApproved = async (userId: string, current: boolean) => {
    const sb = createClient();
    await sb.from("profiles").update({ approved: !current }).eq("id", userId);
    setUsers(us => us.map(u => u.id === userId ? { ...u, approved: !current } : u));
  };

  const setRole = async (userId: string, role: string) => {
    const sb = createClient();
    await sb.from("profiles").update({ role }).eq("id", userId);
    setUsers(us => us.map(u => u.id === userId ? { ...u, role } : u));
  };

  const saveResult = async (matchId: string) => {
    const r = results[matchId];
    if (r.local === "" || r.visitante === "") return;
    setSaving(s => ({ ...s, [matchId]: true }));
    const sb = createClient();
    await sb.from("matches").update({
      resultado_real_local: parseInt(r.local),
      resultado_real_visitante: parseInt(r.visitante),
    }).eq("id", matchId);
    setSaving(s => ({ ...s, [matchId]: false }));
  };

  const saveDeadline = async () => {
    const sb = createClient();
    await sb.from("settings").upsert({ id: 1, prediction_deadline: deadline || null });
    alert("Deadline guardado");
  };

  const syncResults = async () => {
    setSyncStatus("Sincronizando...");
    try {
      const res = await fetch("/api/sync-results", { method: "POST" });
      const data = await res.json();
      setSyncStatus(`✓ ${data.updated ?? 0} resultados actualizados`);
    } catch {
      setSyncStatus("Error al sincronizar");
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "resultados", label: "Resultados", icon: Calendar },
    { id: "config", label: "Config", icon: Settings },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-green-900/50 pb-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-green-800/50 text-green-300" : "text-green-600 hover:text-green-400"}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {tab === "usuarios" && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-green-900/50 flex justify-between items-center">
            <h2 className="font-semibold text-white">Participantes ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-prode">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th className="text-center">Aprobado</th>
                  <th className="text-center">Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="font-medium text-white">{u.nombre} {u.apellido}</td>
                    <td className="text-green-500 text-sm">{u.email}</td>
                    <td className="text-center">
                      <button onClick={() => toggleApproved(u.id, u.approved)} className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors ${u.approved ? "bg-green-700/40 text-green-300 hover:bg-red-800/40" : "bg-red-900/40 text-red-400 hover:bg-green-700/40"}`}>
                        {u.approved ? <Check size={14} /> : <X size={14} />}
                      </button>
                    </td>
                    <td className="text-center">
                      <select value={u.role} onChange={e => setRole(u.id, e.target.value)} className="bg-green-950 border border-green-800 text-green-300 text-xs px-2 py-1 rounded">
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

      {/* Results tab */}
      {tab === "resultados" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Cargar resultados</h2>
            <div className="flex items-center gap-3">
              {syncStatus && <span className="text-sm text-green-400">{syncStatus}</span>}
              <button onClick={syncResults} className="btn-secondary text-sm flex items-center gap-2">
                <RefreshCw size={14} /> Sync automático
              </button>
            </div>
          </div>
          <p className="text-xs text-green-700 mb-4">El sync automático obtiene resultados de football-data.org. También podés cargar manualmente.</p>
          <div className="flex flex-col gap-3">
            {matches.map((m: any) => (
              <div key={m.id} className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{m.equipo_local} vs {m.equipo_visitante}</div>
                  <div className="text-xs text-green-600">{m.fase}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number" min={0} max={99}
                    value={results[m.id]?.local ?? ""}
                    onChange={e => setResults(r => ({ ...r, [m.id]: { ...r[m.id], local: e.target.value } }))}
                    className="w-14 text-center bg-green-950 border border-green-800 text-white font-mono px-2 py-1.5 rounded text-sm focus:outline-none focus:border-green-500"
                    placeholder="–"
                  />
                  <span className="text-green-700">:</span>
                  <input
                    type="number" min={0} max={99}
                    value={results[m.id]?.visitante ?? ""}
                    onChange={e => setResults(r => ({ ...r, [m.id]: { ...r[m.id], visitante: e.target.value } }))}
                    className="w-14 text-center bg-green-950 border border-green-800 text-white font-mono px-2 py-1.5 rounded text-sm focus:outline-none focus:border-green-500"
                    placeholder="–"
                  />
                  <button onClick={() => saveResult(m.id)} disabled={saving[m.id]} className="btn-primary text-xs py-1.5 px-3">
                    {saving[m.id] ? "..." : "✓"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Config tab */}
      {tab === "config" && (
        <div className="max-w-lg">
          <div className="card p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white">Configuración global</h2>
            <div>
              <label className="text-sm text-green-400 mb-1.5 block">Fecha límite global de pronósticos</label>
              <p className="text-xs text-green-700 mb-2">Si se especifica, los usuarios no podrán modificar pronósticos después de esta fecha, independientemente del horario del partido.</p>
              <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="input-field"
              />
            </div>
            <button onClick={saveDeadline} className="btn-primary">Guardar configuración</button>
          </div>
        </div>
      )}
    </div>
  );
}
