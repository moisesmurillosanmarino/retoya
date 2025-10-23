-- =========================================================
-- RetaYa · Seed Inicial de Datos (MVP)
-- Fecha base: 2025-10-19 (America/Bogota)
-- Genera una semana de slots 2025-10-20 a 2025-10-26
-- =========================================================
BEGIN;

-- ---------------------------------------------------------
-- Limpieza (solo para desarrollo)
-- ---------------------------------------------------------
TRUNCATE retaya.jwt_blacklist,
         retaya.auth_sessions,
         retaya.chat_messages,
         retaya.chat_rooms,
         retaya.notifications,
         retaya.coupon_redemptions,
         retaya.coupons,
         retaya.media,
         retaya.matches,
         retaya.tournament_enrollments,
         retaya.tournaments,
         retaya.challenges,
         retaya.team_members,
         retaya.teams,
         retaya.settlement_items,
         retaya.settlements,
         retaya.refunds,
         retaya.payment_events,
         retaya.payment_intents,
         retaya.booking_events,
         retaya.bookings,
         retaya.court_slots,
         retaya.pricing_rules,
         retaya.court_blackouts,
         retaya.court_schedules,
         retaya.courts,
         retaya.venues,
         retaya.owners,
         retaya.user_roles,
         retaya.user_credentials,
         retaya.users,
         retaya.audit_logs,
         retaya.otp_requests
RESTART IDENTITY CASCADE;

-- ---------------------------------------------------------
-- 1) Usuarios, credenciales, roles
-- ---------------------------------------------------------
-- Usuarios base (admin, dos dueños de cancha, cuatro jugadores)
INSERT INTO retaya.users (id, email, phone, full_name) VALUES
  (1, 'admin@retaya.app',     '+57 3000000000', 'Admin RetaYa'),
  (2, 'dueño1@canchas.co',    '+57 3011111111', 'María Dueña'),
  (3, 'dueño2@canchas.co',    '+57 3022222222', 'Juan Gestor'),
  (4, 'jugador1@mail.com',    '+57 3111111111', 'Carlos Nueve'),
  (5, 'jugador2@mail.com',    '+57 3222222222', 'Daniela 10'),
  (6, 'jugador3@mail.com',    '+57 3333333333', 'Lina Defensa'),
  (7, 'jugador4@mail.com',    '+57 3444444444', 'Oscar Portero');

-- Credenciales (marcamos verificado para simplificar)
INSERT INTO retaya.user_credentials (user_id, provider, provider_uid, email_verified, last_login_at) VALUES
  (1, 'EMAIL_OTP', 'admin@retaya.app',  TRUE, now()),
  (2, 'EMAIL_OTP', 'dueño1@canchas.co', TRUE, now()),
  (3, 'EMAIL_OTP', 'dueño2@canchas.co', TRUE, now()),
  (4, 'EMAIL_OTP', 'jugador1@mail.com', TRUE, now()),
  (5, 'EMAIL_OTP', 'jugador2@mail.com', TRUE, now()),
  (6, 'EMAIL_OTP', 'jugador3@mail.com', TRUE, now()),
  (7, 'EMAIL_OTP', 'jugador4@mail.com', TRUE, now());

-- Roles (ya existen en tabla retaya.roles; asignamos)
INSERT INTO retaya.user_roles (user_id, role_id)
SELECT 1, r.id FROM retaya.roles r WHERE r.key='ADMIN'
UNION ALL SELECT 2, r.id FROM retaya.roles r WHERE r.key='OWNER'
UNION ALL SELECT 3, r.id FROM retaya.roles r WHERE r.key='OWNER'
UNION ALL SELECT 4, r.id FROM retaya.roles r WHERE r.key='USER'
UNION ALL SELECT 5, r.id FROM retaya.roles r WHERE r.key='USER'
UNION ALL SELECT 6, r.id FROM retaya.roles r WHERE r.key='USER'
UNION ALL SELECT 7, r.id FROM retaya.roles r WHERE r.key='USER';

-- Sesiones/Refresh tokens (dummy HASH)
INSERT INTO retaya.auth_sessions (user_id, device_info, ip, refresh_token_hash, refresh_expires_at)
VALUES
  (1, 'Chrome Desktop', '192.168.0.10', 'hash_admin_refresh', now() + interval '30 days'),
  (2, 'iPhone',         '192.168.0.11', 'hash_owner1_refresh', now() + interval '30 days'),
  (4, 'Android',        '192.168.0.21', 'hash_user1_refresh',  now() + interval '30 days');

