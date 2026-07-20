# Lauren's Admin Hub

A simple, private command centre — no logins, no setup, nothing technical.
Open either file in any web browser and it just works.

- **`index.html`** — your personal admin dashboard (below).
- **`team-hub.html`** — the Growth & Partnerships Department Hub (the live replacement for the quarterly operational tracker spreadsheet).

The two are linked to each other by the buttons in their top bars.

---

# G&P Department Hub (`team-hub.html`)

A live hub that replaces the *Pinq G&P — 2026 Operational Tracker* spreadsheet. It's built around your real
model: the **five strategic pillars** (Services, Finance, People, Processes, Governance), the six-person team,
and all 27 initiatives with their KPIs, leads, timelines, statuses and quarterly updates.

### What it fixes

In the spreadsheet, every initiative was typed **twice** — once on the person's tab (for 1:1s) and again on the
Operational Tracker summary — and the CEO Dashboard RAG counts were then tallied by hand. In the hub, **each
initiative is entered once** and everything else is *derived* from it, so nothing is ever duplicated:

- **🗂️ Operational Tracker** — the single source of truth. All initiatives grouped by pillar; set status, %
  complete and the quarterly update note inline. A period selector switches between quarters.
- **👤 My View / 1:1** — pick a person and see the initiatives they lead and support (pulled straight from the
  tracker — editing an update here changes it everywhere), plus their **monthly 1:1 check-in log** (wins,
  progress, blockers, focus, wellbeing). This is the space for individual progress that sits *outside* the plan
  initiatives, and it's what you use to run 1:1 meetings.
- **📊 Overview** — pillar-health cards whose RAG **rolls up automatically** from the initiatives beneath them,
  a status-mix chart, initiatives-led-by-person, and a live *needs-attention* list of everything at risk / off track.
- **📈 CEO Dashboard** — the pillar RAG table computed live (no manual tallying), plus the editable Key Metrics
  Snapshot (targets, latest actuals, owners, data-source links).
- **📄 Board Report** — one click compiles a formatted CEO/board report with an **auto-written executive
  summary**, pillar-health table, key-metrics snapshot, progress this quarter, a needs-attention list, and team
  highlights drawn from the 1:1 logs. Then **Print / Save as PDF**, **Copy as text**, or **Analyse & polish with
  Claude**.

### Keeping it updated & shared

Your 2026 plan is already loaded in. Everything saves automatically in the browser on that device. **Export**
saves the whole hub to one file; **Import** either replaces the hub or **merges** a colleague's exported file
(their check-ins and initiative updates) into your master — so the team can feed you updates without double entry.
For true live multi-person editing, the hub would need to be hosted (the same follow-up as the live Outlook /
M365 connection, which is currently blocked by the company security policy).

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
