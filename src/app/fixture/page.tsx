import { createClient } from "@/lib/supabase/server";
import { Match } from "@/types";
import { FixtureView } from "./FixtureView";

export const revalidate = 60;

export default async function FixturePage() {
  const sb = await createClient();
  const { data: matches } = await sb
    .from("matches")
    .select("*")
    .order("fecha_hora", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title text-6xl text-white">FIXTURE</h1>
        <p className="text-green-500 mt-1">Mundial 2026 — Todos los partidos</p>
      </div>
      <FixtureView matches={(matches ?? []) as Match[]} />
    </div>
  );
}