-- Lista negra (simulación de un logout pasado)
INSERT INTO retaya.jwt_blacklist (user_id, access_token_hash, issued_at, expires_at, revoked_reason)
VALUES (4, 'hash_access_old_user1', now() - interval '1 day', now() + interval '13 days', 'logout');

-- ---------------------------------------------------------
-- 2) Owners, sedes, canchas, horarios, precios
-- ---------------------------------------------------------
INSERT INTO retaya.owners (id, user_id, business_name, kyc_status) VALUES
  (1, 2, 'Canchas La 70', 'VERIFIED'),
  (2, 3, 'Complejo Deportivo Niza', 'VERIFIED');

-- Sedes
INSERT INTO retaya.venues (id, owner_id, name, description, address, city, country, geo_lat, geo_lng, publish_state)
VALUES
  (1, 1, 'Sede La 70', 'Canchas sintéticas techadas', 'Cra 70 #45-10', 'Medellín', 'CO', 6.2500, -75.5900, 'PUBLISHED'),
  (2, 2, 'Sede Niza',  'Complejo con parqueadero y cafetería', 'Calle 127 # 60-20', 'Bogotá', 'CO', 4.7090, -74.0817, 'PUBLISHED');

-- Canchas
INSERT INTO retaya.courts (id, venue_id, name, sport, modality, surface, base_duration_minutes)
VALUES
  (1, 1, 'Cancha 5v5 A', 'FUTBOL_5', '5v5', 'Sintética', 60),
  (2, 1, 'Cancha 5v5 B', 'FUTBOL_5', '5v5', 'Sintética', 60),
  (3, 2, 'Cancha 7v7 Norte', 'FUTBOL_7', '7v7', 'Sintética', 60);

-- Horarios base (todos los días 08:00–22:00 cada 60m)
INSERT INTO retaya.court_schedules (court_id, weekday, open_time, close_time, slot_minutes)
SELECT c.id, d, '08:00'::time, '22:00'::time, 60
FROM retaya.courts c CROSS JOIN generate_series(0,6) AS d;

-- Reglas de precio: semana $50.000 COP/h, fin de semana $60.000 COP/h
-- Semana (Lunes=1..Viernes=5)
INSERT INTO retaya.pricing_rules (court_id, currency, price_cents, weekday, is_promo)
SELECT id, 'COP', 5000000, d, FALSE
FROM retaya.courts, generate_series(1,5) AS d;

-- Fines de semana (Domingo=0, Sábado=6)
INSERT INTO retaya.pricing_rules (court_id, currency, price_cents, weekday, is_promo)
SELECT id, 'COP', 6000000, d, FALSE
FROM retaya.courts, (VALUES (0),(6)) AS w(d);

-- Bloqueo puntual de mantenimiento (ejemplo 2025-10-22 14:00–16:00 en Cancha 5v5 A)
INSERT INTO retaya.court_blackouts (court_id, starts_at, ends_at, reason)
VALUES (1, '2025-10-22 14:00-05'::timestamptz, '2025-10-22 16:00-05'::timestamptz, 'Mantenimiento');

-- ---------------------------------------------------------
-- 3) Generación de SLOTS para 1 semana (3 canchas)
--    Rango: 2025-10-20 a 2025-10-26
-- ---------------------------------------------------------
WITH rangos AS (
  SELECT dd::date AS d
  FROM generate_series('2025-10-20'::date, '2025-10-26'::date, '1 day') dd
),
horas AS (
  SELECT h::time AS t FROM generate_series('08:00'::time, '21:00'::time, '1 hour') h
),
base AS (
  SELECT c.id AS court_id, r.d, h.t,
         (EXTRACT(DOW FROM r.d))::int AS dow
  FROM retaya.courts c
  JOIN rangos r ON true
  JOIN horas h  ON true
  WHERE EXISTS (
    SELECT 1 FROM retaya.court_schedules cs
    WHERE cs.court_id = c.id
      AND cs.weekday = (EXTRACT(DOW FROM r.d))::int
      AND h.t >= cs.open_time AND (h.t + make_interval(mins => cs.slot_minutes)) <= cs.close_time
  )
),
precios AS (
  SELECT pr.court_id, pr.weekday, pr.price_cents
  FROM retaya.pricing_rules pr
  WHERE pr.weekday IS NOT NULL
)
INSERT INTO retaya.court_slots (court_id, starts_at, ends_at, currency, price_cents, is_available)
SELECT
  b.court_id,
  (b.d + b.t)::timestamptz AT TIME ZONE 'America/Bogota',
  (b.d + b.t + make_interval(mins => 60))::timestamptz AT TIME ZONE 'America/Bogota',
  'COP',
  COALESCE(p.price_cents, 5000000),
  TRUE
