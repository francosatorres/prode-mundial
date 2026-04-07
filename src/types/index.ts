export type Profile = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: "admin" | "user";
  approved: boolean;
  created_at: string;
};

export type Match = {
  id: string;
  fecha_hora: string;
  equipo_local: string;
  equipo_visitante: string;
  fase: string;
  jornada: string | null;
  resultado_real_local: number | null;
  resultado_real_visitante: number | null;
  grupo: string | null;
};

export type Prediction = {
  id: string;
  user_id: string;
  match_id: string;
  pred_local: number;
  pred_visitante: number;
  created_at: string;
  updated_at: string;
  puntos?: number;
};

export type PredictionWithMatch = Prediction & {
  match: Match;
};

export type RankingRow = {
  user_id: string;
  nombre: string;
  apellido: string;
  total_puntos: number;
  exactos: number;
  aciertos: number;
};

export type MatchWithPrediction = Match & {
  prediction?: Prediction | null;
  status: "pendiente" | "en_juego" | "finalizado";
};

export const COUNTRY_CODES: Record<string, string> = {
  "Argentina": "ar",
  "Francia": "fr",
  "Brasil": "br",
  "Inglaterra": "gb-eng",
  "España": "es",
  "Alemania": "de",
  "Portugal": "pt",
  "Paises Bajos": "nl",
  "Bélgica": "be",
  "Uruguay": "uy",
  "Croacia": "hr",
  "Marruecos": "ma",
  "Japón": "jp",
  "Senegal": "sn",
  "Corea del Sur": "kr",
  "Australia": "au",
  "Polonia": "pl",
  "México": "mx",
  "Estados Unidos": "us",
  "Canadá": "ca",
  "Ecuador": "ec",
  "Qatar": "qa",
  "Suiza": "ch",
  "Dinamarca": "dk",
  "Serbia": "rs",
  "Camerún": "cm",
  "Ghana": "gh",
  "Túnez": "tn",
  "Costa Rica": "cr",
  "Arabia Saudita": "sa",
  "Irán": "ir",
  "Gales": "gb-wls",
  "Por definir": "un",
};
export function getFlagUrl(country: string): string {
  const code = COUNTRY_CODES[country];
  if (!code) return "";
  return `https://flagcdn.com/w40/${code}.png`;
}

export function getMatchStatus(match: Match): "pendiente" | "en_juego" | "finalizado" {
  const now = new Date();
  const matchTime = new Date(match.fecha_hora);
  const matchEndTime = new Date(matchTime.getTime() + 105 * 60 * 1000); // 105 min

  if (match.resultado_real_local !== null && match.resultado_real_visitante !== null) {
    return "finalizado";
  }
  if (now >= matchTime && now < matchEndTime) {
    return "en_juego";
  }
  if (now >= matchEndTime) {
    return "finalizado";
  }
  return "pendiente";
}

export function calcPoints(
  predLocal: number,
  predVisitante: number,
  realLocal: number,
  realVisitante: number
): number {
  if (predLocal === realLocal && predVisitante === realVisitante) return 3;
  const predSign = Math.sign(predLocal - predVisitante);
  const realSign = Math.sign(realLocal - realVisitante);
  if (predSign === realSign) return 1;
  return 0;
}
