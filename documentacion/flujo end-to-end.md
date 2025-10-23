1) Onboarding & Autenticación

Objetivo: crear sesión segura y perfilar al usuario.

Pasos

Usuario abre app/web → AuthService.start()

Selecciona: Email+OTP / Google / Apple / Facebook → POST /auth/{provider}/login

Verificación:

Email/OTP → POST /auth/otp/verify

Social → intercambio OAuth (tokens de proveedor)

Creación/actualización de perfil: POST /users (si es nuevo) / PATCH /users/{id}

Session issue: JWT + Refresh Token (scopes por rol)

Telemetry & seguridad: registrar login, IP, device, huella → login.logged (evento)

Errores/validaciones

Máximo intentos OTP, bloqueo temporal (rate limit).

Detección de dispositivo nuevo → 2FA opcional.

2) Descubrir canchas (Usuario)

Objetivo: encontrar opciones por cercanía/disponibilidad/precio.

Pasos

Filtros: ubicación (GPS/mapa), deporte, fecha/hora, precio → GET /venues/search?lat&lng&date&sport&priceRange

Lista + mapa; selección de sede/cancha → GET /venues/{venueId} + fotos/servicios.

Consultar calendario de la cancha → GET /courts/{courtId}/availability?date=YYYY-MM-DD

UI muestra slots libres/ocupados (motor de disponibilidad).

Validaciones

Reglas de franja (mínimo 1h, múltiplos de 30m, feriados, happy hours).

Precios dinámicos por franja.

3) Reserva y Pago (Usuario)

Objetivo: bloquear slot, pagar y confirmar.

Flujo

Elegir slot(s) → POST /bookings/quote (retorna precio, impuestos, comisión).

Confirmar → POST /bookings

Estado inicial: PENDING_PAYMENT

Lock de stock de slot (TTL) en Redis para evitar overbooking.

Emite booking.created

Pago: redirección/SDK (Tarjeta, PSE, Nequi/DaviPlata) → POST /payments/intent → provider

Webhook de pago → POST /payments/webhook

OK → booking -> CONFIRMED, emite payment.captured, booking.confirmed

Fallo/timeout → booking -> EXPIRED y libera slot (evento booking.expired)

Notificaciones: push/email a usuario y gestor.

Reembolsos/cancelación

Usuario cancela dentro de política → POST /bookings/{id}/cancel

Si ya cobrado → payments.refund.requested y booking -> REFUNDED cuando aplica.

Gestor cancela (fuerza mayor) → compensación/bono.

Estados de reserva (FSM)

REQUESTED -> PENDING_PAYMENT -> CONFIRMED -> CHECKED_IN -> COMPLETED
         \-> EXPIRED
         \-> CANCELED
         \-> REFUND_REQUESTED -> REFUNDED

4) Equipos, Retas y Social

Objetivo: coordinar partidos y desafíos.

Flujo Reta

Capitán crea equipo → POST /teams y añade miembros → POST /teams/{id}/members

Desde detalle de cancha/slot, crea reta → POST /challenges

Define reglas (modalidad, apuesta opcional, fair-play).

Otro equipo recibe notificación → PATCH /challenges/{id} (ACCEPT/DECLINE)

Si ACCEPT → crea booking (si no existe) o asocia la reta a una reserva existente.

Resultados post-partido → POST /matches/{id}/result

Actualiza estadísticas de jugadores/equipos → stats.updated

Chat & notificaciones

Canal por booking/reta → POST /rooms, POST /messages

Push para cambios (aceptada, hora, cancha, etc.)

5) Torneos (Gestor y/o Admin)

Objetivo: organizar competencias con fixtures.

Flujo

Crear torneo → POST /tournaments (categorías, cupo, reglamento, premios)

Inscripción de equipos → POST /tournaments/{id}/enrollments

Generar fixture (grupos/llaves) → POST /tournaments/{id}/fixture/generate

Calendario de partidos vinculado a canchas → POST /matches (slots asignados)

Carga de resultados, tabla de posiciones → POST /matches/{id}/result

Premiación y cierre → PATCH /tournaments/{id} (CLOSED)

6) Operación del Gestor de Cancha

Objetivo: administrar su negocio.

Alta de sede/canchas

Registro del negocio → POST /owners (verificación KYC básica)

Crear sede y canchas → POST /venues + POST /courts

Cargar fotos/servicios → POST /media/upload

Solicitud de publicación → POST /venues/{id}/submit → moderación admin

Disponibilidad y precios

Calendario base → POST /courts/{id}/schedule

Bloqueos puntuales → POST /courts/{id}/blackouts

Tarifas por franja/temporada → POST /pricing/rules

Gestión de reservas

Bandeja de reservas → GET /owner/bookings?status=...

Aceptar/cancelar/modificar → PATCH /bookings/{id}

Check-in (QR o código) el día del juego → POST /bookings/{id}/checkin

Promos & cupones

Crear cupón → POST /coupons (rango de fechas, usos, % o valor fijo)

Campañas push a clientes frecuentes.

7) Backoffice del Administrador

Objetivo: gobernanza, calidad y visión.

Flujos

Moderar sedes/canchas nuevas → PATCH /venues/{id} (APPROVE/REJECT)

Gestión de usuarios/roles → PATCH /users/{id} (ban/suspend)

Reportes & métricas → GET /reports/* (reservas, ingresos, ocupación, NPS)

Comisiones y liquidaciones a sedes → GET /settlements?period=...

Auditoría y seguridad (logs, alertas de fraude).

8) Pagos y Liquidación

Objetivo: cobrar al usuario y pagar al dueño con comisión.

Flujo

Usuario paga → escrow (cuenta de plataforma)

Reserva se completa (COMPLETED) → calcula comisión → liquidación al dueño (batch diario/semana)

Reporte de liquidación → settlement.created y remesa a cuenta bancaria del gestor.

9) Eventos y Mensajería (para escalar)

Temas (colas)

booking.created, booking.confirmed, booking.canceled, booking.expired

payment.intent.created, payment.captured, payment.refund.requested, payment.refunded

venue.submitted, venue.approved, venue.rejected

challenge.created, challenge.accepted, challenge.declined

tournament.created, fixture.generated, match.result.recorded

notification.send, message.created

user.login, user.registered

Consumers típicos

Notificaciones (push/email)

Analytics (KPI, funnels)

Indexación de búsqueda (Elasticsearch/Algolia)

Antifraude (comportamientos anómalos)

Liquidaciones/contabilidad

10) Validaciones clave (cross-cutting)

Stock de slot: lock atómico (Redis) + confirmación en DB.

Políticas de cancelación por ventana temporal y canal de pago.

Idempotencia en webhooks de pago.

RBAC por rol (admin/owner/user) en cada endpoint.

Observabilidad: trace por bookingId y paymentId.

GDPR/Privacidad: borrado/anónimo bajo solicitud.

Endpoints base (resumen)
POST /auth/{provider}/login
POST /auth/otp/verify
GET  /venues/search
GET  /venues/{id}
GET  /courts/{id}/availability
POST /bookings/quote
POST /bookings
POST /payments/intent
POST /payments/webhook
POST /bookings/{id}/cancel
POST /owners
POST /venues
POST /courts
POST /courts/{id}/schedule
POST /pricing/rules
GET  /owner/bookings
POST /teams
POST /challenges
PATCH /challenges/{id}
POST /tournaments
POST /tournaments/{id}/fixture/generate
POST /matches/{id}/result
GET  /reports/*
