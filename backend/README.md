# Employee Digital Assistant — Backend

## Setup (do this first)
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set DB_PASSWORD, JWT_SECRET, ANTHROPIC_API_KEY
mysql -u root -p < config/schema.sql
npm run seed        # creates 2 employees + 1 HR user with dummy data
npm run dev          # starts on http://localhost:5000
```

Test logins (password for all: `password123`):
- `arjun@company.com` (employee)
- `priya@company.com` (employee)
- `meena.hr@company.com` (hr)

## API reference for frontend teammate

All routes except `/api/auth/login` need header: `Authorization: Bearer <token>`

| Method | Route | Who | Body / Notes |
|---|---|---|---|
| POST | /api/auth/login | anyone | `{email, password}` → `{token, user}` |
| GET | /api/tasks/:employeeId | employee (own) / hr | sorted by priority+deadline |
| POST | /api/tasks | hr | `{employee_id, title, description, priority, deadline}` |
| PATCH | /api/tasks/:taskId/status | employee | `{status}` |
| GET | /api/tasks | hr | all tasks across employees |
| GET | /api/leave/:employeeId | employee (own) / hr | leave balance |
| POST | /api/leave/apply | employee | `{start_date, end_date, reason}` |
| GET | /api/leave | hr | all leave requests |
| GET | /api/learning/:employeeId | employee (own) / hr | |
| POST | /api/learning | hr | `{employee_id, title, description, deadline}` |
| GET | /api/onboarding/:employeeId | employee (own) / hr | |
| POST | /api/it/ticket | employee | `{issue}` |
| GET | /api/notifications | employee | own unread + recent notifications |
| PATCH | /api/notifications/:id/read | employee | mark one read |
| POST | /api/assistant/chat | employee | `{message}` → `{reply}` — this is the AI chat endpoint |

## AI assistant
`POST /api/assistant/chat` runs the whole tool-calling loop server-side. Frontend just sends
`{message: "which task should I do first?"}` and displays `reply`. No need to build any AI logic on the frontend — just wire up the floating chat button to this one endpoint.

## Reminder system
Runs automatically in the background (`config/scheduler.js`), checks every 60s for tasks due
within 10 minutes, and inserts into `Notifications`. Frontend should poll
`GET /api/notifications` every ~30s to show new ones (or add a badge count).

## Notes / cut for time
- No refresh tokens — 8hr JWT expiry is enough for a hackathon demo.
- HR policy / IT knowledge base is keyword-matched, not real RAG — fine for demo, swap for
  vector search later if there's time.
- Leave requests don't auto-update Leave_Balance — approve manually via SQL if you want to
  demo the "after approval" state.
