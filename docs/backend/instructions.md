# GitHub Copilot Engineering Notes for Recode Backend

These instructions define how GitHub Copilot (and new devs) should contribute code to the **Recode** project, matching Brandon’s expectations and architecture decisions. It reflects your backend philosophy, tech stack, structure, and standard engineering practices for fast, secure, MVP-first development.


## Project Architecture Summary

**Stack**:

- **Backend**: FastAPI, PostgreSQL (via Supabase), Pydantic, Judge0, SpaCy
- **Auth**: Supabase Auth (via backend, no Supabase.js on frontend)
- **Storage**: Supabase Buckets
- **Frontend**: React (or Vue), Tailwind, API-driven only
- **Async** (later): Redis + Celery
- **Hosting**: Railway/Render (backend), Supabase (DB/Auth), Vercel (frontend)

## Folder Structure Overview

```bash
app/
├── api/v1/                # FastAPI routes grouped by version
├── core/                  # App-wide settings, auth setup, constants
├── db/
│   ├── models/            # SQLAlchemy models (DB schema)
│   └── base.py            # Declarative base
├── schemas/               # Pydantic schemas for API input/output
├── services/              # Business logic per feature
├── utils/                 # Helper utilities (tokens, hashing, etc)
└── main.py                # App entry point
```

## Copilot Coding Rules & Engineering Patterns

### 1. Always Follow This Backend Flow

```txt
Frontend → calls API route (routes/) → uses schema (schemas/) → calls logic (services/) → talks to DB (models/) → returns response
```

### 2. When creating a new feature:

```bash
1. Define DB model (SQLAlchemy) in `db/models/feature.py`
2. Create migration with Alembic or Supabase SQL editor
3. Create Pydantic schemas in `schemas/feature.py`
4. Write business logic in `services/feature.py`
5. Wire route in `api/v1/feature.py`
6. Connect to frontend contract shape
```

### 3. Use Pydantic Schemas to define:

- **Input validation**: what the backend expects
- **Output shape**: what frontend gets

Always:

```python
from pydantic import BaseModel
class QuestionCreate(BaseModel):
    title: str
    body: str
```

### 4. Use Services to isolate logic

- No DB calls or logic in the route files.
- Add logic like `calculate_elo()`, `award_badge()` inside `services/`.

### 5. Use `@router.post/get` in route files with prefix `/api/v1/`

```python
@router.get("/challenges/{id}", response_model=ChallengeOut)
def get_challenge(id: UUID):
    return challenge_service.get_by_id(id)
```

## 🔐 Authentication & Authorization

- **Supabase Auth** is used. JWT is passed from frontend via cookie.
- Always extract user from token in routes using:

```python
from app.core.auth import get_current_user
@router.get("/me")
def get_profile(user = Depends(get_current_user)):
    return user
```

- Use `user.role` (e.g. `"lecturer"`, `"student"`) to **authorize** actions in service layer.

## Feature Engineering Conventions

### Naming conventions

- Tables: `snake_case`
- Pydantic: `CamelCase`
- Enums: UPPERCASE

### Badge/ELO engine logic

- Award `bronze/silver/gold` using set challenge structure (5/3/2)
- Score calculation weights: bronze=6%, silver=10%, gold=20%
- Store ELO & titles in `user_elo`, `user_title`
- Use service method `award_and_recompute(user_id, challenge_id)`

### Challenge rollout logic

- Add `available_from` and `due_date` to `challenge` model
- Backend only sends challenges where `available_from <= today`

### NLP/Topic Mapping (MVP)

- Use spaCy to extract nouns/verbs
- Generate topics in `services/nlp.py`
- Store in `nlp_generated_topic` table

## Optimization & Scaling Notes

- Use FastAPI’s built-in async where possible
- Later: use Celery for async (Judge0 queue, reminder jobs)
- RLS in Supabase handles DB-level filtering
- Use Redis + dead-letter queues for background retries
- Avoid repeated queries: use `.options(joinedload(...))` for joins

## API Testing Tips

- Use Swagger UI at `/docs`
- Use Postman or ThunderClient with cookies
- All requests: `credentials: 'include'`

## Error Handling

- Raise `HTTPException(status_code=..., detail="...")` in services
- Catch and wrap Judge0 errors
- In Celery jobs: use retries and task log table

## Security Rules

- Never send Supabase service role key to frontend
- All user data filtered by role and user ID
- Enforce ownership checks in `services/`

## Dev Flow

- All feature branches → into `dev` branch via PR
- `main` branch = protected
- Add migrations per model change
- Write `.env.sample` for shared setup

## Remember

- Pydantic = API schema only, not DB
- DB = SQLAlchemy + migrations (or Supabase SQL)
- Services = your brain (logic lives here)
- Routes = dumb wrappers
- Frontend = gets clean data, never talks to Supabase directly

Want examples? Check `/app/services/scoring.py` or `/schemas/badge.py`.
Keep backend dumb but smart where it counts.

> 🧠 Recode’s goal is a clean, scalable backend that feels like an API brain — reliable, predictable, and modular. Copilot should generate code **that respects the stack, avoids shortcuts**, and fits the structure above.

Done right, this will scale from MVP → production without rewriting everything.
