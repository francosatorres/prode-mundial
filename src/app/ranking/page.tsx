import { createClient } from "@/lib/supabase/server";
import { RankingView } from "./RankingView";

export const revalidate = 60;

export default async function RankingPage() {
  const sb = await createClient();
  const { data: ranking } = await sb.rpc("get_ranking");
  const { data: matches } = await sb.from("matches").select("fase, jornada").order("fecha_hora");

  const fases = [...new Set((matches ?? []).map((m: any) => m.fase))];
  const jornadas = [...new Set((matches ?? []).filter((m: any) => m.jornada).map((m: any) => m.jornada))];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title text-6xl text-white">RANKING</h1>
        <p className="text-green-500 mt-1">Clasificación general del torneo</p>
      </div>
      <RankingView ranking={ranking ?? []} fases={fases} jornadas={jornadas} />
    </div>
  );
}
