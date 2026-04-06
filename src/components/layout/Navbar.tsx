"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Trophy, Calendar, ListTodo, User, Shield, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/fixture", label: "Fixture", icon: Calendar },
  { href: "/mis-pronosticos", label: "Pronósticos", icon: ListTodo, auth: true },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/perfil", label: "Mi Perfil", icon: User, auth: true },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    const sb = createClient();
    sb.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await sb
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        setUser({ email: data.user.email, role: profile?.role });
      } else {
        setUser(null);
      }
      setLoaded(true);
    });
  }

  const handleLogout = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-green-900/60 bg-[#0a1f0d]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl">⚽</span>
          <div>
            <div className="section-title text-2xl text-white leading-none">Prode</div>
            <div className="section-title text-sm text-green-400 leading-none tracking-widest">MUNDIAL 2026</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon, auth }) => {
            if (auth && !user) return null;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === href
                    ? "bg-green-800/50 text-green-300"
                    : "text-green-500 hover:text-green-200 hover:bg-green-900/30"
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === "/admin"
                  ? "bg-yellow-900/50 text-yellow-300"
                  : "text-yellow-600 hover:text-yellow-400 hover:bg-yellow-900/20"
              )}
            >
              <Shield size={15} /> Admin
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-green-600 hover:text-red-400 transition-colors">
              <LogOut size={16} /> Salir
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm py-1.5 px-4">Ingresar</Link>
              <Link href="/register" className="btn-primary text-sm py-1.5 px-4">Registrarse</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-green-400" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-green-900/50 bg-[#0a1f0d]/95 px-4 py-4 flex flex-col gap-2">
          {links.map(({ href, label, icon: Icon, auth }) => {
            if (auth && !user) return null;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  pathname === href
                    ? "bg-green-800/50 text-green-300"
                    : "text-green-400 hover:bg-green-900/30"
                )}
              >
                <Icon size={18} /> {label}
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-yellow-500">
              <Shield size={18} /> Admin
            </Link>
          )}
          <div className="border-t border-green-900/50 mt-2 pt-2">
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 w-full">
                <LogOut size={18} /> Cerrar sesión
              </button>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 btn-secondary text-center text-sm py-2">Ingresar</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1 btn-primary text-center text-sm py-2">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
