# Fitness App V2 — Plan

## What we're building (V1)

A personal fitness tracker that runs entirely in your web browser. No login,
no internet connection needed after the page loads, no server. All your data
is saved in that browser on this computer (using a browser feature called
"localStorage" — basically a small private storage box the browser gives
each website).

**Core features for V1:**

1. **Pick a workout type** — Upper A, Upper B, Lower A, Lower B, or Rest.
   (This replaces a freeform "routine builder" — see note below.)
2. **Log a strength workout** — for the chosen type, check off which
   exercises you did. **Rounds are counted automatically: 1 round per
   exercise checked** (so 0-7, since each split has 7 exercises).
   You can **log more than one of these per day** (e.g. 2 rounds of Upper A,
   then later add 2 rounds of Lower A) — each one adds to that day's score.
   Checking an exercise also reveals **reps and weight used** fields: 4 reps
   boxes (one per set) and one weight that applies to all of them. Weight is
   a 10/15/20/25/30 lbs dropdown and only appears for dumbbell exercises,
   not bodyweight ones like push-ups, dips, pull-ups, chin-ups, plank and
   the leg raises. **Plank** is timed: its 4 boxes are seconds, and its
   personal best shows total seconds (e.g. "180 sec"). These are for your own
   record-keeping and don't affect the score.
3. **Log cardio** — a simple Yes/No for today, with a 4-times-a-week
   requirement.
4. **Log active kcal and perceived effort** — kcal is typed in once per
   day (in the "Cardio / Movement" box); perceived effort (1-10) is picked
   in each workout box, one per workout.
5. **Daily score (0-100%)** — calculated automatically from the above (full
   formula below).
6. **Calendar view** — see every day's score at a glance.
7. **Dashboard** — average score this week, average score this month, and
   progress toward a monthly rounds goal for each split (see below).
8. **Everything saved** in the browser when you press "Save today", so
   closing and reopening the page doesn't lose your data.

### Note on "routines"

Your original ask included "plan/follow routines." Looking at the scoring
system you described, the four named splits (Upper A, Upper B, Lower A,
Lower B) effectively *are* the routines — each one is a fixed, named list of
exercises with its own weighting. So for V1, "routine" = picking one of
those four (or Rest) for today, rather than building custom routines from
scratch. If later you want to assign which split happens on which day of
the week automatically (e.g. "Mondays are always Upper A"), that's a small,
separate feature we can add after V1 — flag it if you want that sooner.

## Daily score formula (confirmed with you)

The final score is out of 100, built from four weighted pieces:

| Piece | Weight |
|---|---|
| Strength workout | 55% |
| Perceived effort | 25% |
| Cardio (Y/N) | 15% |
| Active kcal | 5% |

**1. Strength (55 points max)**

Each workout type has specific exercises with weights that add up to 1.0
(100%) — these are the numbers you gave me:

- **Upper A**: Dumbbell Bench Press 0.1, Seated Dumbbell Shoulder Press 0.2,
  Push-ups 0.2, Dips 0.2, Incline (Close-Grip) Dumbbell Press 0.15,
  Dumbbell Lateral Raise 0.075, Overhead Dumbbell Extension 0.075
- **Lower A**: Dumbbell Goblet Squat (Back) 0.2, Dumbbell Goblet Squat
  (Front) 0.2, Dumbbell Bulgarian Split Squat 0.15, Dumbbell Reverse Lunge
  0.15, Standing Dumbbell Calf Raise 0.1, Russian Twist / Leg Raise (Floor)
  0.1, Plank 0.1
- **Upper B**: One-Arm Dumbbell Row 0.15, Pull-ups 0.175, Chin-ups 0.175,
  Dumbbell Rear Delt Fly 0.125, Dumbbell Curl 0.125, Hammer Curl 0.125,
  Dumbbell Shrugs 0.125
- **Lower B**: Dumbbell Romanian Deadlift 0.2, Single-Leg Romanian Deadlift
  0.1, Dumbbell Reverse Lunge 0.2, Dumbbell Swing 0.1, Dumbbell Glute Bridge
  0.1, Hanging Leg Raise 0.2, Dumbbell Side Bend 0.1

For **one** logged workout session:
Step 1: add up the weights of the exercises you actually checked off →
"exercise completion" (0-100%).
Step 2: multiply that by the **rounds table** %, where rounds = the number
of exercises checked (confirmed with you, editable in Settings):

| Rounds | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |
|---|---|---|---|---|---|---|---|---|
| % | 0 | 51 | 62 | 71 | 79 | 87 | 94 | 100 |

