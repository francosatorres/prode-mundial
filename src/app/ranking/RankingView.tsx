"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Medal } from "lucide-react";

type RankingRow = { user_id: string; nombre: string; apellido: string; total_puntos: number; exactos: number; aciertos: number };

export function RankingView({ ranking: initialRanking, fases, jornadas }: {
  ranking: RankingRow[];
  fases: string[];
  jornadas: string[];
}) {
  const [ranking, setRanking] = useState(initialRanking);
  const [fase, setFase] = useState("");
  const [jornada, setJornada] = useState("");
  const [loading, setLoading] = useState(false);

  const applyFilter = async (newFase: string, newJornada: string) => {
    setFase(newFase);
    setJornada(newJornada);
    setLoading(true);
    const sb = createClient();
    let data: RankingRow[] | null = null;
    if (newFase || newJornada) {
      const res = await sb.rpc("get_ranking_filtered", { p_fase: newFase || null, p_jornada: newJornada || null });
      data = res.data;
    } else {
      const res = await sb.rpc("get_ranking");
      data = res.data;
    }
    setRanking(data ?? []);
    setLoading(false);
  };

  const medalColor = (i: number) => {
    if (i === 0) return "text-yellow-400";
    if (i === 1) return "text-zinc-300";
    if (i === 2) return "text-amber-600";
    return "text-green-700";
  };

  return (
    <div>
      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-green-600 mb-1 block">Fase</label>
          <select
            value={fase}
            onChange={e => applyFilter(e.target.value, jornada)}
            className="input-field text-sm"
          >
            <option value="">Todas las fases</option>
            {fases.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-green-600 mb-1 block">Jornada</label>
          <select
            value={jornada}
            onChange={e => applyFilter(fase, e.target.value)}
            className="input-field text-sm"
          >
            <option value="">Todas las jornadas</option>
            {jornadas.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        {(fase || jornada) && (
          <button onClick={() => applyFilter("", "")} className="btn-secondary text-sm self-end">✕ Limpiar</button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-green-600">Cargando ranking...</div>
        ) : ranking.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy size={40} className="mx-auto mb-3 text-green-800" />
            <p className="text-green-600">Sin datos para este filtro</p>
          </div>
        ) : (
          <table className="w-full table-prode">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Jugador</th>
                <th className="text-center">Pts</th>
                <th className="text-center hidden sm:table-cell">🎯 Exactos</th>
                <th className="text-center hidden sm:table-cell">✅ Aciertos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((row, i) => (
                <tr key={row.user_id} className={i < 3 ? "bg-green-950/20" : ""}>
                  <td>
                    <span className={`section-title text-2xl ${medalColor(i)}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold text-white">{row.nombre} {row.apellido}</span>
                  </td>
                  <td className="text-center">
                    <span className="section-title text-2xl text-green-400">{row.total_puntos}</span>
                  </td>
                  <td className="text-center hidden sm:table-cell text-yellow-400 font-mono">{row.exactos}</td>
                  <td className="text-center hidden sm:table-cell text-green-400 font-mono">{row.aciertos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-green-800 mt-4 text-center">
        🎯 3 pts por resultado exacto · ✅ 1 pt por ganador/empate
      </p>
    </div>
  );
}
