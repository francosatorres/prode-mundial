import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PredictionsView } from "./PredictionsView";

export const revalidate = 0;

export default async function MisPronosticosPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb.from("profiles").select("approved").eq("id", user.id).single();

  const { data: matches } = await sb.from("matches").select("*").order("fecha_hora", { ascending: true });
  const { data: predictions } = await sb.from("predictions").select("*").eq("user_id", user.id);

  // Check global deadline
  const { data: settings } = await sb.from("settings").select("prediction_deadline").single();
  const deadline: string | null = settings?.prediction_deadline ?? null;

  const predMap: Record<string, { id: string; pred_local: number; pred_visitante: number; puntos?: number }> = {};
  for (const p of predictions ?? []) predMap[p.match_id] = p;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title text-6xl text-white">MIS PRONÓSTICOS</h1>
        <p className="text-green-500 mt-1">Cargá tus predicciones antes de cada partido</p>
      </div>

      {!profile?.approved && (
        <div className="card border-yellow-700/50 bg-yellow-900/10 p-4 mb-6 text-yellow-300 text-sm">
          ⏳ Tu cuenta está pendiente de aprobación por el admin. Podés cargar pronósticos pero no serán contabilizados hasta ser aprobado.
        </div>
      )}

      {deadline && new Date() > new Date(deadline) && (
        <div className="card border-red-700/50 bg-red-900/10 p-4 mb-6 text-red-300 text-sm">
          🔒 El plazo global de modificación de pronósticos ha cerrado.
        </div>
      )}

      <PredictionsView
        matches={matches ?? []}
        predMap={predMap}
        userId={user.id}
        globalDeadline={deadline}
      />
    </div>
  );
}
