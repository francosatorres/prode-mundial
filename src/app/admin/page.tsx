import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminView } from "./AdminView";

export const revalidate = 0;

export default async function AdminPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { data: users } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
  const { data: matches } = await sb.from("matches").select("id, equipo_local, equipo_visitante, fecha_hora, fase, resultado_real_local, resultado_real_visitante").order("fecha_hora");
  const { data: settings } = await sb.from("settings").select("*").single();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🛡️</span>
        <div>
          <h1 className="section-title text-5xl text-white">PANEL ADMIN</h1>
          <p className="text-green-500">Gestión de usuarios, resultados y configuración</p>
        </div>
      </div>
      <AdminView users={users ?? []} matches={matches ?? []} settings={settings} />
    </div>
  );
}