FROM base b
LEFT JOIN precios p ON p.court_id = b.court_id AND p.weekday = b.dow
WHERE NOT EXISTS (
  SELECT 1 FROM retaya.court_blackouts cb
  WHERE cb.court_id = b.court_id
    AND (b.d + b.t)::timestamptz BETWEEN cb.starts_at AND cb.ends_at
);

-- ---------------------------------------------------------
-- 4) Equipos, miembros, retas
-- ---------------------------------------------------------
INSERT INTO retaya.teams (id, name, owner_user_id, sport) VALUES
  (1, 'Leones de Niza', 4, 'FUTBOL_5'),
  (2, 'Tiburones 70',   5, 'FUTBOL_5');

INSERT INTO retaya.team_members (team_id, user_id, role) VALUES
  (1, 4, 'CAPITAN'),
  (1, 6, 'PLAYER'),
  (1, 7, 'PORTERO'),
  (2, 5, 'CAPITAN');

-- Reta abierta (sin booking asociado aún)
INSERT INTO retaya.challenges (challenger_team_id, opponent_team_id, stake_cents, state, message)
VALUES (1, 2, 200000, 'OPEN', '¡Reta para el viernes por la noche!');

-- ---------------------------------------------------------
-- 5) Reservas + pagos (incluye eventos)
--    Creamos 2 reservas:
--    R1: Usuario 4 en Cancha 5v5 A (Medellín) 2025-10-21 19:00
--    R2: Usuario 5 en Cancha 7v7 Norte (Bogotá) 2025-10-24 20:00
-- ---------------------------------------------------------
-- R1: slot_id por subconsulta (UNIQUE court_id+starts_at)
WITH s AS (
  SELECT id, court_id, starts_at, ends_at, price_cents
  FROM retaya.court_slots
  WHERE court_id = 1 AND starts_at = '2025-10-21 19:00-05'::timestamptz
)
INSERT INTO retaya.bookings (slot_id, user_id, owner_id, court_id, venue_id, state, currency, price_cents, fee_cents, total_cents, notes)
SELECT s.id, 4, 1, s.court_id, 1, 'CONFIRMED', 'COP', s.price_cents, 500000, s.price_cents + 500000, 'Reserva confirmada'
FROM s;

-- Eventos de booking R1
INSERT INTO retaya.booking_events (booking_id, from_state, to_state, metadata)
VALUES
  ((SELECT id FROM retaya.bookings ORDER BY id LIMIT 1), 'REQUESTED', 'PENDING_PAYMENT', '{"detalle":"lock"}'::jsonb),
  ((SELECT id FROM retaya.bookings ORDER BY id LIMIT 1), 'PENDING_PAYMENT', 'CONFIRMED',  '{"webhook":"captured"}'::jsonb);

-- Pago R1 (capturado)
INSERT INTO retaya.payment_intents (booking_id, provider, provider_intent_id, currency, amount_cents, state)
SELECT id, 'WOMPI', 'WOMPI_INTENT_0001', 'COP', total_cents, 'CAPTURED'
FROM retaya.bookings WHERE court_id=1 ORDER BY id LIMIT 1;

INSERT INTO retaya.payment_events (payment_intent_id, event_key, payload)
VALUES
  ((SELECT id FROM retaya.payment_intents WHERE provider_intent_id='WOMPI_INTENT_0001'), 'payment.captured', '{"status":"APPROVED"}');

-- R2:
WITH s AS (
  SELECT id, court_id, starts_at, ends_at, price_cents
  FROM retaya.court_slots
  WHERE court_id = 3 AND starts_at = '2025-10-24 20:00-05'::timestamptz
)
INSERT INTO retaya.bookings (slot_id, user_id, owner_id, court_id, venue_id, state, currency, price_cents, fee_cents, total_cents, notes)
SELECT s.id, 5, 2, s.court_id, 2, 'PENDING_PAYMENT', 'COP', s.price_cents, 500000, s.price_cents + 500000, 'Pendiente de pago'
FROM s;

INSERT INTO retaya.payment_intents (booking_id, provider, provider_intent_id, currency, amount_cents, state)
SELECT id, 'WOMPI', 'WOMPI_INTENT_0002', 'COP', total_cents, 'CREATED'
FROM retaya.bookings WHERE court_id=3 ORDER BY id DESC LIMIT 1;

