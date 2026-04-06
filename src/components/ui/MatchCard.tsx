import { Match, getFlagUrl, getMatchStatus } from "@/types";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";

interface MatchCardProps {
  match: Match;
  prediction?: { pred_local: number; pred_visitante: number; puntos?: number } | null;
  showPrediction?: boolean;
  compact?: boolean;
}

export function MatchCard({ match, prediction, showPrediction, compact }: MatchCardProps) {
  const status = getMatchStatus(match);
  const matchDate = new Date(match.fecha_hora);
  const dateStr = formatInTimeZone(matchDate, "America/Argentina/Buenos_Aires", "dd/MM HH:mm");

  const isFinished = status === "finalizado";
  const isLive = status === "en_juego";

  return (
    <div className={`card card-hover p-4 ${compact ? "py-3" : "py-4"}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isLive && <span className="badge-live">🔴 EN VIVO</span>}
          {isFinished && <span className="badge-finished">✓ Final</span>}
          {!isLive && !isFinished && <span className="badge-pending">⏰ {dateStr}</span>}
        </div>
        <span className="text-xs text-green-700 font-medium">{match.fase}{match.jornada ? ` · ${match.jornada}` : ""}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Local */}
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <FlagImg country={match.equipo_local} />
          <span className="text-sm font-semibold text-center text-green-100 leading-tight">{match.equipo_local}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          {isFinished && match.resultado_real_local !== null ? (
            <div className="flex items-center gap-2">
              <span className="section-title text-3xl text-white">{match.resultado_real_local}</span>
              <span className="text-green-600">–</span>
              <span className="section-title text-3xl text-white">{match.resultado_real_visitante}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="section-title text-2xl text-green-700">–</span>
              <span className="text-green-800">VS</span>
              <span className="section-title text-2xl text-green-700">–</span>
            </div>
          )}
          {!isFinished && !isLive && (
            <span className="text-xs text-green-600">{dateStr}</span>
          )}
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <FlagImg country={match.equipo_visitante} />
          <span className="text-sm font-semibold text-center text-green-100 leading-tight">{match.equipo_visitante}</span>
        </div>
      </div>

      {/* Prediction */}
      {showPrediction && prediction && (
        <div className="mt-3 pt-3 border-t border-green-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span>Tu pronóstico:</span>
            <span className="font-mono font-bold text-white">{prediction.pred_local} – {prediction.pred_visitante}</span>
          </div>
          {prediction.puntos !== undefined && isFinished && (
            <div className={
              prediction.puntos === 3 ? "pts-3" :
              prediction.puntos === 1 ? "pts-1" : "pts-0"
            }>
              {prediction.puntos}pts
            </div>
          )}
          {!isFinished && (
            <span className="text-xs text-green-700">Pendiente</span>
          )}
        </div>
      )}
    </div>
  );
}

function FlagImg({ country }: { country: string }) {
  const url = getFlagUrl(country);
  if (!url) return <span className="text-2xl">🏳️</span>;
  return (
    <div className="w-9 h-6 relative overflow-hidden rounded shadow-sm">
      <Image src={url} alt={country} fill className="object-cover" unoptimized />
    </div>
  );
}