e.g. 4 exercises totaling 70% → 70% × 79% = 55.3% of that session's score.
Only checking all 7 reaches full strength points.

If you log **more than one session in a day** (e.g. 2 rounds of Upper A,
then 2 rounds of Lower A), each session's result from Step 2 is **added
together**, capped at 100% — doing more work the same day raises your score,
up to the max.

Final step: multiply the (possibly combined) result by 55 to get your
strength points for the day.

**2. Perceived effort (25 points max)**

You pick a number (1-10) in each workout box (required to save), converted
by this table (confirmed with you):

| Effort | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|---|---|
| % of this piece | 100 | 95 | 90 | 80 | 70 | 60 | 50 | 40 | 30 | 20 |

If you log more than one workout in a day, their efforts are **averaged**.
An in-between average scales smoothly (e.g. 8.5 → 92.5%).

**3. Cardio (15 points max)**

"Cardio today?" Yes/No. "Yes" reveals one or more **cardio sessions**
("+ Add another cardio session"), each with: type (Walk / Hike / Run /
Swim / Kayak), duration in minutes (whole number, 1+), intensity (Easy /
Moderate / Hard), and optional "Session kcal (this workout only)" — stored
and shown but never scored.

- **Yes**: add up every session's `minutes × intensity` (Easy 1, Moderate
  1.5, Hard 2). Reaching the **cardio target (45 by default, e.g. 30 min
  Moderate)** earns the full 15 points; less scales down proportionally.
  The target is editable in Settings.
- **No, within your 3 cardio rest days this week**: the cardio piece is
  **left out** — that day is scored on the other 85 points, scaled to 100%.
- **No, after the 3 cardio rest days are used up**: 0 / 15, counted.
- Older saves with a "Yes" but no session details keep full cardio points.

Known trade-off (confirmed with you): on a cardio rest day, a short
session can lower the day's % compared to skipping cardio, if the rest of
the day is scoring higher than the session does.

The week runs Sunday-Saturday and the cardio-rest-day count resets every
Sunday — same as weight training rest days below.

**4. Active kcal (5 points max)**

You type in a number, converted by this table (confirmed with you):

| Active kcal | % of this piece |
|---|---|
| 0 | 0% |
| 600 | 80% |
| 800 | 90% |
| 1000+ | 100% |

Values in between scale smoothly along a straight line between the two
nearest rows (e.g. 300 kcal = 40%, 700 kcal = 85%).

### Rest days are a special case

- You're allowed **2 rest days per week** (Sunday-Saturday, resets every
  Sunday). A rest day taken within that allowance is **excluded entirely**
  from your weekly/monthly average — it's not scored at all, good or bad.
- If you take a **3rd (or more) rest day** in the same week, that extra day
  **is** scored — but only using the active-kcal piece, on its own, out of
  100% (not the usual 5% slice — the whole day's score becomes whatever
  your kcal number maps to).

## Calendar and dashboard

- **Calendar**: a monthly grid, one cell per day, showing that day's score
  (rest days taken within the weekly allowance are marked as excluded
  rather than given a score).
- **Dashboard**:
  - Average score this week.
  - Average score this month.
  - For each split (Upper A, Upper B, Lower A, Lower B): total rounds
    logged this month, out of a **goal of 24 rounds per split per month**
    (e.g. "Upper A: 14/24 rounds this month"). This is an informational
    progress stat — it doesn't feed back into the daily score itself.
- Built with plain HTML/CSS/JS, no calendar library — simple enough to not
  need one, and it keeps us at zero installed dependencies.

## Tech stack (and why)

- **HTML, CSS, and plain JavaScript. No frameworks, no build tools, no
  installs.**
- Why: everything above — exercise checklists, counters, a formula, saved
  history — is well within what plain JavaScript can do. You're the only
  user and data stays on your computer, so no server or database is needed.
  No "npm install", no build step — you just open a file in your browser.
- Storage: the browser's built-in `localStorage`.
- Active kcal is **typed in by hand** (not pulled from Apple Health
  automatically) — reading real Apple Health data would require extra
  integration work beyond a plain web page, so that's intentionally out of
  scope for V1. We can revisit it later as its own step if you want it.

## How you'll run the app (every step uses this)

1. Open the project folder in VS Code (you already have this).
2. Find `index.html` in the file list.
3. Right-click it → "Open with Live Server" if you have that VS Code
   extension, OR simply double-click `index.html` in Finder to open it in
   your browser.
