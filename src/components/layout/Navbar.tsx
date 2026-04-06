"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Trophy, Calendar, ListTodo, User, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/fixture", label: "Fixture", icon: Calendar },
  { href: "/mis-pronosticos", label: "Pronósticos", icon: ListTodo, auth: true },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/premios", label: "Premios", icon: Trophy },
  { href: "/perfil", label: "Mi Perfil", icon: User, auth: true },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await sb.from("profiles").select("role").eq("id", data.user.id).single();
        setUser({ email: data.user.email, role: profile?.role });
      } else {
        setUser(null);
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-black text-sm">⚽</div>
          <div>
            <span className="section-title text-lg text-white leading-none">PRODE</span>
            <span className="section-title text-lg text-orange-500 leading-none ml-1.5">26</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon, auth }) => {
            if (auth && !user) return null;
            return (
              <Link key={href} href={href} className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === href ? "bg-orange-500/10 text-orange-400" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}>
                <Icon size={14} />{label}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link href="/admin" className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              pathname === "/admin" ? "bg-orange-500/10 text-orange-400" : "text-orange-600 hover:text-orange-400 hover:bg-orange-500/5"
            )}>
              <Shield size={14} />Admin
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors">
              <LogOut size={15} />Salir
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm py-2 px-4">Ingresar</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">Registrarse</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-black/95 px-4 py-4 flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon, auth }) => {
            if (auth && !user) return null;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                pathname === href ? "bg-orange-500/10 text-orange-400" : "text-gray-400"
              )}>
                <Icon size={17} />{label}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-orange-600">
              <Shield size={17} />Admin
            </Link>
          )}
          <div className="border-t border-white/5 mt-2 pt-3">
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 w-full">
                <LogOut size={17} />Cerrar sesión
              </button>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 btn-ghost text-center py-2.5">Ingresar</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1 btn-primary text-center py-2.5">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
