import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// football-data.org - Free tier (10 req/min)
// World Cup 2026 competition ID: WC (use 2018 as test: CL)
const COMPETITION = "WC"; // World Cup

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "FOOTBALL_API_KEY not set" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/${COMPETITION}/matches?status=FINISHED`,
      { headers: { "X-Auth-Token": apiKey } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: `API error: ${res.status}` }, { status: 500 });
    }

    const data = await res.json();
    const matches = data.matches ?? [];
    let updated = 0;

    for (const m of matches) {
      if (m.status !== "FINISHED") continue;
      const homeTeam = m.homeTeam?.name;
      const awayTeam = m.awayTeam?.name;
      const homeScore = m.score?.fullTime?.home;
      const awayScore = m.score?.fullTime?.away;

      if (!homeTeam || !awayTeam || homeScore === null || awayScore === null) continue;

      // Try to find match by team names (flexible matching)
      const { data: dbMatches } = await supabase
        .from("matches")
        .select("id")
        .or(`equipo_local.ilike.%${homeTeam.split(" ")[0]}%,equipo_local.ilike.%${homeTeam}%`)
        .limit(5);

      if (!dbMatches?.length) continue;

      for (const dbMatch of dbMatches) {
        const { error } = await supabase
          .from("matches")
          .update({ resultado_real_local: homeScore, resultado_real_visitante: awayScore })
          .eq("id", dbMatch.id);
        if (!error) updated++;
      }
    }

    return NextResponse.json({ updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
