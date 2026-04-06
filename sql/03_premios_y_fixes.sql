-- ============================================================
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ============================================================

-- 1. TABLA PREMIOS
CREATE TABLE IF NOT EXISTS public.premios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posicion INTEGER NOT NULL DEFAULT 1,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  emoji TEXT DEFAULT '🏆',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.premios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view premios"
  ON public.premios FOR SELECT USING (true);

CREATE POLICY "Admins can manage premios"
  ON public.premios FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 2. FIX: HACERTE ADMIN
-- Reemplazá tu-email@ejemplo.com con tu email real
UPDATE public.profiles
SET role = 'admin', approved = true
WHERE email = 'tu-email@ejemplo.com';

-- Si no sabés tu user id, primero encontralo así:
-- SELECT id, email FROM public.profiles;
-- Luego:
-- UPDATE public.profiles SET role = 'admin', approved = true WHERE id = 'tu-uuid-aqui';

-- 3. FIX PUNTOS: verificar que la función calcula bien
-- Resultado exacto = 3 pts, ganador/empate = 1 pt, fallo = 0
-- La función ya está correcta en 01_schema.sql
-- Si querés verificar:
SELECT public.calc_prediction_points(2, 1, 2, 1); -- debe dar 3
SELECT public.calc_prediction_points(2, 0, 1, 0); -- debe dar 1 (ambos gana local)
SELECT public.calc_prediction_points(2, 1, 0, 1); -- debe dar 0

-- 4. Política para que admins puedan borrar predictions (vaciar prode)
CREATE POLICY "Admins can delete all predictions"
  ON public.predictions FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 5. Política para que los usuarios puedan borrar sus propias predictions
CREATE POLICY "Users can delete own predictions"
  ON public.predictions FOR DELETE
  USING (auth.uid() = user_id);