4. That's it — no terminal commands needed to run the app itself.

I'll tell you exactly what to click and what you should see after every
single step below.

## Build order (one small feature at a time)

1. **Project skeleton** — `index.html`, `style.css`, `app.js` with a title.
   Confirms the app opens and shows something.
2. **Navigation shell** — tabs: Today, Calendar, Dashboard. Empty layout
   only.
3. **Log one strength session** — pick a workout type (Upper A / Upper B /
   Lower A / Lower B / Rest), check off exercises, pick rounds (2-7).
   Temporary, not saved yet.
4. **Log more than one session per day** — an "add another workout" button
   so you can log e.g. Upper A then Lower A the same day. Temporary.
5. **Reps and weight per exercise** — checking an exercise reveals a reps
   field and a weight field for it. Record-keeping only, doesn't affect
   the score. Temporary, not saved yet.
6. **Cardio, active kcal, perceived effort inputs** — simple fields for
   today. Temporary, not saved yet.
7. **Exercise info (i): muscles targeted** — a small (i) next to each
   exercise in the checklist. Clicking it shows the muscles that exercise
   works. Clicking it again (or another (i)) closes it.
8. **Save today's entries permanently** — a **"Save today"** button at the
   bottom of the Today tab stores everything above in `localStorage`, so it
   survives closing/reopening the browser and later feeds the Calendar and
   Dashboard. Before saving, it checks that every checked exercise has
   **all 4 reps boxes filled in** (and a weight picked, for dumbbell
   exercises). If something's missing, it highlights it and doesn't save.
   Reopening the page shows today's saved entries so you can edit and save
   again.
9. **Exercise info (i): personal best** — add your best-ever set to each
   exercise's (i), shown like "36 reps x 30lb". Reps = the total of the 4
   reps boxes in one workout. "Best" = the heaviest weight you've used; if
   tied, the most total reps at that weight. Bodyweight exercises show the
   most total reps. Shows "No record yet" until you've logged
   it once.
   Also add **sets completed this month** for that exercise (e.g. "Sets
   this month: 12"), counting from the 1st to the last day of the calendar
   month and starting again at 0 on the 1st. Because saving requires all 4
   reps boxes, each saved exercise counts as 4 sets.
10. **Weekly rest-day counters** — track "Weight training rest days" (2
    allowed) and "Cardio rest days" (3 allowed) this week (Sun-Sat), resetting Sundays.
11. **Daily score formula** — implement the full calculation above,
    including combining multiple sessions and the rest-day-overage special
    case. We'll nail down the exact effort and kcal tables with you at this
    step.
12. **Settings page** — a new "Settings" tab where every number behind the
    daily score can be edited and saved (in `localStorage`, like your
    workouts). That covers:
    - **Piece weights**: the 55 / 25 / 15 / 5 split between strength,
      effort, cardio and kcal (must add up to 100).
    - **Exercise weights**: each exercise's share within Upper A/B and
      Lower A/B, shown as % (must add up to 100% per split). You can also
      rename exercises (history follows the new name). Adding brand-new
      exercises and switching exercises off/on are not planned (decided
      with you).
    - **Weekly allowances**: cardio rest days allowed per week (3), weight training
      rest days allowed per week (2), and the cardio target (45).
    - **Rounds table**: the % earned for 0-7+ rounds.
    - **Effort and kcal tables**: how an effort or kcal number turns into
      a percentage.
    - **Monthly rounds goal** per split (24). This only feeds the dashboard,
      not the score.
    - A **"Reset to defaults"** button that brings back the original
      numbers above.

    If something doesn't add up (e.g. piece weights total 90), the page
    shows a warning and won't save until it's fixed. Changing settings
    re-scores all past days too (confirmed with you).

    Built in three parts, each tested and committed on its own:
    - **12a**: Settings tab, piece weights, weekly allowances, monthly
      rounds goal, Reset to defaults.
    - **12b**: effort and kcal tables.
    - **12c**: exercise weights and renaming exercises.
13. **Show today's score** on the Today tab.
14. **Cardio details** — sessions with type, duration, intensity and
    session kcal; cardio scored on duration × intensity (see formula above).
15. **Calendar view** — monthly grid with each day's score (rest days
    marked as excluded where applicable).
16. **Edit any day from the calendar** — clicking a day shows its score and
    an "Edit day" button (not for future days). It opens that day on the
    Today tab ("Editing Mon, Oct 19", "Back to today", "Save day"), so you
    can fix a past day or log a missed one.
