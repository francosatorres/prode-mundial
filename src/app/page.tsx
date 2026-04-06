import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Trophy, Calendar, ListTodo, ArrowRight, Zap, Shield, Users } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Quick stats
  const { count: matchCount } = await supabase.from("matches").select("*", { count: "exact", head: true });
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  // Top 3 ranking
  const { data: topRanking } = await supabase.rpc("get_ranking").limit(3);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(21,128,61,0.2)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 border border-green-700/50 bg-green-900/20 px-4 py-1.5 rounded-full text-sm text-green-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Mundial 2026 · USA · CAN · MEX
          </div>

          <h1 className="section-title text-7xl md:text-9xl text-white leading-none mb-4">
            PRODE
            <br />
            <span className="text-green-400">MUNDIAL</span>
            <br />
            <span className="text-yellow-400">2026</span>
          </h1>

          <p className="text-green-300 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Hacé tus pronósticos, competí con amigos y seguí el ranking en tiempo real durante todo el torneo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <>
                <Link href="/mis-pronosticos" className="btn-gold text-lg px-8 py-3 flex items-center justify-center gap-2">
                  Mis Pronósticos <ArrowRight size={20} />
                </Link>
                <Link href="/fixture" className="btn-secondary text-lg px-8 py-3">Ver Fixture</Link>
              </>
            ) : (
              <>
                <Link href="/register" className="btn-gold text-lg px-8 py-3 flex items-center justify-center gap-2">
                  ¡Entrar ahora! <ArrowRight size={20} />
                </Link>
                <Link href="/login" className="btn-secondary text-lg px-8 py-3">Ya tengo cuenta</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "48", label: "Partidos de grupos", icon: "⚽" },
            { value: "32", label: "Selecciones", icon: "🌍" },
            { value: matchCount ?? "–", label: "Partidos cargados", icon: "📅" },
            { value: userCount ?? "–", label: "Participantes", icon: "👥" },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="section-title text-4xl text-green-400">{stat.value}</div>
              <div className="text-xs text-green-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features + Ranking */}
      <section className="max-w-7xl mx-auto px-4 mb-12 grid md:grid-cols-2 gap-8">
        {/* Features */}
        <div>
          <h2 className="section-title text-4xl text-white mb-6">¿Cómo funciona?</h2>
          <div className="flex flex-col gap-4">
            {[
              { icon: Calendar, title: "Seguí el fixture", desc: "Todos los partidos ordenados por fase y fecha, con resultados en tiempo real.", href: "/fixture" },
              { icon: ListTodo, title: "Cargá pronósticos", desc: "Predecí el resultado exacto antes de cada partido. Podés editar hasta que empiece.", href: "/mis-pronosticos" },
              { icon: Trophy, title: "Competí en el ranking", desc: "3 pts por exacto, 1 pt por ganador. El mejor queda campeón del prode.", href: "/ranking" },
            ].map(({ icon: Icon, title, desc, href }) => (
              <Link key={href} href={href} className="card card-hover p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-green-900/60 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={20} className="text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">{title}</div>
                  <div className="text-sm text-green-500">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top 3 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title text-4xl text-white">Top 3</h2>
            <Link href="/ranking" className="text-sm text-green-500 hover:text-green-300 flex items-center gap-1">
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {!topRanking || topRanking.length === 0 ? (
              <div className="card p-8 text-center text-green-700">
                <Trophy size={32} className="mx-auto mb-2 opacity-30" />
                <p>El ranking se actualizará cuando empiecen los partidos</p>
              </div>
            ) : (
              topRanking.map((row: { nombre: string; apellido: string; total_puntos: number }, i: number) => (
                <div key={i} className="card p-4 flex items-center gap-4">
                  <div className={`section-title text-4xl ${i === 0 ? "text-yellow-400" : i === 1 ? "text-zinc-300" : "text-amber-600"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{row.nombre} {row.apellido}</div>
                  </div>
                  <div className="text-right">
                    <div className="section-title text-3xl text-green-400">{row.total_puntos}</div>
                    <div className="text-xs text-green-700">puntos</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Sistema de puntaje */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="card p-8 md:p-10 text-center">
          <h2 className="section-title text-4xl text-white mb-2">Sistema de puntos</h2>
          <p className="text-green-500 mb-8">Así se calcula el puntaje de cada pronóstico</p>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { pts: "3", emoji: "🎯", label: "Resultado exacto", color: "text-yellow-400" },
              { pts: "1", emoji: "✅", label: "Ganador / Empate", color: "text-green-400" },
              { pts: "0", emoji: "❌", label: "Fallo", color: "text-red-400" },
            ].map(({ pts, emoji, label, color }) => (
              <div key={pts} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{emoji}</span>
                <span className={`section-title text-5xl ${color}`}>{pts}</span>
                <span className="text-xs text-green-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
