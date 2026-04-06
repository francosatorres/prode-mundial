-- ============================================================
-- SEED: FIXTURE MUNDIAL 2026
-- 48 partidos de grupos + estructura de eliminatorias
-- Fechas aproximadas (confirmar con FIFA cuando se publiquen)
-- Zona horaria: America/Argentina/Buenos_Aires (UTC-3)
-- ============================================================

-- Limpiar fixture existente (cuidado en producción)
-- DELETE FROM public.matches;

-- ============================================================
-- FASE DE GRUPOS
-- 12 grupos × 4 equipos = 48 partidos
-- ============================================================

-- GRUPO A (México, USA, Canadá son anfitriones)
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-11 20:00:00-03', 'México', 'Por definir', 'Grupo A', 'Fecha 1', 'A'),
('2026-06-11 23:00:00-03', 'Por definir', 'Por definir', 'Grupo A', 'Fecha 1', 'A'),
('2026-06-17 17:00:00-03', 'México', 'Por definir', 'Grupo A', 'Fecha 2', 'A'),
('2026-06-17 20:00:00-03', 'Por definir', 'Por definir', 'Grupo A', 'Fecha 2', 'A'),
('2026-06-22 17:00:00-03', 'México', 'Por definir', 'Grupo A', 'Fecha 3', 'A'),
('2026-06-22 17:00:00-03', 'Por definir', 'Por definir', 'Grupo A', 'Fecha 3', 'A');

-- GRUPO B
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-12 14:00:00-03', 'España', 'Por definir', 'Grupo B', 'Fecha 1', 'B'),
('2026-06-12 17:00:00-03', 'Por definir', 'Por definir', 'Grupo B', 'Fecha 1', 'B'),
('2026-06-18 14:00:00-03', 'España', 'Por definir', 'Grupo B', 'Fecha 2', 'B'),
('2026-06-18 17:00:00-03', 'Por definir', 'Por definir', 'Grupo B', 'Fecha 2', 'B'),
('2026-06-23 17:00:00-03', 'España', 'Por definir', 'Grupo B', 'Fecha 3', 'B'),
('2026-06-23 17:00:00-03', 'Por definir', 'Por definir', 'Grupo B', 'Fecha 3', 'B');

-- GRUPO C
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-12 20:00:00-03', 'Argentina', 'Por definir', 'Grupo C', 'Fecha 1', 'C'),
('2026-06-12 23:00:00-03', 'Por definir', 'Por definir', 'Grupo C', 'Fecha 1', 'C'),
('2026-06-18 20:00:00-03', 'Argentina', 'Por definir', 'Grupo C', 'Fecha 2', 'C'),
('2026-06-18 23:00:00-03', 'Por definir', 'Por definir', 'Grupo C', 'Fecha 2', 'C'),
('2026-06-23 20:00:00-03', 'Argentina', 'Por definir', 'Grupo C', 'Fecha 3', 'C'),
('2026-06-23 20:00:00-03', 'Por definir', 'Por definir', 'Grupo C', 'Fecha 3', 'C');

-- GRUPO D
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-13 14:00:00-03', 'Brasil', 'Por definir', 'Grupo D', 'Fecha 1', 'D'),
('2026-06-13 17:00:00-03', 'Por definir', 'Por definir', 'Grupo D', 'Fecha 1', 'D'),
('2026-06-19 14:00:00-03', 'Brasil', 'Por definir', 'Grupo D', 'Fecha 2', 'D'),
('2026-06-19 17:00:00-03', 'Por definir', 'Por definir', 'Grupo D', 'Fecha 2', 'D'),
('2026-06-24 17:00:00-03', 'Brasil', 'Por definir', 'Grupo D', 'Fecha 3', 'D'),
('2026-06-24 17:00:00-03', 'Por definir', 'Por definir', 'Grupo D', 'Fecha 3', 'D');

-- GRUPO E
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-13 20:00:00-03', 'Francia', 'Por definir', 'Grupo E', 'Fecha 1', 'E'),
('2026-06-13 23:00:00-03', 'Por definir', 'Por definir', 'Grupo E', 'Fecha 1', 'E'),
('2026-06-19 20:00:00-03', 'Francia', 'Por definir', 'Grupo E', 'Fecha 2', 'E'),
('2026-06-19 23:00:00-03', 'Por definir', 'Por definir', 'Grupo E', 'Fecha 2', 'E'),
('2026-06-24 20:00:00-03', 'Francia', 'Por definir', 'Grupo E', 'Fecha 3', 'E'),
('2026-06-24 20:00:00-03', 'Por definir', 'Por definir', 'Grupo E', 'Fecha 3', 'E');

