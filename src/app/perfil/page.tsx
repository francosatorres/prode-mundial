import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function PerfilPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();

  const { data: stats } = await sb.rpc("get_user_stats", { uid: user.id });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="section-title text-5xl text-white mb-8">MI PERFIL</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Puntos totales", value: stats?.[0]?.total_puntos ?? 0, color: "text-yellow-400" },
          { label: "Exactos", value: stats?.[0]?.exactos ?? 0, color: "text-green-400" },
          { label: "Aciertos", value: stats?.[0]?.aciertos ?? 0, color: "text-green-300" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`section-title text-4xl ${color}`}>{value}</div>
            <div className="text-xs text-green-600 mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-white mb-5 text-lg">Datos personales</h2>
        <ProfileForm profile={profile} userId={user.id} />
      </div>
      <div className="card p-5 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-green-500">Estado de cuenta</div>
            <div className="text-white font-medium mt-0.5">{profile?.approved ? "✅ Aprobado" : "⏳ Pendiente de aprobación"}</div>
          </div>
          <div>
            <div className="text-sm text-green-500">Rol</div>
            <div className="text-white font-medium mt-0.5 capitalize">{profile?.role ?? "user"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
