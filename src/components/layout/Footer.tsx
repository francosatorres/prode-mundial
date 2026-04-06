export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/60 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-black text-xs">⚽</div>
          <span className="section-title text-base text-gray-600">PRODE MUNDIAL 2026</span>
        </div>
        <p>Hecho para competir entre amigos 🤝</p>
        <p>© 2026</p>
      </div>
    </footer>
  );
}
