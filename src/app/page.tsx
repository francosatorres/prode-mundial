import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Trophy, Calendar, ListTodo } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { data: topRanking } = await supabase.rpc("get_ranking").limit(3);

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image Messi */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Messi_vs_Nigeria_2018.jpg/1280px-Messi_vs_Nigeria_2018.jpg"
            alt="Messi"
            className="w-full h-full object-cover object-top opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-sm text-orange-400 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Mundial 2026 · USA · CAN · MEX
            </div>
            <h1 className="section-title text-7xl md:text-8xl leading-[0.9] mb-6">
              <span className="text-white">EL PRODE</span>
              <br />
              <span className="text-orange-500">DEL</span>
              <br />
              <span className="text-white">MUNDIAL</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
              Pronósticá cada partido, competí con amigos y seguí el ranking en tiempo real durante todo el torneo.
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link href="/mis-pronosticos" className="btn-primary text-base px-8 py-3.5">
                    Mis Pronósticos <ArrowRight size={18} />
                  </Link>
                  <Link href="/ranking" className="btn-secondary text-base px-8 py-3.5">Ver Ranking</Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="btn-primary text-base px-8 py-3.5">
                    ¡Entrar ahora! <ArrowRight size={18} />
                  </Link>
                  <Link href="/login" className="btn-secondary text-base px-8 py-3.5">Ya tengo cuenta</Link>
                </>
              )}
            </div>
          </div>

          {/* Top 3 */}
          <div className="hidden md:block">
            <div className="card-orange p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="section-title text-2xl text-white">Top 3</h3>
                <Link href="/ranking" className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-1">
                  Ver todo <ArrowRight size={13} />
                </Link>
              </div>
              {!topRanking?.length ? (
                <p className="text-gray-600 text-sm py-4">El ranking arranca con los partidos</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {topRanking.map((row: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                      <span className="text-2xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                      <span className="flex-1 font-semibold text-white">{row.nombre} {row.apellido}</span>
                      <span className="section-title text-2xl text-orange-500">{row.total_puntos}</span>
                      <span className="text-xs text-gray-600">pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 pb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { v: "32", label: "Selecciones", e: "🌍" },
            { v: "104", label: "Partidos", e: "⚽" },
            { v: userCount ?? "–", label: "Participantes", e: "👥" },
            { v: "$0", label: "Costo hosting", e: "💸" },
          ].map(({ v, label, e }) => (
            <div key={label} className="card p-5 text-center card-hover">
              <div className="text-2xl mb-1">{e}</div>
              <div className="section-title text-4xl text-orange-500">{v}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {[
            { icon: Calendar, title: "Seguí el fixture", desc: "Todos los partidos con resultados actualizados en tiempo real.", href: "/fixture" },
            { icon: ListTodo, title: "Cargá pronósticos", desc: "Predecí el marcador exacto antes que empiece cada partido.", href: "/mis-pronosticos" },
            { icon: Trophy, title: "Competí en el ranking", desc: "3 puntos por exacto, 1 punto por ganador. El mejor gana.", href: "/ranking" },
          ].map(({ icon: Icon, title, desc, href }) => (
            <Link key={href} href={href} className="card card-hover p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Icon size={20} className="text-orange-500" />
              </div>
              <div>
                <div className="font-semibold text-white mb-1.5">{title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* POINTS SYSTEM */}
        <div className="card-orange p-8 md:p-10 text-center rounded-2xl">
          <h2 className="section-title text-4xl text-white mb-1">Sistema de puntos</h2>
          <p className="text-gray-500 mb-10">Simple y transparente</p>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { pts: "3", emoji: "🎯", label: "Resultado exacto", color: "text-orange-500" },
              { pts: "1", emoji: "✅", label: "Ganador / Empate", color: "text-gray-200" },
              { pts: "0", emoji: "❌", label: "Fallo", color: "text-red-400" },
            ].map(({ pts, emoji, label, color }) => (
              <div key={pts} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{emoji}</span>
                <span className={`section-title text-6xl ${color}`}>{pts}</span>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
