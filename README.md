# Lauren's Dashboards

Two self-contained web pages. No logins, no setup, nothing technical — double-click
and they open in your browser.

| File | What it's for |
|---|---|
| `index.html` | **Personal admin** — to-dos, deadlines, delegation, email templates |
| `deals-dashboard.html` | **Enquiry & conversion analytics** — 365 days of Physio Inq deals, cut by location, discipline, source and referrer type |

---

# Personal Admin Dashboard

A simple, private command centre for your day.
Open `index.html` in any web browser and it just works.

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

---

# Enquiry & Conversion Dashboard

`deals-dashboard.html` — built from the HubSpot *deals by source* export
(26 July 2025 – 25 July 2026, 15,535 enquiries). Open it in any browser; all the
data is inside the file and nothing is sent anywhere.

## What it answers

- **Trends** — enquiry volume and conversion rate month by month, plus how the
  channel mix and the type of person enquiring have shifted.
- **Segments** — cut every metric by state, suburb, postcode, discipline,
  relationship to the participant, funding type, delivery mode, source, campaign,
  keyword, deal owner or month. Sortable, with a volume-vs-conversion scatter for
  "where does the next dollar go".
- **Cross-cut** — any two dimensions as a heat map (conversion, volume, bookings
  or geo-blocked rate), with a built-in explainer covering what each number means,
  how the shading works, and three cross-cuts worth running.
- **Why we lose** — recorded loss reasons, split by channel, plus a
  suburb/postcode list of demand we couldn't service.
- **Recruitment** — unmet demand by area *and discipline*, so each location comes
  with the role attached. State summary → click a state to drill into its suburbs
  → group by postcode district for a realistic catchment. Exports to CSV for the
  recruitment team.
- **Paid channels** — campaign and keyword performance; load a Google Ads or
  Microsoft Advertising campaign export and it works out cost per enquiry and
  cost per booking per campaign.
- **Opportunities** — plain-language cards generated from whatever is filtered,
  ranked by how many bookings are at stake.
- **Method** — exactly how every number is defined.

## Filters

One filter row scopes the whole page: period, state, discipline, source,
relationship, funding, delivery mode, ad platform, and a free-text search across
suburb, postcode, campaign and keyword. Every chart has a **Table** toggle, and
**Export view (CSV)** downloads whatever is currently filtered.

## Loading your own data

- **Newer deals** — export the same HubSpot view (same columns) and use
  *Load newer export*. The file is read in your browser and remembered on that
  computer only. *Method → Go back to the original export* undoes it.
- **Ad spend** — use *Google Ads data*. The file needs a **Campaign** column and
  a **Cost** (or Spend) column; add a **Month** segment so costs follow the period
  filter, and include **Clicks / Impressions / Conversions** if you have them.
  In Google Ads: Campaigns → Campaigns, set the date range, Segment → Time →
  Month, make sure paused and removed campaigns aren't filtered out, then
  download as CSV. Microsoft Advertising is the same idea via Reports →
  Campaign performance. Load one file then the other and choose *add* when
  prompted to keep both accounts. Campaigns are matched by name, so names in the
  ad account need to match what lands in HubSpot's "original source
  drill-down 1". Spend is stored in your browser only and is never included
  when you send the dashboard file to someone else.

## Unmet demand (the Recruitment tab)

Two things count as unmet:

- **Coverage gap** — lost with the reason *No Appropriate Therapist – Geography –
  Declined Telehealth*. Nobody travels there and the client didn't want telehealth.
- **Capacity & skills gap** — lost with any other *No Appropriate Therapist*
  reason (at capacity, skills, age, discipline not in the service area), plus
  enquiries still sitting in the *WL Therapist at Capacity* stage. On by default;
  untick the switch for pure coverage gaps.

Discipline columns count what each enquiry asked for, so an enquiry naming two
disciplines appears under both — the columns add up to more than the total.

## What ad spend can and can't tell you

Spend is recorded per campaign per month, so it can be split by **time** but not by
state, discipline or funding — a campaign has one cost however its enquiries are
spread. Whenever one of those filters is on, the dashboard hides cost per enquiry
and cost per booking rather than showing a figure that can't be right.

Campaign names in the ad account drift from what HubSpot recorded (annotations get
appended, campaigns get renamed). The dashboard matches on the name, then falls
back to matching the words in common, and every pairing is listed under
*Campaign name matching* on the Paid channels tab with its confidence — untick any
that look wrong and the spend stops counting. MCC exports covering several accounts
are supported: subtotal rows are ignored, and each account can be switched off if
it books through a different funnel.

## A note on the conversion rate

Conversion = booked ÷ (booked + lost). Enquiries still in progress are left out.
A loss reason only counts when the enquiry actually ended lost — 706 enquiries
carry a "failed to convert" reason but finished booked, usually after a first
attempt at matching a therapist failed, so figures taken straight off HubSpot's
reason field read slightly higher.
Losses take longer to be recorded than bookings, so the most recent few weeks
always read high — that window is shaded on the trend chart, and the
**Mature leads only** switch removes it.
