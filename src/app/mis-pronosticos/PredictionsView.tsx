"use client";
import { useState, useCallback } from "react";
import { Match, getMatchStatus, getFlagUrl, calcPoints } from "@/types";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { formatInTimeZone } from "date-fns-tz";
import { Lock, Check, Edit2 } from "lucide-react";

const FASE_ORDER = [
  "Grupo A","Grupo B","Grupo C","Grupo D","Grupo E","Grupo F",
  "Grupo G","Grupo H","Grupo I","Grupo J","Grupo K","Grupo L",
  "Octavos de Final","Cuartos de Final","Semifinal","Tercer Puesto","Final"
];

type PredMap = Record<string, { id?: string; pred_local: number; pred_visitante: number; puntos?: number }>;

export function PredictionsView({
  matches, predMap: initialPredMap, userId, globalDeadline
}: {
  matches: Match[];
  predMap: PredMap;
  userId: string;
  globalDeadline: string | null;
}) {
  const [predMap, setPredMap] = useState<PredMap>(initialPredMap);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState("todos");

  const globalLocked = globalDeadline ? new Date() > new Date(globalDeadline) : false;

  const isLocked = (match: Match) => {
    if (globalLocked) return true;
    return new Date() >= new Date(match.fecha_hora);
  };

  const savePrediction = useCallback(async (match: Match) => {
    const pred = predMap[match.id];
    if (!pred) return;
    setSaving(s => ({ ...s, [match.id]: true }));
    const sb = createClient();
    const existing = pred.id;
    if (existing) {
      await sb.from("predictions").update({ pred_local: pred.pred_local, pred_visitante: pred.pred_visitante, updated_at: new Date().toISOString() }).eq("id", existing);
    } else {
      const { data } = await sb.from("predictions").insert({ user_id: userId, match_id: match.id, pred_local: pred.pred_local, pred_visitante: pred.pred_visitante }).select().single();
      if (data) setPredMap(m => ({ ...m, [match.id]: { ...m[match.id], id: data.id } }));
    }
    setSaving(s => ({ ...s, [match.id]: false }));
    setSaved(s => ({ ...s, [match.id]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [match.id]: false })), 2000);
  }, [predMap, userId]);

  const setPred = (matchId: string, field: "pred_local" | "pred_visitante", val: number) => {
    const n = Math.max(0, Math.min(99, isNaN(val) ? 0 : val));
    setPredMap(m => ({ ...m, [matchId]: { ...m[matchId], [field]: n } }));
  };

  // Group by fase
  const byFase: Record<string, Match[]> = {};
  for (const m of matches) {
    if (filter !== "todos" && m.fase !== filter) continue;
    if (!byFase[m.fase]) byFase[m.fase] = [];
    byFase[m.fase].push(m);
  }

  const fases = Object.keys(byFase).sort((a, b) => {
    const ia = FASE_ORDER.indexOf(a); const ib = FASE_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const allFases = [...new Set(matches.map(m => m.fase))].sort((a, b) => {
    const ia = FASE_ORDER.indexOf(a); const ib = FASE_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  // Stats
  const totalPts = Object.values(predMap).reduce((a, p) => a + (p.puntos ?? 0), 0);
  const exactos = Object.values(predMap).filter(p => p.puntos === 3).length;
  const aciertos = Object.values(predMap).filter(p => p.puntos === 1).length;
  const cargados = Object.keys(predMap).length;

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Puntos", value: totalPts, color: "text-yellow-400" },
          { label: "Exactos 🎯", value: exactos, color: "text-green-300" },
          { label: "Aciertos ✅", value: aciertos, color: "text-green-400" },
          { label: "Cargados", value: `${cargados}/${matches.length}`, color: "text-green-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-3 text-center">
            <div className={`section-title text-3xl ${color}`}>{value}</div>
            <div className="text-xs text-green-700">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter by fase */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter("todos")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === "todos" ? "bg-green-700 text-white" : "border border-green-800 text-green-500"}`}>Todos</button>
        {allFases.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-green-700 text-white" : "border border-green-800 text-green-500"}`}>{f}</button>
        ))}
      </div>

      {/* Matches */}
      <div className="flex flex-col gap-8">
        {fases.map(fase => (
          <div key={fase}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="section-title text-2xl text-green-400">{fase}</h2>
              <div className="flex-1 h-px bg-green-900/50" />
            </div>
            <div className="flex flex-col gap-3">
              {byFase[fase].map(match => {
                const status = getMatchStatus(match);
                const locked = isLocked(match);
                const pred = predMap[match.id];
                const matchDate = formatInTimeZone(new Date(match.fecha_hora), "America/Argentina/Buenos_Aires", "dd/MM HH:mm");

                let pts: number | undefined;
                if (status === "finalizado" && match.resultado_real_local !== null && pred) {
                  pts = calcPoints(pred.pred_local, pred.pred_visitante, match.resultado_real_local!, match.resultado_real_visitante!);
                }

                return (
                  <div key={match.id} className={`card p-4 ${locked ? "opacity-90" : ""}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {status === "en_juego" && <span className="badge-live">🔴 EN VIVO</span>}
                        {status === "finalizado" && <span className="badge-finished">✓ Final</span>}
                        {status === "pendiente" && <span className="badge-pending">📅 {matchDate}</span>}
                        {locked && <Lock size={12} className="text-red-400" />}
                      </div>
                      <span className="text-xs text-green-700">{match.jornada ?? match.fase}</span>
                    </div>

                    {/* Teams + inputs */}
                    <div className="flex items-center gap-3">
                      {/* Local */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <FlagImg country={match.equipo_local} />
                        <span className="text-xs font-semibold text-center text-green-100 leading-tight">{match.equipo_local}</span>
                      </div>

                      {/* Score inputs */}
                      <div className="flex items-center gap-2 shrink-0">
                        {locked ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 text-center">
                              {pred ? <span className="section-title text-3xl text-white">{pred.pred_local}</span> : <span className="text-green-800">–</span>}
                            </div>
                            <span className="text-green-700">:</span>
                            <div className="w-12 text-center">
                              {pred ? <span className="section-title text-3xl text-white">{pred.pred_visitante}</span> : <span className="text-green-800">–</span>}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number" min={0} max={99}
                              value={pred?.pred_local ?? ""}
                              onChange={e => setPred(match.id, "pred_local", parseInt(e.target.value))}
                              className="score-input"
                              placeholder="0"
                            />
                            <span className="text-green-700">:</span>
                            <input
                              type="number" min={0} max={99}
                              value={pred?.pred_visitante ?? ""}
                              onChange={e => setPred(match.id, "pred_visitante", parseInt(e.target.value))}
                              className="score-input"
                              placeholder="0"
                            />
                          </div>
                        )}
                      </div>

                      {/* Visitante */}
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <FlagImg country={match.equipo_visitante} />
                        <span className="text-xs font-semibold text-center text-green-100 leading-tight">{match.equipo_visitante}</span>
                      </div>
                    </div>

                    {/* Result real + points */}
                    {status === "finalizado" && match.resultado_real_local !== null && (
                      <div className="mt-3 pt-3 border-t border-green-900/50 flex items-center justify-between text-sm">
                        <span className="text-green-600">Resultado: <span className="text-white font-bold">{match.resultado_real_local} – {match.resultado_real_visitante}</span></span>
                        {pts !== undefined && (
                          <div className={pts === 3 ? "pts-3" : pts === 1 ? "pts-1" : "pts-0"}>{pts}pts</div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {!locked && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-green-700">Cierra: {matchDate}</span>
                        <button
                          onClick={() => savePrediction(match)}
                          disabled={saving[match.id] || pred?.pred_local === undefined}
                          className="btn-primary text-sm py-1.5 px-4 flex items-center gap-2"
                        >
                          {saving[match.id] ? "..." : saved[match.id] ? <><Check size={14} /> Guardado</> : <><Edit2 size={14} /> Guardar</>}
                        </button>
                      </div>
                    )}
                    {locked && !status.includes("finalizado") && (
                      <p className="mt-3 text-xs text-red-400 flex items-center gap-1"><Lock size={11} /> Pronóstico cerrado (partido iniciado)</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlagImg({ country }: { country: string }) {
  const url = getFlagUrl(country);
  if (!url) return <span className="text-xl">🏳️</span>;
  return (
    <div className="w-8 h-5 relative overflow-hidden rounded shadow-sm">
      <Image src={url} alt={country} fill className="object-cover" unoptimized />
    </div>
  );
}
