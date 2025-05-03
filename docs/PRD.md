**Creating Pet Adoption PRD**

I need to create a Product Requirements Document (PRD) for the Pet Adoption Platform. Since the user didn't specify specific locations or current events, I’ll rely on internal knowledge. The document will follow a standard template: title in title case, then sentence case for all headings. Sections will include overview, goals, stakeholders, scope, assumptions, personas, functional requirements, security, and more. I'll also include user stories with unique IDs (e.g., US-001) and an acceptance criteria list. This document will be a general guide for development and rollout.

Thought for 7 seconds

# Pet Adoption Platform – Product Requirements Document

## overview

This document defines the requirements for a full‑stack web application that connects animal shelters with prospective adopters. The site will let a shelter administrator manage its own catalogue of adoptable pets while giving end‑users powerful search, matching and application features. Because the project is being delivered for a database‑management course, special emphasis is placed on a well‑designed relational schema and the exclusive use of hand‑written SQL (executed through `pgadmin`) rather than any ORM such as Prisma.

## goals and objectives

- **Increase adoption throughput** by making it easy for shelters to publish, update and withdraw pet listings in real time.
- **Improve match quality** with a quiz‑based recommender that ranks pets against stated adopter preferences.
- **Showcase advanced database techniques** (normalized schema, many‑to‑many joins, CTE‑based search, indexing, triggers) to satisfy academic grading criteria.
- **Provide measurable KPIs** such as time‑to‑publish, inquiry‑to‑adoption conversion rate and quiz opt‑in rate.

## success metrics

| metric                                   | target                    | measurement method                      |
| ---------------------------------------- | ------------------------- | --------------------------------------- |
| time from pet creation to public listing | ≤ 2 min                   | backend log timestamps                  |
| shelter dashboard CRUD average latency   | ≤ 300 ms p95              | prometheus metrics                      |
| quiz completion rate                     | ≥ 60 % of unique visitors | web analytics funnel                    |
| inquiry‑to‑adoption conversion           | ≥ 25 % within 30 days     | joined shelter feedback + email records |

## stakeholders

- **Product owner** – course instructor
- **technical product manager** – you (student)
- **engineering** – full‑stack dev team (Next.js + TypeScript)
- **shelter admin user** – one login per shelter
- **public adopter user** – any site visitor who creates an account to inquire

## scope

### in scope

- Shelter self‑service dashboard (single authenticated admin per shelter)
- Public catalogue with location filter and search facets
- Preference quiz with match scoring algorithm
- Email‑based adoption inquiry workflow
- Secure authentication / authorization for admins and adopters
- PostgreSQL schema, SQL scripts, migrations and sample seed data
- Responsive UI (Next.js 13, Tailwind CSS)

### out of scope

- Payment processing or donations
- SMS / push notifications
- Multi‑admin shelter roles
- Native mobile apps

## assumptions and dependencies

- Each shelter receives exactly one dashboard login.
- Shelters decide final adopter manually and communicate outside the platform.
- Email service (e.g. SendGrid) is available for transactional messages.
- Hosting uses server‑side rendering on Vercel or similar; database on managed PostgreSQL.
- Users share their location via browser geolocation or ZIP input.

## personas

- **Samantha – Shelter Admin (age 34)**: Responsible for keeping listings up to date. Tech‑savvy but time‑constrained.
- **David – Prospective Adopter (age 27)**: Visits site on mobile, has specific preferences (medium dog, hypoallergenic).
- **Professor Lee – Evaluator**: Grades the database design and SQL quality.

## user stories and acceptance criteria

<details><summary>Expand to view all stories</summary>

### shelter admin

