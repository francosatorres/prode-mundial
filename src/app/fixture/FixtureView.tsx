"use client";
import { useState } from "react";
import { Match, getMatchStatus } from "@/types";
import { MatchCard } from "@/components/ui/MatchCard";
import { formatInTimeZone } from "date-fns-tz";

const FASE_ORDER = [
  "Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F",
  "Grupo G", "Grupo H", "Grupo I", "Grupo J", "Grupo K", "Grupo L",
  "Octavos de Final", "Cuartos de Final", "Semifinal", "Tercer Puesto", "Final"
];

export function FixtureView({ matches }: { matches: Match[] }) {
  const [filter, setFilter] = useState<"todos" | "grupos" | "eliminatorias">("todos");

  const filtered = matches.filter(m => {
    if (filter === "grupos") return m.fase.startsWith("Grupo");
    if (filter === "eliminatorias") return !m.fase.startsWith("Grupo");
    return true;
  });

  // Group by fase
  const byFase: Record<string, Match[]> = {};
  for (const m of filtered) {
    if (!byFase[m.fase]) byFase[m.fase] = [];
    byFase[m.fase].push(m);
  }

  const fases = Object.keys(byFase).sort((a, b) => {
    const ia = FASE_ORDER.indexOf(a);
    const ib = FASE_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["todos", "grupos", "eliminatorias"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === f ? "bg-green-700 text-white" : "border border-green-800 text-green-500 hover:border-green-600"
            }`}
          >
            {f === "todos" ? "Todos" : f === "grupos" ? "Fase de Grupos" : "Eliminatorias"}
          </button>
        ))}
      </div>

      {/* Matches by fase */}
      <div className="flex flex-col gap-8">
        {fases.map(fase => {
          const faseMatches = byFase[fase];
          // Group by jornada inside groups
          const isGroup = fase.startsWith("Grupo");
          const byJornada: Record<string, Match[]> = {};
          if (isGroup) {
            for (const m of faseMatches) {
              const key = m.jornada ?? "Sin fecha";
              if (!byJornada[key]) byJornada[key] = [];
              byJornada[key].push(m);
            }
          }

          return (
            <div key={fase}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="section-title text-3xl text-green-400">{fase}</h2>
                <div className="flex-1 h-px bg-green-900/50" />
                <span className="text-xs text-green-700">{faseMatches.length} partidos</span>
              </div>

              {isGroup ? (
                Object.entries(byJornada).sort(([a], [b]) => a.localeCompare(b)).map(([jornada, jornadaMatches]) => (
                  <div key={jornada} className="mb-4">
                    <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2 ml-1">{jornada}</h3>
                    <div className="flex flex-col gap-3">
                      {jornadaMatches.map(m => <MatchCard key={m.id} match={m} />)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col gap-3">
                  {faseMatches.map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
