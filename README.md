# Lauren's Admin Hub

A simple, private command centre — no logins, no setup, nothing technical.
Open either file in any web browser and it just works.

- **`index.html`** — your personal admin dashboard (below).
- **`team-hub.html`** — the Marketing Team Hub (department plan, projects, tasks & board reporting).

The two are linked to each other by the buttons in their top bars.

---

# Marketing Team Hub (`team-hub.html`)

A department planning & tracking hub for the marketing team — everything in one page, with six tabs:

- **📊 Overview** — live snapshot: active projects, on-track vs at-risk, tasks in flight, blocked/overdue items, and team size; plus a *workload by person* chart, a *task status mix* chart, project-health bars, the next 30 days of milestones & deadlines, and a *needs-attention* list.
- **🗂️ Projects** — a visual **timeline** (each project drawn start → target, with a "today" line), and project cards with lead, status, priority, progress and checkable milestones.
- **✓ Tasks** — the allocation board: who's doing what, filterable by person / project / status and sortable by due date, priority or person.
- **👥 Team** — a directory card per person: role, email, focus areas, availability, and how many active tasks they're carrying.
- **🎯 Dept Plan** — the department's objectives with measurable key results; type in the current number and the progress fills itself.
- **📄 Board Report** — one click compiles a formatted, ready-to-present board report: an **auto-written executive summary**, objectives progress, a project-status table, achievements this period, upcoming milestones, team workload, and a risks/blockers list. Then **Print / Save as PDF**, **Copy as text**, or **Analyse & polish with Claude** (copies the report and opens a chat so Claude can tighten the narrative).

Everything you enter is saved automatically in that browser. Sample data is included so you can see how it works — just edit or delete it. Use **Export** / **Import** (top right) to move the whole hub between computers as a single file.

---

# Personal Admin Dashboard (`index.html`)

## What it does

- **Today's To-Do** — jot down what you need to do today, tick things off, clear finished items.
- **Deadline Timeline** — track anything with a due date. It sorts itself and flags what's *overdue*, *today*, or *coming up*.
- **Team Delegation** — hand tasks to your team, note who's doing what, and track each one from *To do → In progress → Waiting → Done*.
- **Email Helper** — pick a ready-made template (delegate, follow up, confirm a meeting, politely decline, thank you, request info), fill in the blanks, then open it straight in Outlook or copy it.
- **Quick links** — one-click buttons to your Outlook email, calendar, Microsoft To Do, and Teams.
- **Summary strip** — at a glance: to-dos left, overdue deadlines, deadlines this week, tasks out with the team.

## How to open it

1. Download/keep the file `index.html`.
2. Double-click it — it opens in your web browser.
3. **Bookmark the page** so it's one click away each morning.

Everything you type is saved automatically *in that browser* on that computer.

## Keeping your info safe

- Click **⬇︎** (top right) now and then to save a backup file to your Downloads.
- Click **⬆︎** to load a backup back in (e.g. if you move to a new computer).
- **◐** switches between light and dark mode.

## Making it "live" (optional, needs IT)

Right now the dashboard links *out* to your real Outlook and Teams with the buttons up top.
To have your actual inbox and calendar pulled *into* the dashboard automatically, your
company's IT team needs to approve the **Claude / Microsoft 365** connection — it's currently
blocked by a Microsoft security policy (a "Conditional Access" rule). Once that's approved,
this can be upgraded to show your live emails and appointments.

## Ideas for later

- Live Outlook inbox & calendar feed (needs the IT approval above).
- A weekly email that summarises the week's deadlines.
- Recurring to-dos that reappear each day/week.
- Sharing the delegation board with your team.