| id         | user story                                                                                                                         | acceptance criteria                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **US‑001** | As a shelter admin, I can sign in securely so that only I manage my shelter’s data.                                                | • Login uses email + password hashed with Argon2.<br>• 5‑try lockout in 15 min.<br>• JWT session expires in 24 h. |
| **US‑002** | As a shelter admin, I can view a paginated list of all my active pets.                                                             | • Default sort by creation date desc.<br>• Pagination size selectable (10/25/50).                                 |
| **US‑003** | As a shelter admin, I can create a pet with name, species, breed, sex, weight, age, description, photos (≤ 5) and adoption status. | • Required fields validated client‑ and server‑side.<br>• On success, pet appears in public catalogue within 5 s. |
| **US‑004** | As a shelter admin, I can edit any pet’s details.                                                                                  | • Optimistic concurrency; if record changed since loaded, admin prompted to refresh.                              |
| **US‑005** | As a shelter admin, I can mark a pet as adopted, removing it from public search.                                                   | • Status change instantly hides pet.<br>• Adoption date stored for reporting.                                     |
| **US‑006** | As a shelter admin, I receive an email with adopter details each time someone clicks “I’m interested”.                             | • Email contains pet id/name and applicant profile id.<br>• Duplicate emails allowed; admin chooses winner.       |

### adopter

| id         | user story                                                                                 | acceptance criteria                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **US‑007** | As a visitor, I can browse all available pets without logging in.                          | • Public catalogue accessible anonymously.                                                                 |
| **US‑008** | As a visitor, I can filter pets by location radius, species, size and age.                 | • Filters combine with AND logic; results update in ≤ 500 ms.                                              |
| **US‑009** | As an adopter, I can create an account with email verification to save favorites.          | • Verification token expires after 24 h.<br>• Unverified accounts cannot send inquiries.                   |
| **US‑010** | As an adopter, I can complete a quiz to get a ranked list of pets that fit my preferences. | • Quiz ≤ 10 questions.<br>• Ranking algorithm returns top 10 matches score‑sorted.                         |
| **US‑011** | As an adopter, I can view a pet’s profile with photos and details.                         | • Image gallery supports swipe on mobile.<br>• Age displayed in years + months.                            |
| **US‑012** | As an adopter, I can click “I’m interested” on a pet and submit an application form.       | • Required: phone, address, prior pet experience.<br>• On submit, success toast and email sent to shelter. |
| **US‑013** | As an adopter, I cannot apply for a pet already marked adopted.                            | • Button disabled with tooltip “already adopted”.                                                          |

### edge cases & system

| id         | user story                                                                                | acceptance criteria                                                   |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **US‑014** | As the system, I must prevent two shelters from owning the same pet record.               | • DB enforces `UNIQUE (external_shelter_id, shelter_id)`.             |
| **US‑015** | As the system, I must record every email attempt; failed sends retried up to three times. | • Failed logs visible in admin console; exponential back‑off 1→5 min. |
| **US‑016** | As the system, I must keep audit history of CRUD actions for grading.                     | • `pet_history` table populated via trigger.                          |

</details>

## functional requirements

- **FR‑01** Shelter authentication uses email/password with Argon2 hashing.
- **FR‑02** Admin dashboard provides create, read, update, delete, adopt actions on pets.
- **FR‑03** Public catalogue supports full‑text search on name/breed/description via `pg_trgm` extension.
- **FR‑04** Location queries use PostGIS Haversine distance and index on `(lat, lon)`.
- **FR‑05** Quiz answers persisted to `user_preference` and scored with a SQL CTE.
- **FR‑06** Email service called via REST endpoint `POST /api/email/adoption‑inquiry`.
- **FR‑07** Audit logs written by AFTER triggers into JSONB column.

## non‑functional requirements

- **Performance:** 95 % of catalogue requests complete < 500 ms; admin writes < 800 ms.
- **Scalability:** Design for 10 shelters, 5 000 concurrent visitors, 100 000 pets.
- **Security:** OWASP Top‑10 mitigations; rate limiting at 100 req/min IP.
- **Accessibility:** WCAG 2.2 AA compliance.
- **Reliability:** 99.5 % monthly uptime; email retry logic.
- **Maintainability:** Clean folder structure, ESLint + Prettier, typed SQL result mapping.
- **Internationalization ready** (UTF‑8, all text in i18n files).