-- GRUPO F
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-14 14:00:00-03', 'Alemania', 'Por definir', 'Grupo F', 'Fecha 1', 'F'),
('2026-06-14 17:00:00-03', 'Por definir', 'Por definir', 'Grupo F', 'Fecha 1', 'F'),
('2026-06-20 14:00:00-03', 'Alemania', 'Por definir', 'Grupo F', 'Fecha 2', 'F'),
('2026-06-20 17:00:00-03', 'Por definir', 'Por definir', 'Grupo F', 'Fecha 2', 'F'),
('2026-06-25 17:00:00-03', 'Alemania', 'Por definir', 'Grupo F', 'Fecha 3', 'F'),
('2026-06-25 17:00:00-03', 'Por definir', 'Por definir', 'Grupo F', 'Fecha 3', 'F');

-- GRUPO G
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-14 20:00:00-03', 'Inglaterra', 'Por definir', 'Grupo G', 'Fecha 1', 'G'),
('2026-06-14 23:00:00-03', 'Por definir', 'Por definir', 'Grupo G', 'Fecha 1', 'G'),
('2026-06-20 20:00:00-03', 'Inglaterra', 'Por definir', 'Grupo G', 'Fecha 2', 'G'),
('2026-06-20 23:00:00-03', 'Por definir', 'Por definir', 'Grupo G', 'Fecha 2', 'G'),
('2026-06-25 20:00:00-03', 'Inglaterra', 'Por definir', 'Grupo G', 'Fecha 3', 'G'),
('2026-06-25 20:00:00-03', 'Por definir', 'Por definir', 'Grupo G', 'Fecha 3', 'G');

-- GRUPO H
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-15 14:00:00-03', 'Portugal', 'Por definir', 'Grupo H', 'Fecha 1', 'H'),
('2026-06-15 17:00:00-03', 'Por definir', 'Por definir', 'Grupo H', 'Fecha 1', 'H'),
('2026-06-21 14:00:00-03', 'Portugal', 'Por definir', 'Grupo H', 'Fecha 2', 'H'),
('2026-06-21 17:00:00-03', 'Por definir', 'Por definir', 'Grupo H', 'Fecha 2', 'H'),
('2026-06-26 17:00:00-03', 'Portugal', 'Por definir', 'Grupo H', 'Fecha 3', 'H'),
('2026-06-26 17:00:00-03', 'Por definir', 'Por definir', 'Grupo H', 'Fecha 3', 'H');

-- GRUPO I
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-15 20:00:00-03', 'Países Bajos', 'Por definir', 'Grupo I', 'Fecha 1', 'I'),
('2026-06-15 23:00:00-03', 'Por definir', 'Por definir', 'Grupo I', 'Fecha 1', 'I'),
('2026-06-21 20:00:00-03', 'Países Bajos', 'Por definir', 'Grupo I', 'Fecha 2', 'I'),
('2026-06-21 23:00:00-03', 'Por definir', 'Por definir', 'Grupo I', 'Fecha 2', 'I'),
('2026-06-26 20:00:00-03', 'Países Bajos', 'Por definir', 'Grupo I', 'Fecha 3', 'I'),
('2026-06-26 20:00:00-03', 'Por definir', 'Por definir', 'Grupo I', 'Fecha 3', 'I');

-- GRUPO J
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-16 14:00:00-03', 'Uruguay', 'Por definir', 'Grupo J', 'Fecha 1', 'J'),
('2026-06-16 17:00:00-03', 'Por definir', 'Por definir', 'Grupo J', 'Fecha 1', 'J'),
('2026-06-22 14:00:00-03', 'Uruguay', 'Por definir', 'Grupo J', 'Fecha 2', 'J'),
('2026-06-22 17:00:00-03', 'Por definir', 'Por definir', 'Grupo J', 'Fecha 2', 'J'),
('2026-06-27 17:00:00-03', 'Uruguay', 'Por definir', 'Grupo J', 'Fecha 3', 'J'),
('2026-06-27 17:00:00-03', 'Por definir', 'Por definir', 'Grupo J', 'Fecha 3', 'J');

-- GRUPO K
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-16 20:00:00-03', 'Canadá', 'Por definir', 'Grupo K', 'Fecha 1', 'K'),
('2026-06-16 23:00:00-03', 'Por definir', 'Por definir', 'Grupo K', 'Fecha 1', 'K'),
('2026-06-22 20:00:00-03', 'Canadá', 'Por definir', 'Grupo K', 'Fecha 2', 'K'),
('2026-06-22 23:00:00-03', 'Por definir', 'Por definir', 'Grupo K', 'Fecha 2', 'K'),
('2026-06-27 20:00:00-03', 'Canadá', 'Por definir', 'Grupo K', 'Fecha 3', 'K'),
('2026-06-27 20:00:00-03', 'Por definir', 'Por definir', 'Grupo K', 'Fecha 3', 'K');

