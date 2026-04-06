import { createClient } from "@/lib/supabase/server";
import { PremiosView } from "./PremiosView";

export const revalidate = 60;

export default async function PremiosPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === "admin";
  }

  const { data: premios } = await sb.from("premios").select("*").order("posicion", { ascending: true });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title text-6xl text-white">PREMIOS</h1>
        <p className="text-gray-500 mt-1">Lo que se lleva el campeón del prode</p>
      </div>
      <PremiosView premios={premios ?? []} isAdmin={isAdmin} />
    </div>
  );
}