## data model (logical)

**Entities**

- `shelter` (id PK, name, email_login, hashed_password, address, lat, lon, phone)
- `pet` (id PK, shelter_id FK, name, species, breed, sex, weight_kg, age_months, description, status ENUM('available','adopted'), created_at, updated_at)
- `pet_photo` (id PK, pet_id FK, url, sort_order)
- `user_account` (id PK, email, hashed_password, role ENUM('adopter'), email_verified_at, created_at)
- `user_preference` (user_id PK/FK, answers JSONB, created_at)
- `inquiry` (id PK, pet_id FK, user_id FK, message, created_at)
- `audit_log` (id PK, table_name, record_id, action, diff JSONB, actor_id, occurred_at)

**Notable constraints & indexes**

- `CHECK (age_months >= 0)`
- GIN index on `pet.description` for trigram search
- GEOGRAPHY index on shelter coordinates
- Foreign‑key cascade delete from `shelter` → `pet` → `pet_photo`

## technical design decisions

- **Frameworks:** Next.js 14 App Router (SSR + API routes), React 18, TypeScript 5, Tailwind CSS 3.
- **Database:** PostgreSQL 15 with PostGIS 3; migrations via `psql` scripts and `sqitch`.
- **SQL style:** parameterized queries through `pg` node driver to prevent injection.
- **Image storage:** S3‑compatible bucket; store URLs only in DB.
- **Email sending:** REST call inside API route; fallback spool table on error.
- **Hosting:** Vercel serverless functions (cold‑start mitigated by keep‑alive ping).
- **CI/CD:** GitHub Actions → Vercel Preview → Production.

## privacy, security and compliance

- Passwords hashed with Argon2id; 32‑byte salt, 4 iterations.
- TLS 1.3 enforced end‑to‑end.
- Content Security Policy strict‑dynamic; images self + bucket.
- GDPR‑style data export & delete endpoints for user data (even if project US‑only).

## analytics and instrumentation

- Track page views, quiz completions, pet inquiries using Plausible (self‑hosted).
- Server timing headers emitted for DB and render latency.
- Custom event `inquiry_submitted` with pet_id and user_id for conversion dashboard.

## rollout and release plan

1. **M1 – database foundation (Week 1‑2)**: finalize schema, seed script; pass professor review.
2. **M2 – shelter dashboard (Week 3‑4)**: admin CRUD complete; manual tests.
3. **M3 – public catalogue & filters (Week 5‑6)**: SSR list page, location search, images.
4. **M4 – quiz engine & matching (Week 7‑8)**: algorithm, UI, ranking SQL.
5. **M5 – inquiry workflow & emails (Week 9)**: application form, email integration.
6. **M6 – polish, accessibility, load test (Week 10)**: lighthouse ≥ 90, perf tuning.
7. **Demo & hand‑off (Week 11)**.

## risks and mitigations

| risk                                     | likelihood | impact | mitigation                                             |
| ---------------------------------------- | ---------- | ------ | ------------------------------------------------------ |
| Email provider quota exceeded            | medium     | medium | Add database spool + retry, monitor quota.             |
| Shelter forgets password                 | medium     | low    | Implement secure reset via expiring token.             |
| Quiz algorithm not perceived as accurate | low        | medium | A/B test scoring weights, gather feedback.             |
| SQL performance under load               | medium     | high   | Use EXPLAIN ANALYZE early, add indexes, caching layer. |
| Single shelter admin credential leakage  | low        | high   | 2FA optional; audit log alerts on unusual activity.    |

## future considerations

- Multi‑admin roles and granular permissions
- OAuth social login for adopters
- Push notifications via PWA
- Integration with municipal license systems
- Shelter‑to‑shelter pet transfers (many‑to‑many ownership)

---

This PRD captures the complete functional, non‑functional and data requirements needed to build and evaluate the pet adoption platform while demonstrating strong SQL craftsmanship.