17. **Dashboard: weekly and monthly average score**.
18. **Dashboard: monthly rounds-per-split progress** — e.g. "Upper A:
    14/24 rounds this month" for each of the four splits.
19. **Dashboard: cardio minutes per month** — total minutes for each type
    (Walk, Hike, Run, Swim, Kayak; 0 if none) plus a combined total, with
    ‹ Previous / Next › arrows to view earlier months. Old saves without
    session details are left out.
20. **Muscle list per exercise** — one editable list of primary and
    secondary muscles for every exercise (below), keyed by original name so
    renames keep it. The (i) shows it ("Primary: Chest · Secondary: Front
    delts, Triceps"), replacing the old "Muscles targeted" text.
21. **Dashboard: muscle map** — a simple front and back body drawn from
    scratch (inline SVG, no libraries), one shape per muscle group:
    chest, front delts, side delts, rear delts, biceps, triceps, forearms,
    traps, lats, upper back, abs, obliques, lower back, glutes, quads,
    hamstrings, adductors, calves.
    - Shaded like a heat map by volume in the period: gray = none, then 5
      light → dark accent shades at fixed ranges (set with you). Week:
      1-4, 5-8, 9-12, 13-16, 17+ rounds. Month: x4 (1-16, 17-32, 33-48,
      49-64, 65+). The legend shows the ranges.
    - Volume = rounds from saved days (changed from reps, with you): each
      checked exercise is 1 round for its primary muscles and ½ round for
      its secondary muscles. Reps and seconds aren't used.
    - This week / This month toggle (month view uses the same ‹ › arrows
      as the cardio-minutes section).
    - Tapping or hovering a muscle shows its name, total rounds, and the
      exercises that contributed.
    - Under the figure: every muscle with its rounds, highest first.
22. **Polish pass**, in four parts (each tested and committed):
    - **22a**: calendar score colors — a smooth gradient: 100 turquoise-
      green, 90 green, 80 yellow-green, 70 yellow, 60 yellow-orange, 50
      orange-red, 49 → 0 redder and darker. Unscored days stay white.
    - **22b**: consistent buttons (main / secondary / delete) and spacing.
    - **22c**: phone layout — every tab checked and fixed at phone width.
    - **22d**: unsaved-changes warning before switching days, "Back to
      today", or closing the page. Unsaved Settings edits also warn on
      closing/refreshing the page.
23. **Color theme** — a theme picker at the top of Settings: **Default**
    (the original black and white) or **Brown & Gold** (Padres-inspired:
    brown #2F241D, gold #FFC425, cream #FFF8E7). Color-only: every color
    is a named variable in style.css, and a theme overrides them. Applies
    immediately and is remembered on its own (Reset to defaults keeps it).
    Red, green and the calendar's score colors never change. The muscle
    map follows the theme: grays → black in Default (changed with you;
    unworked muscles get a dashed outline), light gold → deep brown in
    Brown & Gold.
24. **Dashboard month by month** — one ‹ › month switcher at the top of the
    Dashboard; the monthly average, rounds per split, cardio minutes and
    muscle map all follow it. The "This week" average and the muscle map's
    week view only appear on the current month.
25. **More stats** — a collapsed "More stats" box at the bottom of the
    Dashboard (nothing above it changes). A grouped dropdown picks one stat
    at a time; a 4 weeks / 3 months / 6 months / All time toggle applies to
    all of them. Charts use **Chart.js 4.4.1** from cdnjs (agreed with you;
    needs internet — tables still work offline) and follow the color theme.
    Each has a title, labeled axes and a one-line explanation; too little
    data shows "Not enough data yet". Each stat is one entry in a list: a
    `calculate` function (numbers only) and a `draw` function (chart only).
    Words: each of an exercise's 4 boxes is a **set**. Built in parts:
    - **25a**: the box, dropdown, range toggle, Chart.js, theme colors,
      "Not enough data" message, and **Day score over time**.
    - **25b**: Strength — estimated 1-rep max per exercise (Epley: weight ×
      (1 + reps/30), best set of the day; bodyweight → max reps, Plank →
      max seconds), personal records table, effort over time.
    - **25c**: Volume — weekly sets and reps per body area (Chest,
      Shoulders, Arms, Back, Core, Legs; primary 1, secondary ½; Plank
      seconds left out), most/least trained muscles, Upper vs Lower.
    - **25d**: Consistency — workouts per week, heat map by day score,
      current/longest streak (Sun–Sat weeks with 3+ workout days), split
      counts.
    - **25e**: Cardio — minutes per month by type, Easy/Moderate/Hard mix.
    - **25f**: Reps — best session per exercise, total reps per session
      (best marked), best single set, rep PR table (PRs in the last 7 days
      highlighted), set 1 vs last set. Dumbbell records are per weight
      ("50 reps @ 30 lb"); Plank in seconds.
    - **25g**: "New PR" tag on the Today tab next to an exercise whose
      session total or best set beats every earlier day (same weight).
    - **25h**: optional Bodyweight (lb) box on the Today tab, and the
      **Bodyweight trend** chart (dots + 7-day rolling average).
26. **Focus mode for logging** — on the Today tab (same page, tabs stay
    visible), each workout box lists its split's exercises as big rows
    (Not started / 2/4 / ✓ 48 reps). Tapping one opens focus mode: name,
    weight pre-filled from last session (hidden for bodyweight), and one big
    number box per round (number keypad, auto-focus, "last: 15" hint),
    ✓ or Enter to lock it in. Finished rounds stay above and can be tapped
    to fix. Plank uses seconds. "Rounds per exercise" setting (4). Here a
    "round" is one box (the stats call these sets).
    Saving (agreed with you): every ✓ is saved at once. A finished exercise
    goes straight into the day's log (same format as before); a half-done
    one is kept in a separate draft store until finished, so it never
    counts early. Leaving and coming back resumes at the next round. "Save
    today" still saves cardio, kcal and bodyweight.
    - **26a**: exercise list, focus mode, auto-save/resume, rounds setting.
    - **26b**: finished screen — total, New PR tag, "Next exercise".
27. **Focus mode polish**:
    - **27a**: "Same as last" and – / + buttons for each round.
    - **27b**: rest timer after each ✓ (setting, 90 s): +30 s, skip;
      vibrates (where supported, not iPhone) and flashes at zero; typing
      or tapping –/+/Same as last on the next round cancels it.
    - **27c**: auto split — opens to the next split after the last
      workout (Upper A → Lower A → Upper B → Lower B); still changeable.
    - **27d**: keep the screen awake in focus mode (Wake Lock, where
      supported).
    - **27e**: "Skip today" per exercise. Agreed with you: skipped
      exercises are left out of the strength score and the others share
      their weight. Saves a `skipped` list with the workout (the one
      saved-data addition).
    - **27f**: effort as one 1–10 rating with big buttons after the last
      exercise (scoring unchanged).
    - **27g**: installable/offline app — on hold. Needs the app hosted on
      a website (e.g. GitHub Pages), and each device keeps its own data;
      to be discussed first.

### Exercise → muscle list (primary; secondary)

| Exercise | Primary | Secondary |
|---|---|---|
| Dumbbell Bench Press | chest | front delts, triceps |
| Seated Dumbbell Shoulder Press | front delts, side delts | triceps, traps |
| Push-ups | chest | front delts, triceps, abs |
| Dips | chest, triceps | front delts |
| Incline (Close-Grip) Dumbbell Press | chest, triceps | front delts |
| Dumbbell Lateral Raise | side delts | traps |
| Overhead Dumbbell Extension | triceps | — |
| Dumbbell Goblet Squat (Back) / (Front) | quads, glutes | adductors, abs |
| Dumbbell Bulgarian Split Squat | quads, glutes | adductors, hamstrings |
| Dumbbell Reverse Lunge | quads, glutes | hamstrings, adductors |
| Standing Dumbbell Calf Raise | calves | — |
| Russian Twist / Leg Raise (Floor) | abs, obliques | — |
| Plank | abs | obliques, lower back |
| One-Arm Dumbbell Row | lats, upper back | rear delts, biceps |
| Pull-ups | lats | upper back, biceps, forearms |
| Chin-ups | lats, biceps | upper back, forearms |
| Dumbbell Rear Delt Fly | rear delts | upper back, traps |
| Dumbbell Curl | biceps | forearms |
| Hammer Curl | biceps, forearms | — |
| Dumbbell Shrugs | traps | forearms |
| Dumbbell Romanian Deadlift | hamstrings, glutes | lower back, forearms |
| Single-Leg Romanian Deadlift | hamstrings, glutes | lower back, adductors |
| Dumbbell Swing | glutes, hamstrings | lower back, front delts |
| Dumbbell Glute Bridge | glutes | hamstrings |
| Hanging Leg Raise | abs | obliques, forearms |
| Dumbbell Side Bend | obliques | lower back |

## Ground rules

See `CLAUDE.md` — it governs how I work with you on this project.
