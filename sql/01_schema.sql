-- ============================================================
-- PRODE MUNDIAL 2026 — SQL COMPLETO PARA SUPABASE
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. TABLA PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL DEFAULT '',
  apellido TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_hora TIMESTAMPTZ NOT NULL,
  equipo_local TEXT NOT NULL,
  equipo_visitante TEXT NOT NULL,
  fase TEXT NOT NULL,
  jornada TEXT,
  grupo TEXT,
  resultado_real_local INTEGER,
  resultado_real_visitante INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA PREDICTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  pred_local INTEGER NOT NULL CHECK (pred_local >= 0),
  pred_visitante INTEGER NOT NULL CHECK (pred_visitante >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- 4. TABLA SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  prediction_deadline TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_predictions_user ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON public.predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_fecha ON public.matches(fecha_hora);

-- ============================================================
-- FUNCIÓN: calcular puntos de un pronóstico
-- ============================================================
CREATE OR REPLACE FUNCTION public.calc_prediction_points(
  pred_l INTEGER, pred_v INTEGER,
  real_l INTEGER, real_v INTEGER
) RETURNS INTEGER AS $$
BEGIN
  IF pred_l IS NULL OR pred_v IS NULL OR real_l IS NULL OR real_v IS NULL THEN RETURN NULL; END IF;
  IF pred_l = real_l AND pred_v = real_v THEN RETURN 3; END IF;
  IF SIGN(pred_l - pred_v) = SIGN(real_l - real_v) THEN RETURN 1; END IF;
  RETURN 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- VISTA: predictions_with_points
-- ============================================================
CREATE OR REPLACE VIEW public.predictions_with_points AS
SELECT
  p.*,
  m.fase,
  m.jornada,
  m.resultado_real_local,
  m.resultado_real_visitante,
  public.calc_prediction_points(p.pred_local, p.pred_visitante, m.resultado_real_local, m.resultado_real_visitante) AS puntos
FROM public.predictions p
JOIN public.matches m ON p.match_id = m.id;

-- ============================================================
-- FUNCIÓN: get_ranking (general)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_ranking()
RETURNS TABLE(
  user_id UUID,
  nombre TEXT,
  apellido TEXT,
  total_puntos BIGINT,
  exactos BIGINT,
  aciertos BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.id AS user_id,
    pr.nombre,
    pr.apellido,
    COALESCE(SUM(pw.puntos), 0) AS total_puntos,
    COUNT(CASE WHEN pw.puntos = 3 THEN 1 END) AS exactos,
    COUNT(CASE WHEN pw.puntos = 1 THEN 1 END) AS aciertos
  FROM public.profiles pr
  LEFT JOIN public.predictions_with_points pw ON pw.user_id = pr.id
  WHERE pr.approved = true
  GROUP BY pr.id, pr.nombre, pr.apellido
  ORDER BY total_puntos DESC, exactos DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCIÓN: get_ranking_filtered (por fase/jornada)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_ranking_filtered(
  p_fase TEXT DEFAULT NULL,
  p_jornada TEXT DEFAULT NULL
)
RETURNS TABLE(
  user_id UUID,
  nombre TEXT,
  apellido TEXT,
  total_puntos BIGINT,
  exactos BIGINT,
  aciertos BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.id AS user_id,
    pr.nombre,
    pr.apellido,
    COALESCE(SUM(pw.puntos), 0) AS total_puntos,
    COUNT(CASE WHEN pw.puntos = 3 THEN 1 END) AS exactos,
    COUNT(CASE WHEN pw.puntos = 1 THEN 1 END) AS aciertos
  FROM public.profiles pr
  LEFT JOIN public.predictions_with_points pw ON pw.user_id = pr.id
    AND (p_fase IS NULL OR pw.fase = p_fase)
    AND (p_jornada IS NULL OR pw.jornada = p_jornada)
  WHERE pr.approved = true
  GROUP BY pr.id, pr.nombre, pr.apellido
  ORDER BY total_puntos DESC, exactos DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCIÓN: get_user_stats
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_stats(uid UUID)
RETURNS TABLE(total_puntos BIGINT, exactos BIGINT, aciertos BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(pw.puntos), 0) AS total_puntos,
    COUNT(CASE WHEN pw.puntos = 3 THEN 1 END) AS exactos,
    COUNT(CASE WHEN pw.puntos = 1 THEN 1 END) AS aciertos
  FROM public.predictions_with_points pw
  WHERE pw.user_id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, email, role, approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    NEW.email,
    'user',
    false
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Allow insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- MATCHES policies (everyone can read)
CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT USING (true);

CREATE POLICY "Admins can manage matches"
  ON public.matches FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- PREDICTIONS policies
CREATE POLICY "Users can view own predictions"
  ON public.predictions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all predictions"
  ON public.predictions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Insert: only before match starts and before global deadline
CREATE POLICY "Users can insert predictions before match"
  ON public.predictions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      SELECT fecha_hora > NOW() FROM public.matches WHERE id = match_id
    )
    AND (
      SELECT prediction_deadline IS NULL OR prediction_deadline > NOW() FROM public.settings WHERE id = 1
    )
  );

-- Update: only before match starts and before global deadline
CREATE POLICY "Users can update predictions before match"
  ON public.predictions FOR UPDATE
  USING (
    auth.uid() = user_id
    AND (
      SELECT fecha_hora > NOW() FROM public.matches WHERE id = match_id
    )
    AND (
      SELECT prediction_deadline IS NULL OR prediction_deadline > NOW() FROM public.settings WHERE id = 1
    )
  );

-- SETTINGS policies
CREATE POLICY "Anyone can read settings"
  ON public.settings FOR SELECT USING (true);

CREATE POLICY "Admins can update settings"
  ON public.settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ============================================================
-- GRANT function access to authenticated users
-- ============================================================
GRANT EXECUTE ON FUNCTION public.get_ranking() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ranking_filtered(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calc_prediction_points(INTEGER, INTEGER, INTEGER, INTEGER) TO authenticated;