-- ---------------------------------------------------------
-- 6) Torneos y partidos
-- ---------------------------------------------------------
INSERT INTO retaya.tournaments (id, owner_id, name, sport, state, rules, entry_fee_cents, prize_pool_cents, starts_on, ends_on)
VALUES (1, 2, 'Copa Niza Octubre', 'FUTBOL_5', 'PUBLISHED',
        'Partidos de 40 minutos, fair play obligatorio.',
        300000, 3000000, '2025-10-23', '2025-10-30');

INSERT INTO retaya.tournament_enrollments (tournament_id, team_id, paid) VALUES
  (1, 1, TRUE),
  (1, 2, TRUE);

-- Partido (no atado a reserva, para demo)
INSERT INTO retaya.matches (tournament_id, team_home_id, team_away_id, court_id, starts_at, status)
VALUES (1, 1, 2, 3, '2025-10-23 19:00-05', 'SCHEDULED');

-- ---------------------------------------------------------
-- 7) Cupones, canje, media, notificaciones, chat
-- ---------------------------------------------------------
INSERT INTO retaya.coupons (code, description, percent_off, valid_from, valid_to, active)
VALUES ('BIENVENIDA10', 'Descuento de bienvenida 10%', 10.00, now(), now()+interval '30 days', TRUE);

-- Canje de cupón sobre R1
INSERT INTO retaya.coupon_redemptions (coupon_id, booking_id, user_id, amount_cents)
VALUES (
  (SELECT id FROM retaya.coupons WHERE code='BIENVENIDA10'),
  (SELECT id FROM retaya.bookings WHERE court_id=1 LIMIT 1),
  4,
  500000 -- ejemplo de valor canjeado
);

-- Media (fotos) de sedes/canchas
INSERT INTO retaya.media (owner_id, venue_id, court_id, url, alt) VALUES
  (1,1,1,'https://cdn.example.com/medellin/canchaA.jpg','Cancha 5v5 A'),
  (1,1,2,'https://cdn.example.com/medellin/canchaB.jpg','Cancha 5v5 B'),
  (2,2,3,'https://cdn.example.com/bogota/7v7norte.jpg','Cancha 7v7 Norte');

-- Notificaciones
INSERT INTO retaya.notifications (user_id, key, payload, delivered_at)
VALUES
  (4, 'booking.confirmed', '{"booking":"R1","mensaje":"¡Tu reserva está confirmada!"}'::jsonb, now()),
  (5, 'payment.pending',   '{"booking":"R2","mensaje":"Tu pago está pendiente."}'::jsonb,    now());

-- Chat por la reserva R1
INSERT INTO retaya.chat_rooms (booking_id) VALUES
  ((SELECT id FROM retaya.bookings WHERE court_id=1 LIMIT 1));

INSERT INTO retaya.chat_messages (room_id, sender_id, content)
VALUES
  ((SELECT id FROM retaya.chat_rooms ORDER BY id DESC LIMIT 1), 4, '¡Listo equipo, nos vemos a las 7 pm!'),
  ((SELECT id FROM retaya.chat_rooms ORDER BY id DESC LIMIT 1), 2, 'Bienvenidos, cancha preparada.');

-- ---------------------------------------------------------
-- 8) Liquidaciones (plantilla de ejemplo)
--    Liquidación del owner 1 para R1
-- ---------------------------------------------------------
INSERT INTO retaya.settlements (owner_id, period_from, period_to, currency, gross_cents, fees_cents, net_cents, generated_at)
SELECT 1, '2025-10-20', '2025-10-26', 'COP',
       (SELECT price_cents FROM retaya.bookings WHERE court_id=1 LIMIT 1),
       500000,
       (SELECT price_cents FROM retaya.bookings WHERE court_id=1 LIMIT 1) - 500000,
       now();

INSERT INTO retaya.settlement_items (settlement_id, booking_id, gross_cents, fee_cents, net_cents)
SELECT s.id, b.id, b.price_cents, 500000, b.price_cents-500000
FROM retaya.settlements s
JOIN retaya.bookings b ON s.owner_id = b.owner_id
WHERE s.owner_id=1 AND b.court_id=1
LIMIT 1;

-- ---------------------------------------------------------
-- 9) Auditoría de muestra
-- ---------------------------------------------------------
INSERT INTO retaya.audit_logs (actor_user_id, entity, entity_id, action, prev, next)
VALUES (1, 'venue', 1, 'STATE_CHANGE', '{"publish_state":"SUBMITTED"}', '{"publish_state":"PUBLISHED"}');

COMMIT;