-- GRUPO L
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada, grupo) VALUES
('2026-06-17 14:00:00-03', 'Estados Unidos', 'Por definir', 'Grupo L', 'Fecha 1', 'L'),
('2026-06-17 17:00:00-03', 'Por definir', 'Por definir', 'Grupo L', 'Fecha 1', 'L'),
('2026-06-23 14:00:00-03', 'Estados Unidos', 'Por definir', 'Grupo L', 'Fecha 2', 'L'),
('2026-06-23 17:00:00-03', 'Por definir', 'Por definir', 'Grupo L', 'Fecha 2', 'L'),
('2026-06-28 17:00:00-03', 'Estados Unidos', 'Por definir', 'Grupo L', 'Fecha 3', 'L'),
('2026-06-28 17:00:00-03', 'Por definir', 'Por definir', 'Grupo L', 'Fecha 3', 'L');

-- ============================================================
-- FASE ELIMINATORIA
-- ============================================================

-- OCTAVOS DE FINAL (16 partidos)
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada) VALUES
('2026-07-01 14:00:00-03', '1A', '2B', 'Octavos de Final', NULL),
('2026-07-01 20:00:00-03', '1C', '2D', 'Octavos de Final', NULL),
('2026-07-02 14:00:00-03', '1B', '2A', 'Octavos de Final', NULL),
('2026-07-02 20:00:00-03', '1D', '2C', 'Octavos de Final', NULL),
('2026-07-03 14:00:00-03', '1E', '2F', 'Octavos de Final', NULL),
('2026-07-03 20:00:00-03', '1G', '2H', 'Octavos de Final', NULL),
('2026-07-04 14:00:00-03', '1F', '2E', 'Octavos de Final', NULL),
('2026-07-04 20:00:00-03', '1H', '2G', 'Octavos de Final', NULL),
('2026-07-05 14:00:00-03', '1I', '2J', 'Octavos de Final', NULL),
('2026-07-05 20:00:00-03', '1K', '2L', 'Octavos de Final', NULL),
('2026-07-06 14:00:00-03', '1J', '2I', 'Octavos de Final', NULL),
('2026-07-06 20:00:00-03', '1L', '2K', 'Octavos de Final', NULL),
('2026-07-07 14:00:00-03', 'Mejor 3ro 1', 'Mejor 3ro 2', 'Octavos de Final', NULL),
('2026-07-07 20:00:00-03', 'Mejor 3ro 3', 'Mejor 3ro 4', 'Octavos de Final', NULL),
('2026-07-08 14:00:00-03', 'Mejor 3ro 5', 'Mejor 3ro 6', 'Octavos de Final', NULL),
('2026-07-08 20:00:00-03', 'Mejor 3ro 7', 'Mejor 3ro 8', 'Octavos de Final', NULL);

-- CUARTOS DE FINAL (8 partidos)
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada) VALUES
('2026-07-11 14:00:00-03', 'G.Octavos 1', 'G.Octavos 2', 'Cuartos de Final', NULL),
('2026-07-11 20:00:00-03', 'G.Octavos 3', 'G.Octavos 4', 'Cuartos de Final', NULL),
('2026-07-12 14:00:00-03', 'G.Octavos 5', 'G.Octavos 6', 'Cuartos de Final', NULL),
('2026-07-12 20:00:00-03', 'G.Octavos 7', 'G.Octavos 8', 'Cuartos de Final', NULL),
('2026-07-13 14:00:00-03', 'G.Octavos 9', 'G.Octavos 10', 'Cuartos de Final', NULL),
('2026-07-13 20:00:00-03', 'G.Octavos 11', 'G.Octavos 12', 'Cuartos de Final', NULL),
('2026-07-14 14:00:00-03', 'G.Octavos 13', 'G.Octavos 14', 'Cuartos de Final', NULL),
('2026-07-14 20:00:00-03', 'G.Octavos 15', 'G.Octavos 16', 'Cuartos de Final', NULL);

-- SEMIFINALES (4 partidos)
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada) VALUES
('2026-07-15 20:00:00-03', 'G.Cuartos 1', 'G.Cuartos 2', 'Semifinal', NULL),
('2026-07-16 20:00:00-03', 'G.Cuartos 3', 'G.Cuartos 4', 'Semifinal', NULL),
('2026-07-17 20:00:00-03', 'G.Cuartos 5', 'G.Cuartos 6', 'Semifinal', NULL),
('2026-07-18 20:00:00-03', 'G.Cuartos 7', 'G.Cuartos 8', 'Semifinal', NULL);

-- TERCER PUESTO
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada) VALUES
('2026-07-18 17:00:00-03', 'Perdedor SF1', 'Perdedor SF2', 'Tercer Puesto', NULL);

-- FINAL
INSERT INTO public.matches (fecha_hora, equipo_local, equipo_visitante, fase, jornada) VALUES
('2026-07-19 17:00:00-03', 'Ganador SF1', 'Ganador SF2', 'Final', NULL);
