console.log("Fitness Tracker app.js loaded");

const STRENGTH_WEIGHTS = {
  "Upper A": {
    "Dumbbell Bench Press": 0.1,
    "Seated Dumbbell Shoulder Press": 0.2,
    "Push-ups": 0.2,
    "Dips": 0.2,
    "Incline (Close-Grip) Dumbbell Press": 0.15,
    "Dumbbell Lateral Raise": 0.075,
    "Overhead Dumbbell Extension": 0.075,
  },
  "Lower A": {
    "Dumbbell Goblet Squat (Back)": 0.2,
    "Dumbbell Goblet Squat (Front)": 0.2,
    "Dumbbell Bulgarian Split Squat": 0.15,
    "Dumbbell Reverse Lunge": 0.15,
    "Standing Dumbbell Calf Raise": 0.1,
    "Russian Twist / Leg Raise (Floor)": 0.1,
    "Plank": 0.1,
  },
  "Upper B": {
    "One-Arm Dumbbell Row": 0.15,
    "Pull-ups": 0.175,
    "Chin-ups": 0.175,
    "Dumbbell Rear Delt Fly": 0.125,
    "Dumbbell Curl": 0.125,
    "Hammer Curl": 0.125,
    "Dumbbell Shrugs": 0.125,
  },
  "Lower B": {
    "Dumbbell Romanian Deadlift": 0.2,
    "Single-Leg Romanian Deadlift": 0.1,
    "Dumbbell Reverse Lunge": 0.2,
    "Dumbbell Swing": 0.1,
    "Dumbbell Glute Bridge": 0.1,
    "Hanging Leg Raise": 0.2,
    "Dumbbell Side Bend": 0.1,
  },
};

// The muscle groups, by id (also used by the dashboard muscle map) and the
// name shown on screen.
const MUSCLE_NAMES = {
  "chest": "Chest",
  "front-delts": "Front delts",
  "side-delts": "Side delts",
  "rear-delts": "Rear delts",
  "biceps": "Biceps",
  "triceps": "Triceps",
  "forearms": "Forearms",
  "traps": "Traps",
  "lats": "Lats",
  "upper-back": "Upper back",
  "abs": "Abs",
  "obliques": "Obliques",
  "lower-back": "Lower back",
  "glutes": "Glutes",
  "quads": "Quads",
  "hamstrings": "Hamstrings",
  "adductors": "Adductors",
  "calves": "Calves",
};

// Muscles each exercise works, keyed by its original name (so a renamed
// exercise keeps its list). Edit here to change them. Shown in the (i).
const EXERCISE_MUSCLES = {
  "Dumbbell Bench Press": { primary: ["chest"], secondary: ["front-delts", "triceps"] },
  "Seated Dumbbell Shoulder Press": { primary: ["front-delts", "side-delts"], secondary: ["triceps", "traps"] },
  "Push-ups": { primary: ["chest"], secondary: ["front-delts", "triceps", "abs"] },
  "Dips": { primary: ["chest", "triceps"], secondary: ["front-delts"] },
  "Incline (Close-Grip) Dumbbell Press": { primary: ["chest", "triceps"], secondary: ["front-delts"] },
  "Dumbbell Lateral Raise": { primary: ["side-delts"], secondary: ["traps"] },
  "Overhead Dumbbell Extension": { primary: ["triceps"], secondary: [] },
  "Dumbbell Goblet Squat (Back)": { primary: ["quads", "glutes"], secondary: ["adductors", "abs"] },
  "Dumbbell Goblet Squat (Front)": { primary: ["quads", "glutes"], secondary: ["adductors", "abs"] },
  "Dumbbell Bulgarian Split Squat": { primary: ["quads", "glutes"], secondary: ["adductors", "hamstrings"] },
  "Dumbbell Reverse Lunge": { primary: ["quads", "glutes"], secondary: ["hamstrings", "adductors"] },
  "Standing Dumbbell Calf Raise": { primary: ["calves"], secondary: [] },
  "Russian Twist / Leg Raise (Floor)": { primary: ["abs", "obliques"], secondary: [] },
  "Plank": { primary: ["abs"], secondary: ["obliques", "lower-back"] },
  "One-Arm Dumbbell Row": { primary: ["lats", "upper-back"], secondary: ["rear-delts", "biceps"] },
  "Pull-ups": { primary: ["lats"], secondary: ["upper-back", "biceps", "forearms"] },
  "Chin-ups": { primary: ["lats", "biceps"], secondary: ["upper-back", "forearms"] },
  "Dumbbell Rear Delt Fly": { primary: ["rear-delts"], secondary: ["upper-back", "traps"] },
  "Dumbbell Curl": { primary: ["biceps"], secondary: ["forearms"] },
  "Hammer Curl": { primary: ["biceps", "forearms"], secondary: [] },
  "Dumbbell Shrugs": { primary: ["traps"], secondary: ["forearms"] },
  "Dumbbell Romanian Deadlift": { primary: ["hamstrings", "glutes"], secondary: ["lower-back", "forearms"] },
  "Single-Leg Romanian Deadlift": { primary: ["hamstrings", "glutes"], secondary: ["lower-back", "adductors"] },
  "Dumbbell Swing": { primary: ["glutes", "hamstrings"], secondary: ["lower-back", "front-delts"] },
  "Dumbbell Glute Bridge": { primary: ["glutes"], secondary: ["hamstrings"] },
  "Hanging Leg Raise": { primary: ["abs"], secondary: ["obliques", "forearms"] },
  "Dumbbell Side Bend": { primary: ["obliques"], secondary: ["lower-back"] },
};

// e.g. ["chest", "front-delts"] -> "Chest, Front delts"
function muscleList(ids) {
  return ids.map((id) => MUSCLE_NAMES[id]).join(", ");
}

// Exercises done with body weight only — these don't get a weight picker.
const BODYWEIGHT_EXERCISES = [
  "Push-ups",
  "Dips",
  "Pull-ups",
  "Chin-ups",
  "Plank",
  "Russian Twist / Leg Raise (Floor)",
  "Hanging Leg Raise",
];

const DUMBBELL_WEIGHTS = [10, 15, 20, 25, 30];

// Exercises held for time — their 4 boxes are seconds instead of reps
// (still saved in the same "reps" list).
const TIMED_EXERCISES = ["Plank"];

// ---- Settings ----
// The numbers behind the score. Your edits are stored separately from the
// workout log; anything you haven't changed uses these defaults.

const SETTINGS_KEY = "fitnessSettings";

const DEFAULT_SETTINGS = {
  points: { strength: 55, effort: 25, cardio: 15, kcal: 5 },
  restDaysAllowed: 2,
  cardioRestDaysAllowed: 3,
  // [rounds, % of that workout's exercise share earned]. 7 or more = the last row.
  roundsTable: [[0, 0], [1, 51], [2, 62], [3, 71], [4, 79], [5, 87], [6, 94], [7, 100]],
  cardioTarget: 45,
  monthlyRoundsGoal: 24,
  // How many rounds (number boxes) each exercise has in focus mode.
  roundsPerExercise: 4,
  // [number you entered, % of that piece]. In-between values scale smoothly.
  effortTable: [
    [1, 20], [2, 30], [3, 40], [4, 50], [5, 60],
    [6, 70], [7, 80], [8, 90], [9, 95], [10, 100],
  ],
  kcalTable: [[0, 0], [600, 80], [800, 90], [1000, 100]],
  // Each split's exercise weights as %, e.g. { "Upper A": { "Dips": 20, ... } }.
  exerciseWeights: Object.fromEntries(
    Object.entries(STRENGTH_WEIGHTS).map(([split, exercises]) => [
      split,
      Object.fromEntries(
        Object.entries(exercises).map(([name, weight]) => [name, Math.round(weight * 1000) / 10])
      ),
    ])
  ),
  // New names you've given exercises: { "Dips": "Bench Dips" }. Saved
  // workouts always use the original name, so history follows a rename.
  exerciseNames: {},
};

// The name to show for an exercise (its new name, if you renamed it).
function displayName(exerciseName) {
  return settings.exerciseNames[exerciseName] || exerciseName;
}

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    points: { ...DEFAULT_SETTINGS.points, ...saved.points },
    exerciseWeights: { ...DEFAULT_SETTINGS.exerciseWeights, ...saved.exerciseWeights },
  };
}

let settings = loadSettings();

// ---- Color theme ----
// Stored on its own (not part of Settings), so "Reset to defaults" keeps it.
// The colors themselves live in style.css; this just picks which set.

const THEME_KEY = "fitnessTheme";
const THEMES = ["default", "brown-gold"];

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return THEMES.includes(saved) ? saved : "default";
  } catch {
    return "default";
  }
}

function applyTheme(theme) {
  if (theme === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

let currentTheme = loadTheme();
applyTheme(currentTheme);

const workoutEntriesContainer = document.getElementById("workout-entries");
const addWorkoutBtn = document.getElementById("add-workout-btn");

// ---- Weight training: exercise list and focus mode ----
// Each workout box lists its split's exercises as big rows. Tapping one opens
// focus mode: one big box per round, saved the moment its ✓ is tapped. A
// finished exercise goes straight into the day's log (same format as
// always); a half-finished one is kept in a separate draft store until it's
// done, so it never counts early.

const DRAFT_KEY = "fitnessDraft";

// { "2026-10-29": { "Upper B|Pull-ups": { weight: null, reps: [8, 7] } } }
function loadDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {};
  } catch {
    return {};
  }
}

// Saves one half-finished exercise, or removes it when `progress` is null.
function saveDraft(dayKey, split, name, progress) {
  const drafts = loadDrafts();
  const day = drafts[dayKey] || {};
  if (progress) {
    day[`${split}|${name}`] = progress;
  } else {
    delete day[`${split}|${name}`];
  }
  if (Object.keys(day).length > 0) {
    drafts[dayKey] = day;
  } else {
    delete drafts[dayKey];
  }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

// The most recent session of `name` before day `key`, or null.
function lastSession(name, key) {
  const earlier = exerciseSessions(name, "all").filter((session) => session.key < key);
  return earlier.length > 0 ? earlier[earlier.length - 1] : null;
}

// What the (i) button shows. Built on each open so it includes recent saves.
function exerciseInfoHtml(name) {
  const stats = exerciseStats(name);
  const muscles = EXERCISE_MUSCLES[name];
  return `
    <div><strong>Primary:</strong> ${muscleList(muscles.primary)}</div>
    ${muscles.secondary.length > 0 ? `<div><strong>Secondary:</strong> ${muscleList(muscles.secondary)}</div>` : ""}
    <div><strong>Personal best:</strong> ${stats.best}</div>
    <div><strong>Sets this month:</strong> ${stats.setsThisMonth}</div>
  `;
}

// Every workout box with a type chosen: { type, exercises (finished only), effort }.
function collectWorkouts() {
  return [...workoutEntriesContainer.querySelectorAll(".workout-entry")]
    .map((entry) => entry.collect())
    .filter((workout) => workout.type !== "");
}

// Writes the workout boxes into the day's log, keeping the day's other saved
// details. Skipped while the day has nothing saved and nothing finished, so
// an untouched day isn't scored. Returns whether it saved.
function autoSaveWorkouts() {
  const log = loadLog();
  const workouts = collectWorkouts();
  const anyFinished = workouts.some((workout) => workout.exercises.length > 0);
  if (!log[activeDayKey] && !anyFinished) {
    return false;
  }
  log[activeDayKey] = {
    cardio: null,
    cardioSessions: [],
    kcal: null,
    bodyweight: null,
    ...log[activeDayKey],
    workouts,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  renderWeekSummary();
  renderTodayScore();
  return true;
}

// Shows or hides everything on the Today tab except the focused exercise.
function setFocusing(on) {
  document.getElementById("today").classList.toggle("focusing", on);
}

// `saved` is optional: a workout loaded from storage to fill the box back in.
// Returns the box.
function addWorkoutEntry(saved) {
  const entry = document.createElement("div");
  entry.className = "workout-entry";
  const effortOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map((n) => `<option value="${n}">${n}</option>`)
    .join("");
  entry.innerHTML = `
    <select class="workout-type">
      <option value="">Select a workout type...</option>
      <option value="Upper A">Upper A</option>
      <option value="Upper B">Upper B</option>
      <option value="Lower A">Lower A</option>
      <option value="Lower B">Lower B</option>
      <option value="Rest">Rest</option>
    </select>
    <div class="exercise-list"></div>
    <div class="focus-view" hidden></div>
    <div class="rounds-picker" hidden>
      Rounds completed: <strong class="rounds-count">0</strong> of <span class="rounds-total">0</span>
    </div>
    <label class="effort-picker" hidden>
      Perceived effort (1-10)
      <select class="effort-input">
        <option value="">Select...</option>
        ${effortOptions}
      </select>
    </label>
    <button type="button" class="btn btn-small btn-delete">Delete workout</button>
  `;
  const select = entry.querySelector(".workout-type");
  const list = entry.querySelector(".exercise-list");
  const focusView = entry.querySelector(".focus-view");
  const roundsPicker = entry.querySelector(".rounds-picker");
  const effortPicker = entry.querySelector(".effort-picker");
  const effortInput = entry.querySelector(".effort-input");

  // This box's exercises: { "Pull-ups": { weight, reps: [8, 7], done } }.
  // `done` = all rounds in (or loaded from the log).
  let progress = {};
  let currentType = "";
  let focused = null; // the exercise open in focus mode
  let editing = null; // index of a finished round being corrected

  const rounds = () => settings.roundsPerExercise;
  const exerciseNames = () => Object.keys(settings.exerciseWeights[select.value] || {});
  const hasProgress = () => Object.values(progress).some((p) => p.reps.length > 0);

  function statusText(name) {
    const p = progress[name];
    if (!p || p.reps.length === 0) {
      return "Not started";
    }
    if (p.done) {
      return `✓ ${totalReps(p.reps)} ${repUnit(name)}`;
    }
    return `${p.reps.length}/${rounds()}`;
  }

  function renderList() {
    const type = select.value;
    const isWorkout = type !== "" && type !== "Rest";
    roundsPicker.hidden = !isWorkout;
    effortPicker.hidden = !isWorkout;
    if (!isWorkout) {
      list.textContent = type === "Rest" ? "Rest day - no exercises to log." : "";
      return;
    }
    const records = newRecords(activeDayKey);
    list.innerHTML = exerciseNames()
      .map((name) => {
        const p = progress[name];
        const state = p?.done ? "done" : p?.reps.length > 0 ? "in-progress" : "";
        const badge = p?.done && records[name] ? ` <span class="pr-badge" title="${records[name]}">New PR</span>` : "";
        return `
          <button type="button" class="exercise-row ${state}" data-name="${name}">
            <span>${displayName(name)}${badge}</span>
            <span class="exercise-status">${statusText(name)}</span>
          </button>
        `;
      })
      .join("");
    roundsPicker.querySelector(".rounds-count").textContent = exerciseNames().filter((name) => progress[name]?.done).length;
    roundsPicker.querySelector(".rounds-total").textContent = exerciseNames().length;
  }

  // Saves one exercise: into the log once finished, otherwise as a draft.
  function persist(name) {
    const p = progress[name];
    saveDraft(activeDayKey, currentType, name, p.done ? null : { weight: p.weight, reps: p.reps });
    if (p.done) {
      autoSaveWorkouts();
    }
  }

  function openFocus(name) {
    focused = name;
    editing = null;
    if (!progress[name]) {
      const last = lastSession(name, activeDayKey);
      const weight = BODYWEIGHT_EXERCISES.includes(name) ? null : last?.weight ?? null;
      progress[name] = { weight, reps: [], done: false };
    }
    const p = progress[name];
    // The rounds setting may have been lowered since this was started.
    if (!p.done && p.reps.length >= rounds()) {
      p.done = true;
      persist(name);
    }
    entry.classList.add("focused");
    focusView.hidden = false;
    setFocusing(true);
    renderFocus();
    entry.scrollIntoView({ block: "start" });
  }

  // The next exercise after `name` (in list order, wrapping around) that
  // isn't finished, or null when they all are.
  function nextUnfinished(name) {
    const names = exerciseNames();
    const start = names.indexOf(name);
    for (let step = 1; step < names.length; step++) {
      const candidate = names[(start + step) % names.length];
      if (!progress[candidate]?.done) {
        return candidate;
      }
    }
    return null;
  }

  // Shown once all rounds are in: total, a New PR tag (and what it beat),
  // and the way on to the next exercise.
  function finishedHtml(name, unit) {
    const p = progress[name];
    const record = newRecords(activeDayKey)[name];
    const next = nextUnfinished(name);
    return `
      <div class="focus-finished">
        <p class="focus-total">
          Total: <strong>${totalReps(p.reps)} ${unit}</strong>
          ${record ? `<span class="pr-badge">New PR</span>` : ""}
        </p>
        ${record ? `<p class="pr-detail">${record}</p>` : ""}
        ${next
          ? `<button type="button" class="btn btn-main next-btn" data-name="${next}">Next exercise: ${displayName(next)} ›</button>`
          : `<p class="all-done">All exercises in ${currentType} are done.</p>`}
      </div>
    `;
  }

  function closeFocus() {
    focused = null;
    entry.classList.remove("focused");
    focusView.hidden = true;
    setFocusing(false);
    renderList();
  }

  function renderFocus() {
    const name = focused;
    const p = progress[name];
    const last = lastSession(name, activeDayKey);
    const unit = TIMED_EXERCISES.includes(name) ? "seconds" : "reps";

    const inputRow = (i, value) => {
      const lastValue = last?.reps[i];
      return `
        <form class="round-entry" data-round="${i}">
          <label class="round-label" for="round-input">Round ${i + 1} ${unit}</label>
          <input id="round-input" class="round-input" type="text" inputmode="numeric" pattern="[0-9]*"
            autocomplete="off" value="${value}" placeholder="${lastValue != null ? `last: ${lastValue}` : ""}">
          <button type="submit" class="round-check" aria-label="Done with round ${i + 1}">✓</button>
        </form>
      `;
    };
    const finishedRounds = p.reps
      .map((value, i) => (i === editing ? inputRow(i, value) : `
        <button type="button" class="round-done" data-round="${i}">
          <span>Round ${i + 1}</span>
          <strong>${value} ${unit}</strong>
          <span class="round-edit">Edit</span>
        </button>
      `))
      .join("");
    const nextRound = !p.done && editing === null ? inputRow(p.reps.length, "") : "";
    const weightPicker = BODYWEIGHT_EXERCISES.includes(name) ? "" : `
      <label class="focus-weight">Weight (lbs)
        <select class="weight-input">
          <option value="">-</option>
          ${DUMBBELL_WEIGHTS.map((lbs) => `<option value="${lbs}">${lbs}</option>`).join("")}
        </select>
      </label>
    `;

    focusView.innerHTML = `
      <button type="button" class="btn back-btn">‹ Back to list</button>
      <div class="focus-head">
        <h3>${displayName(name)}</h3>
        <button type="button" class="info-btn" title="Exercise info">i</button>
      </div>
      <div class="exercise-info" hidden>${exerciseInfoHtml(name)}</div>
      ${weightPicker}
      <div class="rounds">${finishedRounds}${nextRound}</div>
      ${p.done && editing === null ? finishedHtml(name, unit) : ""}
      <button type="button" class="link-btn clear-btn">Clear this exercise</button>
    `;
    const weightInput = focusView.querySelector(".weight-input");
    if (weightInput) {
      weightInput.value = p.weight ?? "";
    }
    (focusView.querySelector(".round-input") ?? focusView.querySelector(".next-btn"))?.focus();
  }

  // Locks in the round in the box: a new round, or a fix to a finished one.
  function submitRound(form) {
    const p = progress[focused];
    const input = form.querySelector(".round-input");
    const weightInput = focusView.querySelector(".weight-input");
    let ok = true;
    if (!/^\d+$/.test(input.value.trim())) {
      input.classList.add("missing");
      ok = false;
    }
    if (weightInput && weightInput.value === "") {
      weightInput.classList.add("missing");
      ok = false;
    }
    if (!ok) {
      input.focus();
      return;
    }
    p.reps[Number(form.dataset.round)] = Number(input.value.trim());
    if (p.reps.length >= rounds()) {
      p.done = true;
    }
    editing = null;
    persist(focused);
    renderFocus();
  }

  list.addEventListener("click", (event) => {
    const row = event.target.closest(".exercise-row");
    if (row) {
      openFocus(row.dataset.name);
    }
  });

  focusView.addEventListener("click", (event) => {
    if (event.target.closest(".back-btn")) {
      closeFocus();
    } else if (event.target.closest(".next-btn")) {
      openFocus(event.target.closest(".next-btn").dataset.name);
    } else if (event.target.closest(".info-btn")) {
      const infoBox = focusView.querySelector(".exercise-info");
      infoBox.hidden = !infoBox.hidden;
    } else if (event.target.closest(".round-done")) {
      editing = Number(event.target.closest(".round-done").dataset.round);
      renderFocus();
    } else if (event.target.closest(".clear-btn")) {
      if (confirm(`Clear all rounds of ${displayName(focused)}?`)) {
        const wasSaved = progress[focused].done;
        delete progress[focused];
        saveDraft(activeDayKey, currentType, focused, null);
        if (wasSaved) {
          autoSaveWorkouts();
        }
        closeFocus();
      }
    }
  });

  focusView.addEventListener("submit", (event) => {
    event.preventDefault();
    submitRound(event.target);
  });

  focusView.addEventListener("input", (event) => {
    event.target.classList.remove("missing");
  });

  focusView.addEventListener("change", (event) => {
    if (event.target.classList.contains("weight-input")) {
      const p = progress[focused];
      p.weight = event.target.value === "" ? null : Number(event.target.value);
      event.target.classList.remove("missing");
      if (p.reps.length > 0) {
        persist(focused);
      }
    }
  });

  // Changing the split clears this box's rounds (after asking).
  select.addEventListener("change", () => {
    if (hasProgress() && !confirm(`Change to ${select.value || "no workout"}? This clears the rounds logged for ${currentType}.`)) {
      select.value = currentType;
      return;
    }
    Object.keys(progress).forEach((name) => saveDraft(activeDayKey, currentType, name, null));
    progress = {};
    currentType = select.value;
    renderList();
    if (!autoSaveWorkouts()) {
      hasUnsavedChanges = true;
    }
  });

  effortInput.addEventListener("change", () => {
    effortInput.classList.remove("missing");
    if (!autoSaveWorkouts()) {
      hasUnsavedChanges = true;
    }
  });

  entry.querySelector(".btn-delete").addEventListener("click", () => {
    if (hasProgress() && !confirm(`Delete this ${currentType} workout and its logged rounds?`)) {
      return;
    }
    Object.keys(progress).forEach((name) => saveDraft(activeDayKey, currentType, name, null));
    entry.remove();
    saveStatus.textContent = "";
    if (!autoSaveWorkouts()) {
      hasUnsavedChanges = true;
    }
  });

  // What gets saved for this box (finished exercises only).
  entry.collect = () => ({
    type: select.value,
    exercises: exerciseNames()
      .filter((name) => progress[name]?.done)
      .map((name) => ({
        name,
        reps: progress[name].reps,
        weight: BODYWEIGHT_EXERCISES.includes(name) ? null : progress[name].weight,
      })),
    effort: effortInput.value === "" ? null : Number(effortInput.value),
  });

  // Puts a half-finished exercise from the draft store back (choosing this
  // box's split if it has none yet). A finished save wins over a draft.
  entry.resume = (split, name, draft) => {
    if (select.value === "") {
      select.value = split;
      currentType = split;
    }
    if (!progress[name]?.done) {
      progress[name] = { weight: draft.weight, reps: draft.reps, done: false };
    }
    renderList();
  };

  workoutEntriesContainer.appendChild(entry);

  if (saved) {
    select.value = saved.type;
    currentType = saved.type;
    saved.exercises.forEach((exercise) => {
      progress[exercise.name] = { weight: exercise.weight, reps: [...exercise.reps], done: true };
    });
    effortInput.value = saved.effort ?? "";
  }
  renderList();
  return entry;
}

// Puts the day's half-finished exercises back into their workout boxes
// (a box of the same split, else an empty box, else a new one).
function resumeDrafts(key) {
  Object.entries(loadDrafts()[key] || {}).forEach(([id, draft]) => {
    const [split, name] = id.split("|");
    const entries = [...workoutEntriesContainer.querySelectorAll(".workout-entry")];
    const typeOf = (entry) => entry.querySelector(".workout-type").value;
    const entry = entries.find((e) => typeOf(e) === split)
      ?? entries.find((e) => typeOf(e) === "")
      ?? addWorkoutEntry();
    entry.resume(split, name, draft);
  });
}

addWorkoutBtn.addEventListener("click", () => addWorkoutEntry());

// ---- Cardio sessions ----

const CARDIO_TYPES = ["Walk", "Hike", "Run", "Swim", "Kayak"];
const INTENSITY_MULTIPLIERS = { Easy: 1, Moderate: 1.5, Hard: 2 };

const cardioSessionsContainer = document.getElementById("cardio-sessions");
const addCardioBtn = document.getElementById("add-cardio-btn");

// `saved` is optional: a session loaded from storage to fill the fields back in.
function addCardioSession(saved) {
  const session = document.createElement("div");
  session.className = "cardio-session";

  const typeOptions = CARDIO_TYPES.map((type) => `<option value="${type}">${type}</option>`).join("");
  const intensityOptions = Object.keys(INTENSITY_MULTIPLIERS)
    .map((intensity) => `<option value="${intensity}">${intensity}</option>`)
    .join("");
  session.innerHTML = `
    <label class="detail-row">Type
      <select class="cardio-type"><option value="">Select...</option>${typeOptions}</select>
    </label>
    <label class="detail-row">Duration
      <input type="number" class="cardio-minutes" min="1" step="1"> minutes
    </label>
    <label class="detail-row">Intensity
      <select class="cardio-intensity"><option value="">Select...</option>${intensityOptions}</select>
    </label>
    <label class="detail-row">Session kcal (this workout only)
      <input type="number" class="cardio-kcal" min="0" step="1" placeholder="optional">
    </label>
  `;

  // Every session after the first can be deleted ("No" clears the first).
  if (cardioSessionsContainer.children.length > 0) {
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-small btn-delete";
    deleteBtn.textContent = "Delete session";
    deleteBtn.addEventListener("click", () => {
      session.remove();
      saveStatus.textContent = "";
      hasUnsavedChanges = true;
    });
    session.appendChild(deleteBtn);
  }

  if (saved) {
    session.querySelector(".cardio-type").value = saved.type;
    session.querySelector(".cardio-minutes").value = saved.minutes;
    session.querySelector(".cardio-intensity").value = saved.intensity;
    session.querySelector(".cardio-kcal").value = saved.kcal ?? "";
  }

  cardioSessionsContainer.appendChild(session);
}

// "Yes" shows the session fields (starting with one); "No" hides and clears them.
function updateCardioSessions() {
  const didCardio = document.querySelector("input[name=cardio]:checked")?.value === "yes";
  if (!didCardio) {
    cardioSessionsContainer.innerHTML = "";
  } else if (cardioSessionsContainer.children.length === 0) {
    addCardioSession();
  }
  addCardioBtn.hidden = !didCardio;
}

document.querySelectorAll("input[name=cardio]").forEach((radio) => {
  radio.addEventListener("change", updateCardioSessions);
});
addCardioBtn.addEventListener("click", () => addCardioSession());

// ---- Saving ----
// Everything is stored in the browser under one key, as
// { "2026-10-27": { workouts: [{ type, exercises, effort }], cardio, kcal }, ... }

const STORAGE_KEY = "fitnessLog";

const kcalInput = document.getElementById("kcal-input");
const bodyweightInput = document.getElementById("bodyweight-input");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");

// True once something on the Today tab has changed since the last save or
// load. Used to warn before those changes would be lost.
let hasUnsavedChanges = false;

// Asks before throwing away unsaved changes. Returns true if it's OK to go on.
function okToDiscardChanges() {
  return !hasUnsavedChanges || confirm(`You have unsaved changes on ${formatDay(activeDayKey)}. Discard them?`);
}

// Closing or refreshing the page with unsaved changes (on Today or
// Settings): the browser asks first.
window.addEventListener("beforeunload", (event) => {
  if (hasUnsavedChanges || hasUnsavedSettings) {
    event.preventDefault();
    event.returnValue = "";
  }
});

// A date as "YYYY-MM-DD" in your own time zone.
function dateToKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function todayKey() {
  return dateToKey(new Date());
}

// Turns "YYYY-MM-DD" back into a date (midnight, your time zone).
function keyToDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// "YYYY-MM-DD" as e.g. "Mon, Oct 19".
function formatDay(key) {
  return keyToDate(key).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

// The day the Today tab is showing and saving to. Usually today; "Edit day"
// on the Calendar switches it to another date.
let activeDayKey = todayKey();

function loadLog() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// ---- Weekly counters (weeks run Sunday-Saturday) ----

// A rest day = Rest was picked and no strength workout was logged.
function isRestDay(day) {
  const types = day.workouts.map((workout) => workout.type);
  return types.includes("Rest") && types.every((type) => type === "Rest");
}

// Counts saved days from that week's Sunday up to and including `key`.
function weekCounts(key) {
  const log = loadLog();
  const date = keyToDate(key);
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());

  let restDays = 0;
  let noCardioDays = 0;
  for (let d = new Date(sunday); d <= date; d.setDate(d.getDate() + 1)) {
    const day = log[dateToKey(d)];
    if (!day) {
      continue;
    }
    if (isRestDay(day)) {
      restDays += 1;
    }
    if (day.cardio !== "yes") {
      noCardioDays += 1;
    }
  }

  return { sunday, restDays, noCardioDays };
}

// ---- Daily score ----


// Looks up `value` in a table like the ones above, drawing a straight line
// between the two nearest rows. Below the first row or above the last, it
// uses that row's %.
function lookupPercent(table, value) {
  if (value <= table[0][0]) {
    return table[0][1];
  }
  for (let i = 1; i < table.length; i++) {
    const [x2, y2] = table[i];
    if (value <= x2) {
      const [x1, y1] = table[i - 1];
      return y1 + ((value - x1) / (x2 - x1)) * (y2 - y1);
    }
  }
  return table[table.length - 1][1];
}

// Returns the score for a saved day, with each piece's points, or null if
// that day wasn't saved. Rest days within the weekly allowance come back
// with `excluded: true` and no total.
function dayScore(key) {
  const day = loadLog()[key];
  if (!day) {
    return null;
  }

  const { restDays, noCardioDays } = weekCounts(key);
  const kcalPercent = lookupPercent(settings.kcalTable, day.kcal ?? 0);

  if (isRestDay(day)) {
    if (restDays <= settings.restDaysAllowed) {
      return { excluded: true, total: null };
    }
    // Over the rest-day allowance: the whole day is scored on kcal alone.
    return { excluded: false, total: Math.round(kcalPercent * 10) / 10, overRestAllowance: true };
  }

  const strengthWorkouts = day.workouts.filter((workout) => workout.type !== "Rest");

  // Strength: each workout's (checked exercise weights x the rounds table %),
  // added together and capped at 100%.
  let strengthShare = 0;
  strengthWorkouts.forEach((workout) => {
    const weights = settings.exerciseWeights[workout.type];
    const completion = workout.exercises.reduce((sum, exercise) => sum + (weights[exercise.name] ?? 0) / 100, 0);
    const rounds = workout.exercises.length;
    strengthShare += completion * (lookupPercent(settings.roundsTable, rounds) / 100);
  });
  strengthShare = Math.min(strengthShare, 1);

  // Effort: the average of each workout's effort, looked up in the table.
  const efforts = strengthWorkouts.map((workout) => workout.effort).filter((effort) => effort != null);
  let effortPercent = 0;
  if (efforts.length > 0) {
    const averageEffort = efforts.reduce((sum, effort) => sum + effort, 0) / efforts.length;
    effortPercent = lookupPercent(settings.effortTable, averageEffort);
  }

  // Cardio: each session's minutes x intensity, added up; reaching the target
  // earns full marks. A "No" within the weekly cardio rest days is left out
  // of the score (cardio = null); a "No" after them scores 0.
  let cardioShare = 0;
  if (day.cardio === "yes") {
    const sessions = day.cardioSessions || [];
    if (sessions.length === 0) {
      cardioShare = 1; // older saves: "Yes" with no details keeps full marks
    } else {
      const cardioAmount = sessions.reduce(
        (sum, session) => sum + session.minutes * INTENSITY_MULTIPLIERS[session.intensity],
        0
      );
      cardioShare = Math.min(cardioAmount / settings.cardioTarget, 1);
    }
  }
  const cardioLeftOut = day.cardio !== "yes" && noCardioDays <= settings.cardioRestDaysAllowed;

  const pieces = {
    strength: strengthShare * settings.points.strength,
    effort: (effortPercent / 100) * settings.points.effort,
    cardio: cardioLeftOut ? null : cardioShare * settings.points.cardio,
    kcal: (kcalPercent / 100) * settings.points.kcal,
  };

  // Out of 100, or out of what's left when cardio is left out, shown as a %.
  const earned = pieces.strength + pieces.effort + (pieces.cardio ?? 0) + pieces.kcal;
  const possible = 100 - (cardioLeftOut ? settings.points.cardio : 0);
  const total = possible > 0 ? (earned / possible) * 100 : 0;

  // The tiny nudge stops values like 63.74999… (computer rounding error for
  // 63.75) from rounding down.
  return { excluded: false, total: Math.round(total * 10 + 1e-9) / 10, pieces };
}

const weekSummary = document.getElementById("week-summary");

const todayScoreBox = document.getElementById("today-score");

// The score box at the top of the Today tab, based on what's been saved.
function renderTodayScore() {
  const score = dayScore(activeDayKey);
  const round = (n) => Math.round(n * 10) / 10;
  const title = activeDayKey === todayKey() ? "Today's score" : `Score for ${formatDay(activeDayKey)}`;

  if (score === null) {
    todayScoreBox.innerHTML = `<strong>${title}:</strong> save to see the score.`;
    return;
  }
  if (score.excluded) {
    todayScoreBox.innerHTML = `<strong>${title}:</strong> rest day, not scored (within your weekly allowance).`;
    return;
  }
  if (score.overRestAllowance) {
    todayScoreBox.innerHTML = `
      <div class="score-number">${title}: ${score.total}%</div>
      <div class="score-pieces">Rest day over the limit, scored on active kcal only.</div>
    `;
    return;
  }

  const { strength, effort, cardio, kcal } = score.pieces;
  const points = settings.points;
  todayScoreBox.innerHTML = `
    <div class="score-number">${title}: ${score.total}%</div>
    <div class="score-pieces">
      Strength ${round(strength)} / ${points.strength} ·
      Effort ${round(effort)} / ${points.effort} ·
      ${cardio === null ? "Cardio: rest day (not counted)" : `Cardio ${round(cardio)} / ${points.cardio}`} ·
      Active kcal ${round(kcal)} / ${points.kcal}
    </div>
  `;
}

function renderWeekSummary() {
  const { sunday, restDays, noCardioDays } = weekCounts(activeDayKey);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  const format = (d) => d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  weekSummary.innerHTML = `
    <strong>${activeDayKey === todayKey() ? "This week" : "That week"}</strong> (${format(sunday)} – ${format(saturday)})
    <div class="${restDays > settings.restDaysAllowed ? "over" : ""}">
      Weight training rest days: ${restDays} of ${settings.restDaysAllowed} allowed
    </div>
    <div class="${noCardioDays > settings.cardioRestDaysAllowed ? "over" : ""}">
      Cardio rest days: ${noCardioDays} of ${settings.cardioRestDaysAllowed} allowed
    </div>
  `;
}

// Looks through every saved day for one exercise and returns:
// - best: heaviest weight, then most total reps at it (e.g. "36 reps x 30lb");
//   for timed exercises, most total seconds (e.g. "180 sec")
// - setsThisMonth: sets saved for it since the 1st of this month
function exerciseStats(exerciseName) {
  const log = loadLog();
  const thisMonth = todayKey().slice(0, 7); // "YYYY-MM"
  let best = null;
  let setsThisMonth = 0;

  Object.keys(log).forEach((date) => {
    log[date].workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.name !== exerciseName) {
          return;
        }

        if (date.startsWith(thisMonth)) {
          setsThisMonth += exercise.reps.length;
        }

        const totalReps = exercise.reps.reduce((sum, reps) => sum + reps, 0);
        const weight = exercise.weight ?? 0;
        if (
          best === null ||
          weight > best.weight ||
          (weight === best.weight && totalReps > best.reps)
        ) {
          best = { weight, reps: totalReps };
        }
      });
    });
  });

  let bestText = "No record yet";
  if (best !== null) {
    if (TIMED_EXERCISES.includes(exerciseName)) {
      bestText = `${best.reps} sec`;
    } else if (best.weight > 0) {
      bestText = `${best.reps} reps x ${best.weight}lb`;
    } else {
      bestText = `${best.reps} reps`;
    }
  }

  return { best: bestText, setsThisMonth };
}

// Reads everything on the Today tab. Marks anything missing in red.
// Workouts: finished exercises only (half-done ones stay in the draft store).
function collectToday() {
  let allFilled = true;
  const workouts = collectWorkouts();

  workoutEntriesContainer.querySelectorAll(".workout-entry").forEach((entry) => {
    const type = entry.querySelector(".workout-type").value;
    const effortInput = entry.querySelector(".effort-input");
    if (type !== "" && type !== "Rest" && effortInput.value === "") {
      effortInput.classList.add("missing");
      allFilled = false;
    }
  });

  const cardioChoice = document.querySelector("input[name=cardio]:checked");

  // Each cardio session needs a type, whole minutes (1+) and an intensity.
  const cardioSessions = [];
  cardioSessionsContainer.querySelectorAll(".cardio-session").forEach((session) => {
    const typeInput = session.querySelector(".cardio-type");
    const minutesInput = session.querySelector(".cardio-minutes");
    const intensityInput = session.querySelector(".cardio-intensity");
    const kcalValue = session.querySelector(".cardio-kcal").value;
    const minutes = Number(minutesInput.value);

    [typeInput, intensityInput].forEach((input) => {
      if (input.value === "") {
        input.classList.add("missing");
        allFilled = false;
      }
    });
    if (minutesInput.value === "" || !Number.isInteger(minutes) || minutes < 1) {
      minutesInput.classList.add("missing");
      allFilled = false;
    }

    cardioSessions.push({
      type: typeInput.value,
      minutes,
      intensity: intensityInput.value,
      kcal: kcalValue === "" ? null : Number(kcalValue),
    });
  });

  return {
    allFilled,
    day: {
      workouts,
      cardio: cardioChoice ? cardioChoice.value : null,
      cardioSessions,
      kcal: kcalInput.value === "" ? null : Number(kcalInput.value),
      bodyweight: bodyweightInput.value === "" ? null : Number(bodyweightInput.value),
    },
  };
}

saveBtn.addEventListener("click", () => {
  document.querySelectorAll(".missing").forEach((input) => {
    input.classList.remove("missing");
  });

  const { allFilled, day } = collectToday();
  if (!allFilled) {
    saveStatus.textContent = "Not saved: fill in the boxes outlined in red.";
    saveStatus.className = "status error";
    return;
  }

  const log = loadLog();
  log[activeDayKey] = day;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));

  const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  saveStatus.textContent = `Saved at ${time}`;
  hasUnsavedChanges = false;
  saveStatus.className = "status success";
  renderWeekSummary();
  renderTodayScore();
});

// Any edit clears the red outline on that box and the old "Saved" message.
// Workout boxes save themselves (or mark the day unsaved), so they're skipped.
function noteTodayEdit(event) {
  if (event.target.closest(".workout-entry")) {
    return;
  }
  event.target.classList.remove("missing");
  saveStatus.textContent = "";
  hasUnsavedChanges = true;
}
document.getElementById("today").addEventListener("input", noteTodayEdit);
document.getElementById("today").addEventListener("change", noteTodayEdit);

const dayHeading = document.getElementById("day-heading");
const backToTodayBtn = document.getElementById("back-to-today-btn");

// Clears the Today tab and fills it with a saved day (or one empty workout
// box if nothing was saved).
function loadDayIntoForm(key) {
  activeDayKey = key;
  const savedDay = loadLog()[key];

  workoutEntriesContainer.innerHTML = "";
  setFocusing(false);
  cardioSessionsContainer.innerHTML = "";
  document.querySelectorAll("input[name=cardio]").forEach((radio) => {
    radio.checked = false;
  });
  kcalInput.value = "";
  bodyweightInput.value = "";
  saveStatus.textContent = "";

  if (savedDay && savedDay.workouts.length > 0) {
    savedDay.workouts.forEach((workout) => addWorkoutEntry(workout));
  } else {
    addWorkoutEntry();
  }
  resumeDrafts(key);
  if (savedDay) {
    if (savedDay.cardio) {
      document.querySelector(`input[name=cardio][value=${savedDay.cardio}]`).checked = true;
    }
    // Older saves have no session details.
    (savedDay.cardioSessions || []).forEach((session) => addCardioSession(session));
    kcalInput.value = savedDay.kcal ?? "";
    bodyweightInput.value = savedDay.bodyweight ?? "";
  }
  updateCardioSessions();

  const isToday = key === todayKey();
  dayHeading.textContent = isToday ? "Today" : `Editing ${formatDay(key)}`;
  backToTodayBtn.hidden = isToday;
  saveBtn.textContent = isToday ? "Save today" : "Save day";

  renderWeekSummary();
  renderTodayScore();
  hasUnsavedChanges = false;
}

backToTodayBtn.addEventListener("click", () => {
  if (okToDiscardChanges()) {
    loadDayIntoForm(todayKey());
  }
});

// On page open: show today.
loadDayIntoForm(todayKey());

// ---- Settings page ----

// Builds one row per rounds number, effort number and kcal row. These must
// exist before the inputs are collected below.
document.getElementById("rounds-table-rows").innerHTML = DEFAULT_SETTINGS.roundsTable
  .map((row, i) => `
    <label class="setting-row">${row[0]}${i === DEFAULT_SETTINGS.roundsTable.length - 1 ? "+" : ""} rounds
      <span><input type="number" data-setting="roundsTable.${i}.1" min="0" max="100"> %</span>
    </label>
  `)
  .join("");

document.getElementById("effort-table-rows").innerHTML = DEFAULT_SETTINGS.effortTable
  .map((row, i) => `
    <label class="setting-row">Effort ${row[0]}
      <span><input type="number" data-setting="effortTable.${i}.1" min="0" max="100"> %</span>
    </label>
  `)
  .join("");

document.getElementById("kcal-table-rows").innerHTML = DEFAULT_SETTINGS.kcalTable
  .map((row, i) => `
    <div class="setting-row">
      <span><input type="number" class="kcal-amount" data-setting="kcalTable.${i}.0" min="0"> kcal</span>
      <span><input type="number" data-setting="kcalTable.${i}.1" min="0" max="100"> %</span>
    </div>
  `)
  .join("");

// One box per split: a name and a weight (%) for each exercise.
document.getElementById("exercise-settings").innerHTML = Object.entries(DEFAULT_SETTINGS.exerciseWeights)
  .map(([split, exercises]) => `
    <h4>${split}</h4>
    ${Object.keys(exercises)
      .map((name) => `
        <div class="setting-row">
          <input type="text" class="exercise-name" data-exercise="${name}">
          <span><input type="number" class="exercise-weight" data-split="${split}" data-exercise="${name}" min="0" max="100" step="any"> %</span>
        </div>
      `)
      .join("")}
    <p class="split-total" data-split="${split}"></p>
  `)
  .join("");

const exerciseNameInputs = document.querySelectorAll(".exercise-name");
const exerciseWeightInputs = document.querySelectorAll(".exercise-weight");

function updateSplitTotals() {
  let allTotal100 = true;
  document.querySelectorAll(".split-total").forEach((totalLine) => {
    const total = [...exerciseWeightInputs]
      .filter((input) => input.dataset.split === totalLine.dataset.split)
      .reduce((sum, input) => sum + Number(input.value), 0);
    const isTotal100 = Math.abs(total - 100) < 0.001;
    totalLine.textContent = `Total: ${Math.round(total * 100) / 100}% of 100%`;
    totalLine.className = isTotal100 ? "split-total" : "split-total error";
    allTotal100 = allTotal100 && isTotal100;
  });
  return allTotal100;
}

// An exercise in two splits (Dumbbell Reverse Lunge) has two name boxes;
// typing in one copies the name to the other.
exerciseNameInputs.forEach((input) => {
  input.addEventListener("input", () => {
    exerciseNameInputs.forEach((other) => {
      if (other.dataset.exercise === input.dataset.exercise) {
        other.value = input.value;
      }
    });
  });
});

const settingInputs = document.querySelectorAll("[data-setting]");
const pointsTotal = document.getElementById("points-total");
const settingsStatus = document.getElementById("settings-status");

// Each input's data-setting says where its number lives, e.g. "points.effort".
function getSetting(source, path) {
  return path.split(".").reduce((value, part) => value[part], source);
}

function setSetting(target, path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  parts.reduce((value, part) => value[part], target)[last] = value;
}

function fillSettingsForm(values) {
  settingInputs.forEach((input) => {
    input.value = getSetting(values, input.dataset.setting);
  });
  exerciseNameInputs.forEach((input) => {
    input.value = values.exerciseNames[input.dataset.exercise] || input.dataset.exercise;
  });
  exerciseWeightInputs.forEach((input) => {
    input.value = values.exerciseWeights[input.dataset.split][input.dataset.exercise];
  });
  updatePointsTotal();
  updateSplitTotals();
}

function updatePointsTotal() {
  const total = [...settingInputs]
    .filter((input) => input.dataset.setting.startsWith("points."))
    .reduce((sum, input) => sum + Number(input.value), 0);
  pointsTotal.textContent = `Total: ${total} of 100`;
  pointsTotal.className = total === 100 ? "" : "error";
  return total;
}

function saveSettings(values) {
  settings = values;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  renderWeekSummary();
  renderTodayScore();
}

// True once a Settings box has changed since the last save or reset.
let hasUnsavedSettings = false;

document.getElementById("settings").addEventListener("input", (event) => {
  // The theme picker applies (and saves) right away, so it's never "unsaved".
  if (event.target.id === "theme-select") {
    return;
  }
  event.target.classList.remove("missing");
  settingsStatus.textContent = "";
  hasUnsavedSettings = true;
  updatePointsTotal();
  updateSplitTotals();
});

document.getElementById("save-settings-btn").addEventListener("click", () => {
  const values = structuredClone(DEFAULT_SETTINGS);
  let allValid = true;

  settingInputs.forEach((input) => {
    input.classList.remove("missing");
    const number = Number(input.value);
    const min = Number(input.min);
    const max = input.max === "" ? Infinity : Number(input.max);
    if (input.value === "" || !Number.isInteger(number) || number < min || number > max) {
      input.classList.add("missing");
      allValid = false;
    }
    setSetting(values, input.dataset.setting, number);
  });

  if (!allValid) {
    settingsStatus.textContent = "Not saved: fix the boxes outlined in red (whole numbers, within range).";
    settingsStatus.className = "status error";
    return;
  }
  if (updatePointsTotal() !== 100) {
    settingsStatus.textContent = "Not saved: score pieces must add up to 100.";
    settingsStatus.className = "status error";
    return;
  }

  // Each kcal row must be higher than the one above it.
  const kcalAmounts = [...document.querySelectorAll(".kcal-amount")];
  let kcalInOrder = true;
  kcalAmounts.forEach((input, i) => {
    if (i > 0 && Number(input.value) <= Number(kcalAmounts[i - 1].value)) {
      input.classList.add("missing");
      kcalInOrder = false;
    }
  });
  if (!kcalInOrder) {
    settingsStatus.textContent = "Not saved: each kcal amount must be higher than the row above it.";
    settingsStatus.className = "status error";
    return;
  }

  // Exercise weights: any number from 0 to 100, decimals allowed.
  let weightsValid = true;
  exerciseWeightInputs.forEach((input) => {
    const number = Number(input.value);
    if (input.value === "" || number < 0 || number > 100) {
      input.classList.add("missing");
      weightsValid = false;
    }
    values.exerciseWeights[input.dataset.split][input.dataset.exercise] = number;
  });
  if (!weightsValid || !updateSplitTotals()) {
    settingsStatus.textContent = "Not saved: each split's exercise weights must add up to 100%.";
    settingsStatus.className = "status error";
    return;
  }

  // Exercise names: not blank, and no two different exercises sharing a name.
  const nameOwners = {};
  let namesValid = true;
  exerciseNameInputs.forEach((input) => {
    const newName = input.value.trim();
    const owner = nameOwners[newName.toLowerCase()];
    if (newName === "" || (owner && owner !== input.dataset.exercise)) {
      input.classList.add("missing");
      namesValid = false;
    }
    nameOwners[newName.toLowerCase()] = input.dataset.exercise;
    if (newName !== input.dataset.exercise) {
      values.exerciseNames[input.dataset.exercise] = newName;
    }
  });
  if (!namesValid) {
    settingsStatus.textContent = "Not saved: exercise names can't be blank or used twice.";
    settingsStatus.className = "status error";
    return;
  }

  saveSettings(values);
  settingsStatus.textContent = "Settings saved";
  hasUnsavedSettings = false;
  settingsStatus.className = "status success";
});

document.getElementById("reset-settings-btn").addEventListener("click", () => {
  if (!confirm("Reset all settings to their original numbers?")) {
    return;
  }
  saveSettings(structuredClone(DEFAULT_SETTINGS));
  hasUnsavedSettings = false;
  fillSettingsForm(settings);
  settingsStatus.textContent = "Settings reset to defaults";
  settingsStatus.className = "status success";
});

fillSettingsForm(settings);

const themeSelect = document.getElementById("theme-select");
themeSelect.value = currentTheme;
themeSelect.addEventListener("change", () => {
  currentTheme = themeSelect.value;
  applyTheme(currentTheme);
  try {
    localStorage.setItem(THEME_KEY, currentTheme);
  } catch {
    // Couldn't save (e.g. private browsing): the theme still applies until reload.
  }
});

// ---- Calendar ----

const calendarGrid = document.getElementById("calendar-grid");
const calendarTitle = document.getElementById("calendar-title");
const calendarDayDetail = document.getElementById("calendar-day-detail");

// Calendar colors by score: [score, value] rows for hue, saturation and
// lightness, blended smoothly between rows (same idea as the effort table).
// 100 turquoise-green -> 90 green -> 80 yellow-green -> 70 yellow ->
// 60 yellow-orange -> 50 orange-red -> 0 deep red.
const SCORE_HUE = [[0, 0], [49, 4], [50, 16], [60, 38], [70, 56], [80, 80], [90, 125], [100, 165]];
const SCORE_SATURATION = [[0, 75], [49, 80], [50, 85], [60, 90], [70, 90], [80, 70], [90, 55], [100, 65]];
const SCORE_LIGHTNESS = [[0, 30], [49, 50], [50, 54], [60, 55], [70, 52], [80, 47], [90, 42], [100, 40]];

function scoreColor(total) {
  const hue = lookupPercent(SCORE_HUE, total);
  const saturation = lookupPercent(SCORE_SATURATION, total);
  const lightness = lookupPercent(SCORE_LIGHTNESS, total);
  return {
    background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    // Dark text on the bright yellows and light colors; white on the rest.
    text: (hue >= 30 && hue <= 90) || lightness >= 52 ? "#111" : "#fff",
  };
}

// The day you last clicked on the calendar (null = none).
let selectedCalendarKey = null;

// The first day of the month being shown. Starts on the current month.
const calendarMonth = new Date();
calendarMonth.setDate(1);

function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayKey();

  calendarTitle.textContent = calendarMonth.toLocaleDateString([], { month: "long", year: "numeric" });

  const cells = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (name) => `<div class="calendar-heading">${name}</div>`
  );

  // Blank squares before the 1st, so it lines up under the right weekday.
  for (let i = 0; i < calendarMonth.getDay(); i++) {
    cells.push(`<div class="calendar-day empty"></div>`);
  }

  const log = loadLog();

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateToKey(new Date(year, month, day));
    const score = dayScore(key);
    const savedDay = log[key];

    let label = "";
    if (score && score.excluded) {
      label = "Rest";
    } else if (score) {
      label = `${score.total}%`;
    }

    // Small text above: the workout type(s). Below: the cardio type(s).
    let workoutLabel = "";
    let cardioLabel = "";
    if (savedDay) {
      const restDay = isRestDay(savedDay);
      if (restDay && !score.excluded) {
        workoutLabel = "Rest";
      } else if (!restDay) {
        workoutLabel = savedDay.workouts
          .map((workout) => workout.type)
          .filter((type) => type !== "Rest")
          .join(" + ");
      }

      if (savedDay.cardio === "yes") {
        const sessions = savedDay.cardioSessions || [];
        cardioLabel = sessions.length > 0 ? sessions.map((session) => session.type).join(" + ") : "Cardio";
      } else if (restDay) {
        cardioLabel = "(no cardio)";
      }
    }

    const classes = ["calendar-day"];
    if (key === today) {
      classes.push("today");
    }
    if (key === selectedCalendarKey) {
      classes.push("selected");
    }
    let style = "";
    if (score && !score.excluded) {
      const color = scoreColor(score.total);
      style = `background: ${color.background}; color: ${color.text};`;
      classes.push("scored");
    }
    cells.push(`
      <div class="${classes.join(" ")}" data-key="${key}" style="${style}">
        <div class="calendar-date">${day}</div>
        <div class="calendar-small">${workoutLabel}</div>
        <div class="calendar-score">${label}</div>
        <div class="calendar-small">${cardioLabel}</div>
      </div>
    `);
  }

  calendarGrid.innerHTML = cells.join("");
  renderCalendarDayDetail();
}

// The line under the grid for the clicked day, with an "Edit day" button.
function renderCalendarDayDetail() {
  if (selectedCalendarKey === null) {
    calendarDayDetail.innerHTML = "";
    return;
  }

  const score = dayScore(selectedCalendarKey);
  let summary = "Nothing saved";
  if (score && score.excluded) {
    summary = "Rest day (not scored)";
  } else if (score) {
    summary = `${score.total}%`;
  }

  const isFuture = selectedCalendarKey > todayKey();
  calendarDayDetail.innerHTML = `
    <strong>${formatDay(selectedCalendarKey)}:</strong> ${isFuture ? "Future day" : summary}
    ${isFuture ? "" : `<button id="edit-day-btn" class="btn btn-main btn-small" type="button">Edit day</button>`}
  `;

  if (!isFuture) {
    document.getElementById("edit-day-btn").addEventListener("click", () => {
      if (!okToDiscardChanges()) {
        return;
      }
      loadDayIntoForm(selectedCalendarKey);
      document.querySelector('.tab-btn[data-tab="today"]').click();
    });
  }
}

calendarGrid.addEventListener("click", (event) => {
  const dayCell = event.target.closest(".calendar-day[data-key]");
  if (!dayCell) {
    return;
  }
  selectedCalendarKey = dayCell.dataset.key;
  renderCalendar();
});

document.getElementById("calendar-prev").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() - 1);
  renderCalendar();
});
document.getElementById("calendar-next").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + 1);
  renderCalendar();
});

// ---- Dashboard ----

// Averages the scores of saved, scored days among `keys`. Unsaved days and
// rest days within the weekly allowance are skipped.
function averageScore(keys) {
  const totals = keys
    .map((key) => dayScore(key))
    .filter((score) => score !== null && !score.excluded)
    .map((score) => score.total);
  if (totals.length === 0) {
    return null;
  }
  const average = totals.reduce((sum, total) => sum + total, 0) / totals.length;
  return { average: Math.round(average * 10 + 1e-9) / 10, days: totals.length };
}

function averageBox(title, result) {
  const body = result === null
    ? `<div class="stat-note">No scored days yet</div>`
    : `
      <div class="stat-number">${result.average}%</div>
      <div class="stat-note">from ${result.days} scored day${result.days === 1 ? "" : "s"}</div>
    `;
  return `<div class="stat-box"><div class="stat-title">${title}</div>${body}</div>`;
}

// The month the whole Dashboard shows. Starts on the current month; the
// ‹ › arrows at the top change it.
const dashboardMonth = new Date();
dashboardMonth.setDate(1);

// True when the Dashboard is on the current month. "This week" pieces only
// show then, since a past month has no "this week".
function dashboardOnCurrentMonth() {
  return dateToKey(dashboardMonth).slice(0, 7) === todayKey().slice(0, 7);
}

function renderDashboard() {
  const monthKeys = monthKeysFor(dashboardMonth);
  const monthName = dashboardMonth.toLocaleDateString([], { month: "long" });
  document.getElementById("dashboard-month-title").textContent =
    dashboardMonth.toLocaleDateString([], { month: "long", year: "numeric" });

  let weekBox = "";
  if (dashboardOnCurrentMonth()) {
    const weekKeys = weekKeysFor(todayKey());
    const format = (key) => keyToDate(key).toLocaleDateString([], { month: "short", day: "numeric" });
    weekBox = averageBox(`This week (${format(weekKeys[0])} – ${format(weekKeys[6])})`, averageScore(weekKeys));
  }
  document.getElementById("dashboard-averages").innerHTML =
    weekBox + averageBox(monthName, averageScore(monthKeys));

  renderRoundsProgress(monthKeys);
  renderCardioMinutes();
  renderMuscleMap();
  renderMoreStats();
}

document.getElementById("dashboard-month-prev").addEventListener("click", () => {
  dashboardMonth.setMonth(dashboardMonth.getMonth() - 1);
  renderDashboard();
});
document.getElementById("dashboard-month-next").addEventListener("click", () => {
  dashboardMonth.setMonth(dashboardMonth.getMonth() + 1);
  renderDashboard();
});

// Rounds logged in the chosen month for each split, against the monthly goal.
// One round = one exercise checked, same as on the Today tab.
function renderRoundsProgress(monthKeys) {
  const log = loadLog();
  const roundsBySplit = {};
  Object.keys(settings.exerciseWeights).forEach((split) => {
    roundsBySplit[split] = 0;
  });

  monthKeys.forEach((key) => {
    (log[key]?.workouts || []).forEach((workout) => {
      if (workout.type in roundsBySplit) {
        roundsBySplit[workout.type] += workout.exercises.length;
      }
    });
  });

  const goal = settings.monthlyRoundsGoal;
  document.getElementById("dashboard-rounds").innerHTML = Object.entries(roundsBySplit)
    .map(([split, rounds]) => `
      <div class="progress-row">
        <div class="progress-label">
          <span>${split}</span>
          <span>${rounds} / ${goal}${rounds >= goal ? " ✓" : ""}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${Math.min(rounds / goal, 1) * 100}%"></div>
        </div>
      </div>
    `)
    .join("");
}

// Every "YYYY-MM-DD" in the month of `firstOfMonth`.
function monthKeysFor(firstOfMonth) {
  const year = firstOfMonth.getFullYear();
  const month = firstOfMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const keys = [];
  for (let day = 1; day <= daysInMonth; day++) {
    keys.push(dateToKey(new Date(year, month, day)));
  }
  return keys;
}

// Minutes per cardio type in the chosen month. Older saves without session
// details have unknown minutes, so they're left out.
function renderCardioMinutes() {
  const log = loadLog();
  const minutesByType = {};
  CARDIO_TYPES.forEach((type) => {
    minutesByType[type] = 0;
  });

  monthKeysFor(dashboardMonth).forEach((key) => {
    (log[key]?.cardioSessions || []).forEach((session) => {
      minutesByType[session.type] += session.minutes;
    });
  });

  const total = Object.values(minutesByType).reduce((sum, minutes) => sum + minutes, 0);
  document.getElementById("dashboard-cardio").innerHTML =
    Object.entries(minutesByType)
      .map(([type, minutes]) => `<div class="list-row"><span>${type}</span><span>${minutes} min</span></div>`)
      .join("") +
    `<div class="list-row list-total"><span>Total</span><span>${total} min</span></div>`;
}

// ---- Muscle map ----

// Shapes for the figure, drawn on a 200 x 400 grid. Most are drawn for the
// left side and mirrored to the right; `center` shapes are drawn once.
const BODY_OUTLINE = [
  { type: "ellipse", cx: 100, cy: 30, rx: 17, ry: 21, center: true },
  { type: "path", d: "M92,48 L108,48 L109,64 L91,64 Z", center: true },
  { type: "path", d: "M64,64 Q100,56 136,64 L142,96 L134,150 L134,202 L66,202 L66,150 L58,96 Z", center: true },
  { type: "path", d: "M50,70 L66,68 L63,138 L45,138 Z" },
  { type: "path", d: "M45,138 L63,138 L57,200 L45,200 Z" },
  { type: "ellipse", cx: 51, cy: 210, rx: 7, ry: 10 },
  { type: "path", d: "M67,200 L100,200 L99,300 L97,386 L76,386 L71,300 Z" },
  { type: "ellipse", cx: 86, cy: 392, rx: 12, ry: 6 },
];

const FRONT_MUSCLES = [
  { muscle: "traps", d: "M92,58 L76,65 L92,69 Z" },
  { muscle: "side-delts", d: "M60,67 Q49,72 49,93 L57,99 Q57,81 63,69 Z" },
  { muscle: "front-delts", d: "M63,69 Q57,81 57,99 L67,97 Q74,84 75,68 Z" },
  { muscle: "chest", d: "M76,69 L99,72 L99,104 Q86,110 74,100 Q70,85 76,69 Z" },
  { muscle: "biceps", d: "M49,102 Q46,117 50,134 L60,134 Q63,117 60,102 Z" },
  { muscle: "forearms", d: "M47,140 Q42,165 46,196 L55,196 Q61,165 61,140 Z" },
  { muscle: "abs", d: "M88,108 L112,108 L111,182 Q100,190 89,182 Z", center: true },
  { muscle: "obliques", d: "M75,106 L86,110 L87,182 L77,172 Q71,140 75,106 Z" },
  { muscle: "quads", d: "M71,208 Q65,252 74,296 L90,298 Q95,252 93,210 Z" },
  { muscle: "adductors", d: "M94,210 Q96,245 92,272 L99,264 L99,206 Z" },
  { muscle: "calves", d: "M75,316 Q70,345 77,376 L84,376 Q87,345 83,316 Z" },
];

const BACK_MUSCLES = [
  { muscle: "traps", d: "M100,54 L79,67 L91,72 L100,104 L109,72 L121,67 Z", center: true },
  { muscle: "side-delts", d: "M60,67 Q49,72 49,93 L57,99 Q57,81 63,69 Z" },
  { muscle: "rear-delts", d: "M63,69 Q57,81 57,99 L67,97 Q74,84 76,70 Z" },
  { muscle: "upper-back", d: "M80,74 L90,74 L99,106 L99,120 L84,112 Z" },
  { muscle: "lats", d: "M75,84 L84,114 L99,124 L96,152 Q83,142 73,120 Q69,100 75,84 Z" },
  { muscle: "lower-back", d: "M88,142 L99,150 L99,196 L86,196 Z" },
  { muscle: "triceps", d: "M49,102 Q46,117 50,134 L60,134 Q63,117 60,102 Z" },
  { muscle: "forearms", d: "M47,140 Q42,165 46,196 L55,196 Q61,165 61,140 Z" },
  { muscle: "glutes", d: "M70,200 Q68,232 85,236 Q99,234 99,206 Q85,196 70,200 Z" },
  { muscle: "hamstrings", d: "M71,240 Q67,272 75,300 L92,300 Q97,272 93,240 Z" },
  { muscle: "adductors", d: "M94,242 L99,242 L99,282 L95,278 Z" },
  { muscle: "calves", d: "M74,312 Q67,340 77,372 L88,372 Q95,340 90,312 Z" },
];

// Light to dark shades for each color theme, and the color for no work.
const HEAT_PALETTES = {
  "default": { none: "#eeeeee", shades: ["#c4c4c4", "#9a9a9a", "#707070", "#454545", "#111111"] },
  "brown-gold": { none: "#e8e0d0", shades: ["#ffe9a8", "#ffc425", "#c99a2e", "#7a5a2e", "#2f241d"] },
};

function heatPalette() {
  return HEAT_PALETTES[currentTheme];
}

// The most rounds in a week for shades 1-4 (1-4, 5-8, 9-12, 13-16); more
// than the last is shade 5 (17+). A month uses these x 4.
const WEEK_SHADE_LIMITS = [4, 8, 12, 16];
const MONTH_MULTIPLIER = 4;

function shadeLimits() {
  const multiplier = muscleMapShowsWeek() ? 1 : MONTH_MULTIPLIER;
  return WEEK_SHADE_LIMITS.map((limit) => limit * multiplier);
}

// "This week" or "This month" — chosen with the toggle.
let muscleMapPeriod = "week";

// The week view is only offered on the current month; past and future
// months always show the whole month.
function muscleMapShowsWeek() {
  return muscleMapPeriod === "week" && dashboardOnCurrentMonth();
}

// Draws one shape (and its mirror image, unless it's a center shape).
function svgShape(shape, attributes) {
  const element = shape.type === "ellipse"
    ? `<ellipse cx="${shape.cx}" cy="${shape.cy}" rx="${shape.rx}" ry="${shape.ry}" ${attributes}/>`
    : `<path d="${shape.d}" ${attributes}/>`;
  if (shape.center) {
    return element;
  }
  return element + `<g transform="matrix(-1 0 0 1 200 0)">${element}</g>`;
}

function bodySvg(view, muscles) {
  const outline = BODY_OUTLINE.map((shape) => svgShape(shape, `class="body-outline"`)).join("");
  const muscleShapes = muscles
    .map((shape) => `
      <g id="${view}-${shape.muscle}" class="muscle" data-muscle="${shape.muscle}">
        <title></title>
        ${svgShape(shape, "")}
      </g>
    `)
    .join("");
  return `
    <figure class="body-view">
      <svg viewBox="0 0 200 400" role="img" aria-label="${view} view">${outline}${muscleShapes}</svg>
      <figcaption>${view === "front" ? "Front" : "Back"}</figcaption>
    </figure>
  `;
}

// Rounds per muscle over `keys`: each checked exercise is 1 round for its
// primary muscles and half a round for its secondary muscles. Reps aren't used.
function muscleVolume(keys) {
  const log = loadLog();
  const volume = {};
  Object.keys(MUSCLE_NAMES).forEach((id) => {
    volume[id] = { rounds: 0, exercises: {} };
  });

  keys.forEach((key) => {
    (log[key]?.workouts || []).forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const muscles = EXERCISE_MUSCLES[exercise.name];
        if (!muscles) {
          return;
        }
        const credit = (id, share) => {
          volume[id].rounds += share;
          volume[id].exercises[exercise.name] = (volume[id].exercises[exercise.name] || 0) + share;
        };
        muscles.primary.forEach((id) => credit(id, 1));
        muscles.secondary.forEach((id) => credit(id, 0.5));
      });
    });
  });

  return volume;
}

// Every "YYYY-MM-DD" from Sunday to Saturday of the week containing `key`.
function weekKeysFor(key) {
  const { sunday } = weekCounts(key);
  const keys = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    keys.push(dateToKey(day));
  }
  return keys;
}

function heatColor(rounds) {
  if (rounds <= 0) {
    return heatPalette().none;
  }
  const level = shadeLimits().filter((limit) => rounds > limit).length;
  return heatPalette().shades[level];
}

// Each shade's range for the legend, e.g. ["1-4", "5-8", ..., "17+"].
function shadeRanges() {
  const limits = shadeLimits();
  return heatPalette().shades.map((color, i) =>
    i < limits.length ? `${i === 0 ? 1 : limits[i - 1] + 1}–${limits[i]}` : `${limits[i - 1] + 1}+`
  );
}

// e.g. 2.5 -> "2.5 rounds", 1 -> "1 round"
function roundsText(rounds) {
  return `${rounds} round${rounds === 1 ? "" : "s"}`;
}

function muscleDetailText(id, volume) {
  const { rounds, exercises } = volume[id];
  if (rounds === 0) {
    return `<strong>${MUSCLE_NAMES[id]}:</strong> no work in this period.`;
  }
  const contributors = Object.entries(exercises)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => `${displayName(name)} (${amount})`)
    .join(", ");
  return `<strong>${MUSCLE_NAMES[id]}: ${roundsText(rounds)}</strong> — ${contributors}`;
}

function renderMuscleMap() {
  const isWeek = muscleMapShowsWeek();
  const keys = isWeek ? weekKeysFor(todayKey()) : monthKeysFor(dashboardMonth);

  document.getElementById("muscle-period-toggle").hidden = !dashboardOnCurrentMonth();
  document.querySelectorAll(".period-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.period === muscleMapPeriod);
  });
  const format = (key) => keyToDate(key).toLocaleDateString([], { month: "short", day: "numeric" });
  document.getElementById("muscle-period-label").textContent = isWeek
    ? `This week (${format(keys[0])} – ${format(keys[6])})`
    : "";

  const volume = muscleVolume(keys);

  const figure = document.getElementById("muscle-figure");
  figure.innerHTML = bodySvg("front", FRONT_MUSCLES) + bodySvg("back", BACK_MUSCLES);
  figure.querySelectorAll(".muscle").forEach((group) => {
    const id = group.dataset.muscle;
    group.querySelectorAll("path").forEach((path) => {
      path.setAttribute("fill", heatColor(volume[id].rounds));
    });
    group.classList.toggle("no-work", volume[id].rounds === 0);
    group.querySelector("title").textContent = `${MUSCLE_NAMES[id]}: ${roundsText(volume[id].rounds)}`;
    const showDetail = () => {
      document.getElementById("muscle-detail").innerHTML = muscleDetailText(id, volume);
    };
    group.addEventListener("click", showDetail);
    group.addEventListener("mouseenter", showDetail);
  });

  document.getElementById("muscle-detail").textContent = "Tap or hover a muscle for details.";

  const ranges = shadeRanges();
  document.getElementById("muscle-legend").innerHTML = `
    <span class="legend-item"><span class="legend-swatch" style="background: ${heatPalette().none}"></span>0</span>
    ${heatPalette().shades.map((color, i) => `
      <span class="legend-item"><span class="legend-swatch" style="background: ${color}"></span>${ranges[i]}</span>
    `).join("")}
    <span>rounds</span>
  `;

  document.getElementById("muscle-list").innerHTML = Object.keys(MUSCLE_NAMES)
    .sort((a, b) => volume[b].rounds - volume[a].rounds)
    .map((id) => `
      <div class="list-row">
        <span><span class="legend-swatch" style="background: ${heatColor(volume[id].rounds)}"></span> ${MUSCLE_NAMES[id]}</span>
        <span>${roundsText(volume[id].rounds)}</span>
      </div>
    `)
    .join("");
}

document.querySelectorAll(".period-btn").forEach((button) => {
  button.addEventListener("click", () => {
    muscleMapPeriod = button.dataset.period;
    renderMuscleMap();
  });
});

// ---- More stats ----
// One stat at a time, picked from the dropdown. Each stat in MORE_STATS has
// a `calculate(range)` that only works out numbers (or returns null when
// there isn't enough data) and a `draw(data)` that only shows them. To add a
// stat, add a calculation, then an entry to MORE_STATS.

// Chart colors for each color theme. Grid lines and text use the theme's
// CSS colors, read when a chart is drawn.
// `series` colors are for charts with several groups, darkest first.
const CHART_PALETTES = {
  "default": {
    line: "#222222",
    fill: "rgba(34, 34, 34, 0.1)",
    series: ["#111111", "#454545", "#707070", "#9a9a9a", "#c4c4c4", "#e2e2e2"],
  },
  "brown-gold": {
    line: "#2f241d",
    fill: "rgba(255, 196, 37, 0.35)",
    series: ["#2f241d", "#7a5a2e", "#c99a2e", "#ffc425", "#ffe08a", "#e6d9be"],
  },
};

// The chosen time range: "4w", "3m", "6m" or "all".
let statRange = "4w";

// The first "YYYY-MM-DD" in the range, or null for all time.
function rangeStartKey(range) {
  const start = new Date();
  if (range === "4w") {
    start.setDate(start.getDate() - 27);
  } else if (range === "3m") {
    start.setMonth(start.getMonth() - 3);
    start.setDate(start.getDate() + 1);
  } else if (range === "6m") {
    start.setMonth(start.getMonth() - 6);
    start.setDate(start.getDate() + 1);
  } else {
    return null;
  }
  return dateToKey(start);
}

// Saved days in the range, oldest first. Days after today are left out.
function savedKeysInRange(range) {
  const start = rangeStartKey(range);
  const today = todayKey();
  return Object.keys(loadLog())
    .filter((key) => key <= today && (start === null || key >= start))
    .sort();
}

// e.g. "2026-10-14" -> "Oct 14"
function shortDate(key) {
  return keyToDate(key).toLocaleDateString([], { month: "short", day: "numeric" });
}

// ---- Stat calculations (numbers only, no drawing) ----

// Each scored day in the range: { labels: ["Oct 14", ...], values: [82.5, ...] }.
function dayScoreSeries(range) {
  const points = savedKeysInRange(range)
    .map((key) => ({ key, score: dayScore(key) }))
    .filter(({ score }) => score !== null && !score.excluded);
  if (points.length < 2) {
    return null;
  }
  return {
    labels: points.map(({ key }) => shortDate(key)),
    values: points.map(({ score }) => score.total),
  };
}

// Each weigh-in in the range as a dot, plus a 7-day rolling average line:
// the average of the weigh-ins from that day and the 6 days before it.
function bodyweightSeries(range) {
  const log = loadLog();
  const keys = savedKeysInRange(range).filter((key) => log[key].bodyweight != null);
  if (keys.length < 2) {
    return null;
  }
  const weighIns = keys.map((key) => log[key].bodyweight);
  const averages = keys.map((key) => {
    const weekBefore = keyToDate(key);
    weekBefore.setDate(weekBefore.getDate() - 6);
    const recent = keys
      .map((other, i) => ({ other, weight: weighIns[i] }))
      .filter(({ other }) => other >= dateToKey(weekBefore) && other <= key)
      .map(({ weight }) => weight);
    return Math.round((recent.reduce((sum, weight) => sum + weight, 0) / recent.length) * 10) / 10;
  });
  return {
    labels: keys.map(shortDate),
    series: [
      { label: "7-day average", values: averages },
      { label: "Weigh-in", values: weighIns, dotsOnly: true },
    ],
  };
}

// Every exercise in the program, once each (some are in two splits).
function allExercises() {
  return [...new Set(Object.values(STRENGTH_WEIGHTS).flatMap((split) => Object.keys(split)))];
}

// Every time `name` was done in the range, oldest first:
// [{ key: "2026-10-14", reps: [15, 13, 12, 10], weight: 30 or null }, ...]
function exerciseSessions(name, range) {
  const log = loadLog();
  const sessions = [];
  savedKeysInRange(range).forEach((key) => {
    (log[key].workouts || []).forEach((workout) => {
      workout.exercises
        .filter((exercise) => exercise.name === name)
        .forEach((exercise) => sessions.push({ key, reps: exercise.reps, weight: exercise.weight }));
    });
  });
  return sessions;
}

// Epley formula: about the most you could lift once, from `reps` at `weight`.
function estimatedOneRepMax(weight, reps) {
  return weight * (1 + reps / 30);
}

// How a set is measured for `name`: estimated 1-rep max for dumbbell
// exercises, reps for bodyweight ones, seconds for Plank.
function setMeasure(name) {
  if (TIMED_EXERCISES.includes(name)) {
    return { yTitle: "Longest hold (seconds)", value: (weight, reps) => reps };
  }
  if (BODYWEIGHT_EXERCISES.includes(name)) {
    return { yTitle: "Most reps in one set", value: (weight, reps) => reps };
  }
  return { yTitle: "Estimated 1-rep max (lb)", value: estimatedOneRepMax };
}

// The best set of each day `name` was done, measured as above.
function strengthProgressSeries(range, name) {
  const measure = setMeasure(name);
  const bestByDay = {};
  exerciseSessions(name, range).forEach(({ key, reps, weight }) => {
    reps.forEach((setReps) => {
      const value = Math.round(measure.value(weight, setReps) * 10) / 10;
      bestByDay[key] = Math.max(bestByDay[key] ?? 0, value);
    });
  });
  const keys = Object.keys(bestByDay).sort();
  if (keys.length < 2) {
    return null;
  }
  return {
    labels: keys.map(shortDate),
    values: keys.map((key) => bestByDay[key]),
    yTitle: measure.yTitle,
  };
}

// Whole days from `key` to today (0 = today).
function daysAgo(key) {
  return Math.round((keyToDate(todayKey()) - keyToDate(key)) / 86400000);
}

// e.g. "today", "1 day ago", "3 weeks ago", "2 months ago"
function timeAgo(key) {
  const days = daysAgo(key);
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;
  if (days === 0) {
    return "today";
  }
  if (days < 14) {
    return plural(days, "day");
  }
  if (days < 60) {
    return plural(Math.floor(days / 7), "week");
  }
  return plural(Math.floor(days / 30), "month");
}

// Each exercise's best set in the range (measured as above; the earliest
// date wins a tie), as table rows.
function personalRecords(range) {
  const rows = [];
  allExercises().forEach((name) => {
    const measure = setMeasure(name);
    let best = null;
    exerciseSessions(name, range).forEach(({ key, reps, weight }) => {
      reps.forEach((setReps) => {
        const value = measure.value(weight, setReps);
        if (best === null || value > best.value) {
          best = { key, value, setReps, weight };
        }
      });
    });
    if (best === null) {
      return;
    }
    let setText = `${best.setReps} reps`;
    if (TIMED_EXERCISES.includes(name)) {
      setText = `${best.setReps} sec`;
    } else if (best.weight !== null) {
      setText = `${best.setReps} reps @ ${best.weight} lb (est. 1-rep max ${Math.round(best.value)} lb)`;
    }
    rows.push([displayName(name), setText, shortDate(best.key), timeAgo(best.key)]);
  });
  if (rows.length === 0) {
    return null;
  }
  return { headers: ["Exercise", "Best set", "Date", "How long ago"], rows };
}

// Each day's average perceived effort (1-10) over its sessions.
function effortSeries(range) {
  const log = loadLog();
  const points = [];
  savedKeysInRange(range).forEach((key) => {
    const efforts = (log[key].workouts || [])
      .filter((workout) => workout.type !== "Rest" && workout.effort != null)
      .map((workout) => workout.effort);
    if (efforts.length > 0) {
      const average = efforts.reduce((sum, effort) => sum + effort, 0) / efforts.length;
      points.push({ key, average: Math.round(average * 10) / 10 });
    }
  });
  if (points.length < 2) {
    return null;
  }
  return {
    labels: points.map(({ key }) => shortDate(key)),
    values: points.map(({ average }) => average),
  };
}

// The six body areas the weekly volume charts group muscles into.
const BODY_AREAS = {
  "Chest": ["chest"],
  "Shoulders": ["front-delts", "side-delts", "rear-delts"],
  "Arms": ["biceps", "triceps", "forearms"],
  "Back": ["traps", "lats", "upper-back", "lower-back"],
  "Core": ["abs", "obliques"],
  "Legs": ["glutes", "quads", "hamstrings", "adductors", "calves"],
};

// How much an exercise counts for each muscle: 1 for primary, ½ for
// secondary (same as the muscle map). { "chest": 1, "triceps": 0.5, ... }
function muscleCredit(name) {
  const muscles = EXERCISE_MUSCLES[name];
  const credit = {};
  if (muscles) {
    muscles.secondary.forEach((id) => { credit[id] = 0.5; });
    muscles.primary.forEach((id) => { credit[id] = 1; });
  }
  return credit;
}

// How much an exercise counts for each body area: its best muscle credit in
// that area, so an exercise counts at most once per area.
function areaCredit(name) {
  const credit = muscleCredit(name);
  const areas = {};
  Object.entries(BODY_AREAS).forEach(([area, ids]) => {
    const best = Math.max(0, ...ids.map((id) => credit[id] ?? 0));
    if (best > 0) {
      areas[area] = best;
    }
  });
  return areas;
}

// Every exercise done in the range: [{ key, split, name, reps, weight }, ...]
function exercisesInRange(range) {
  const log = loadLog();
  const done = [];
  savedKeysInRange(range).forEach((key) => {
    (log[key].workouts || []).forEach((workout) => {
      workout.exercises.forEach((exercise) => done.push({ key, split: workout.type, ...exercise }));
    });
  });
  return done;
}

// The Sunday ("YYYY-MM-DD") of every week from the start of the range (or
// the first saved day, for all time) through this week.
function weekStartsInRange(range) {
  const keys = savedKeysInRange(range);
  if (keys.length === 0) {
    return [];
  }
  const day = weekCounts(rangeStartKey(range) ?? keys[0]).sunday;
  const lastSunday = dateToKey(weekCounts(todayKey()).sunday);
  const sundays = [];
  while (dateToKey(day) <= lastSunday) {
    sundays.push(dateToKey(day));
    day.setDate(day.getDate() + 7);
  }
  return sundays;
}

// Weekly totals per body area. `amount(exercise)` is how much one exercise
// adds (its sets or reps), or null to leave it out.
// { labels: ["Oct 5", ...], series: [{ label: "Chest", values: [...] }, ...] }
function weeklyAreaVolume(range, amount) {
  const sundays = weekStartsInRange(range);
  const totals = {};
  Object.keys(BODY_AREAS).forEach((area) => {
    totals[area] = sundays.map(() => 0);
  });
  let any = false;
  exercisesInRange(range).forEach((exercise) => {
    const value = amount(exercise);
    if (value === null) {
      return;
    }
    const week = sundays.indexOf(dateToKey(weekCounts(exercise.key).sunday));
    Object.entries(areaCredit(exercise.name)).forEach(([area, share]) => {
      totals[area][week] += value * share;
      any = true;
    });
  });
  if (!any) {
    return null;
  }
  return {
    labels: sundays.map(shortDate),
    series: Object.entries(totals).map(([area, values]) => ({ label: area, values })),
  };
}

function weeklySetsByArea(range) {
  return weeklyAreaVolume(range, (exercise) => exercise.reps.length);
}

// Plank is in seconds, not reps, so it's left out.
function weeklyRepsByArea(range) {
  return weeklyAreaVolume(range, (exercise) =>
    TIMED_EXERCISES.includes(exercise.name) ? null : exercise.reps.reduce((sum, reps) => sum + reps, 0)
  );
}

// Every muscle's sets in the range (primary 1, secondary ½), most first.
// [{ name: "Chest", value: "24 sets" }, ...]
function musclesRanked(range) {
  const sets = {};
  Object.keys(MUSCLE_NAMES).forEach((id) => { sets[id] = 0; });
  const done = exercisesInRange(range);
  if (done.length === 0) {
    return null;
  }
  done.forEach((exercise) => {
    Object.entries(muscleCredit(exercise.name)).forEach(([id, share]) => {
      sets[id] += exercise.reps.length * share;
    });
  });
  return Object.keys(MUSCLE_NAMES)
    .sort((a, b) => sets[b] - sets[a])
    .map((id) => ({ name: MUSCLE_NAMES[id], value: `${sets[id]} set${sets[id] === 1 ? "" : "s"}` }));
}

// Share of all sets done in Upper vs Lower sessions, as %.
function upperLowerBalance(range) {
  const sets = { Upper: 0, Lower: 0 };
  exercisesInRange(range).forEach((exercise) => {
    const side = exercise.split.startsWith("Upper") ? "Upper" : "Lower";
    sets[side] += exercise.reps.length;
  });
  const total = sets.Upper + sets.Lower;
  if (total === 0) {
    return null;
  }
  return {
    labels: Object.entries(sets).map(([side, count]) => `${side} (${count} sets)`),
    values: Object.values(sets).map((count) => Math.round((count / total) * 1000) / 10),
  };
}

// A workout day has at least one session that isn't Rest.
function isWorkoutDay(day) {
  return (day.workouts || []).some((workout) => workout.type !== "Rest");
}

// Workout days in each week of `sundays` (from weekStartsInRange).
function workoutDaysPerWeek(sundays) {
  const log = loadLog();
  return sundays.map((sunday) =>
    weekKeysFor(sunday).filter((key) => log[key] && isWorkoutDay(log[key])).length
  );
}

function workoutsPerWeek(range) {
  const sundays = weekStartsInRange(range);
  if (sundays.length === 0) {
    return null;
  }
  return { labels: sundays.map(shortDate), values: workoutDaysPerWeek(sundays) };
}

// Every day from the start of the range's first week through this week, in
// weeks: [{ sunday, days: [{ key, score (null = no score), future }] }].
function trainingCalendar(range) {
  const sundays = weekStartsInRange(range);
  const today = todayKey();
  let anyScore = false;
  const weeks = sundays.map((sunday) => ({
    sunday,
    days: weekKeysFor(sunday).map((key) => {
      const score = key <= today ? dayScore(key) : null;
      const total = score && !score.excluded ? score.total : null;
      anyScore = anyScore || total !== null;
      return { key, score: total, future: key > today };
    }),
  }));
  return anyScore ? weeks : null;
}

const STREAK_TARGET = 3;

// Weeks in a row with at least STREAK_TARGET workout days, over all your
// history (not the time range). This week only counts once it reaches the
// target, and doesn't break the streak while it's still going.
function streaks() {
  const sundays = weekStartsInRange("all");
  if (sundays.length === 0) {
    return null;
  }
  const counts = workoutDaysPerWeek(sundays);
  const hit = counts.map((count) => count >= STREAK_TARGET);

  let longest = 0;
  let run = 0;
  hit.forEach((ok) => {
    run = ok ? run + 1 : 0;
    longest = Math.max(longest, run);
  });

  let current = 0;
  let i = hit.length - 1;
  if (!hit[i]) {
    i -= 1; // this week isn't done yet
  }
  while (i >= 0 && hit[i]) {
    current += 1;
    i -= 1;
  }
  return { current, longest, thisWeek: counts[counts.length - 1] };
}

// Sessions of each split in the range.
function splitFrequency(range) {
  const counts = {};
  Object.keys(STRENGTH_WEIGHTS).forEach((split) => { counts[split] = 0; });
  const log = loadLog();
  savedKeysInRange(range).forEach((key) => {
    (log[key].workouts || []).forEach((workout) => {
      if (workout.type in counts) {
        counts[workout.type] += 1;
      }
    });
  });
  if (Object.values(counts).every((count) => count === 0)) {
    return null;
  }
  return { labels: Object.keys(counts), values: Object.values(counts) };
}

// Every cardio session in the range: [{ key, type, minutes, intensity }, ...].
// Older saves without session details are left out (minutes unknown).
function cardioSessionsInRange(range) {
  const log = loadLog();
  return savedKeysInRange(range).flatMap((key) =>
    (log[key].cardioSessions || []).map((session) => ({ key, ...session }))
  );
}

// Minutes per cardio type in each month of the range.
// { labels: ["Sep 2026", ...], series: [{ label: "Walk", values: [...] }, ...] }
function cardioMinutesByMonth(range) {
  const sessions = cardioSessionsInRange(range);
  if (sessions.length === 0) {
    return null;
  }
  // "YYYY-MM" for each month from the range's first month to this one.
  const first = keyToDate(rangeStartKey(range) ?? savedKeysInRange(range)[0]);
  first.setDate(1);
  const thisMonth = todayKey().slice(0, 7);
  const months = [];
  while (dateToKey(first).slice(0, 7) <= thisMonth) {
    months.push(dateToKey(first).slice(0, 7));
    first.setMonth(first.getMonth() + 1);
  }

  const minutes = {};
  CARDIO_TYPES.forEach((type) => { minutes[type] = months.map(() => 0); });
  sessions.forEach((session) => {
    minutes[session.type][months.indexOf(session.key.slice(0, 7))] += session.minutes;
  });
  return {
    labels: months.map((month) => keyToDate(`${month}-01`).toLocaleDateString([], { month: "short", year: "numeric" })),
    series: CARDIO_TYPES.map((type) => ({ label: type, values: minutes[type] })),
  };
}

// Share of cardio minutes at each intensity, as %.
function intensityMix(range) {
  const minutes = {};
  Object.keys(INTENSITY_MULTIPLIERS).forEach((intensity) => { minutes[intensity] = 0; });
  cardioSessionsInRange(range).forEach((session) => {
    minutes[session.intensity] += session.minutes;
  });
  const total = Object.values(minutes).reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    return null;
  }
  return {
    labels: Object.entries(minutes).map(([intensity, value]) => `${intensity} (${value} min)`),
    values: Object.values(minutes).map((value) => Math.round((value / total) * 1000) / 10),
  };
}

// ---- Reps ----
// Dumbbell exercises are only compared at the same weight, so a lighter day
// never counts as a fake record. Plank is in seconds.

function repUnit(name) {
  return TIMED_EXERCISES.includes(name) ? "sec" : "reps";
}

// e.g. 30 -> " @ 30 lb"; bodyweight (null) -> ""
function atWeight(weight) {
  return weight === null ? "" : ` @ ${weight} lb`;
}

function totalReps(reps) {
  return reps.reduce((sum, value) => sum + value, 0);
}

// Best session (highest total) and best single set for `name` at each weight
// it was done, heaviest first. The earliest date wins a tie.
// [{ weight, session: { key, reps, total }, set: { key, value } }, ...]
function repRecords(name, range) {
  const byWeight = {};
  exerciseSessions(name, range).forEach(({ key, reps, weight }) => {
    const record = byWeight[weight] ?? (byWeight[weight] = { weight, session: null, set: null });
    const total = totalReps(reps);
    if (record.session === null || total > record.session.total) {
      record.session = { key, reps, total };
    }
    const most = Math.max(...reps);
    if (record.set === null || most > record.set.value) {
      record.set = { key, value: most };
    }
  });
  return Object.values(byWeight).sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
}

// The best session for one exercise (one row per weight), with each set.
function bestSessionTable(range, name) {
  const records = repRecords(name, range);
  if (records.length === 0) {
    return null;
  }
  const byWeight = records.some((record) => record.weight !== null);
  const rows = records.map(({ weight, session }) => {
    const sets = `${session.reps.join(" + ")} = <strong>${session.total} ${repUnit(name)}</strong>`;
    return byWeight ? [`${weight} lb`, shortDate(session.key), sets] : [shortDate(session.key), sets];
  });
  return { headers: byWeight ? ["Weight", "Date", "Sets"] : ["Date", "Sets"], rows };
}

// Each session's total for one exercise; one line per weight, each with its
// best session marked. Days without that weight are gaps.
function totalRepsSeries(range, name) {
  const sessions = exerciseSessions(name, range);
  if (sessions.length < 2) {
    return null;
  }
  const keys = [...new Set(sessions.map((session) => session.key))];
  const weights = [...new Set(sessions.map((session) => session.weight))].sort((a, b) => (b ?? 0) - (a ?? 0));
  const unit = TIMED_EXERCISES.includes(name) ? "seconds" : "reps";
  const series = weights.map((weight) => {
    const values = keys.map((key) => {
      const totals = sessions
        .filter((session) => session.key === key && session.weight === weight)
        .map((session) => totalReps(session.reps));
      return totals.length > 0 ? Math.max(...totals) : null;
    });
    const best = values.indexOf(Math.max(...values.filter((value) => value !== null)));
    return { label: weight === null ? `Total ${unit}` : `${weight} lb`, values, best };
  });
  return { labels: keys.map(shortDate), series, yTitle: `Total ${unit} per session` };
}

// Every exercise's most reps (or seconds) in one set, per weight.
function bestSingleSetTable(range) {
  const rows = allExercises().flatMap((name) =>
    repRecords(name, range).map(({ weight, set }) => [
      displayName(name) + atWeight(weight),
      `${set.value} ${repUnit(name)}`,
      shortDate(set.key),
    ])
  );
  if (rows.length === 0) {
    return null;
  }
  return { headers: ["Exercise", "Best set", "Date"], rows };
}

// Every exercise's best session and best set, per weight, with when the
// newer of the two happened. Rows with a PR in the last 7 days are highlighted.
function repPrTable(range) {
  const rows = [];
  const highlight = [];
  allExercises().forEach((name) => {
    repRecords(name, range).forEach(({ weight, session, set }) => {
      const unit = repUnit(name);
      const latest = session.key > set.key ? session.key : set.key;
      if (daysAgo(latest) < 7) {
        highlight.push(rows.length);
      }
      rows.push([
        displayName(name) + atWeight(weight),
        `${session.total} ${unit} (${shortDate(session.key)})`,
        `${set.value} ${unit} (${shortDate(set.key)})`,
        `${shortDate(latest)} · ${timeAgo(latest)}`,
      ]);
    });
  });
  if (rows.length === 0) {
    return null;
  }
  return { headers: ["Exercise", "Best session", "Best set", "Latest PR"], rows, highlight };
}

// Exercises on day `key` that beat every earlier day at the same weight, by
// session total or best single set. The first time at a weight isn't a PR
// (nothing to beat). { "Dips": "52 reps total (was 50)", ... }
function newRecords(key) {
  const day = loadLog()[key];
  const records = {};
  (day?.workouts || []).forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const earlier = exerciseSessions(exercise.name, "all")
        .filter((session) => session.key < key && session.weight === exercise.weight);
      if (earlier.length === 0) {
        return;
      }
      const unit = repUnit(exercise.name);
      const total = totalReps(exercise.reps);
      const bestTotal = Math.max(...earlier.map((session) => totalReps(session.reps)));
      const set = Math.max(...exercise.reps);
      const bestSet = Math.max(...earlier.flatMap((session) => session.reps));
      const beaten = [];
      if (total > bestTotal) {
        beaten.push(`${total} ${unit} total (was ${bestTotal})`);
      }
      if (set > bestSet) {
        beaten.push(`${set} ${unit} in one set (was ${bestSet})`);
      }
      if (beaten.length > 0) {
        const weight = exercise.weight === null ? "" : `@ ${exercise.weight} lb: `;
        records[exercise.name] = weight + beaten.join(", ");
      }
    });
  });
  return records;
}

// Set 1 vs the last set in each session of one exercise, plus the average
// drop-off. A shrinking gap means better endurance.
function setDropOff(range, name) {
  const sessions = exerciseSessions(name, range);
  if (sessions.length < 2) {
    return null;
  }
  const first = sessions.map((session) => session.reps[0]);
  const last = sessions.map((session) => session.reps[session.reps.length - 1]);
  const average = (values) => Math.round((totalReps(values) / values.length) * 10) / 10;
  const firstAverage = average(first);
  const lastAverage = average(last);
  const dropOff = firstAverage > 0 ? Math.round((1 - lastAverage / firstAverage) * 100) : 0;
  const unit = repUnit(name);
  return {
    labels: sessions.map((session) => shortDate(session.key) + atWeight(session.weight)),
    series: [
      { label: "Set 1", values: first },
      { label: "Last set", values: last },
    ],
    yTitle: TIMED_EXERCISES.includes(name) ? "Seconds" : "Reps",
    note: `Average in this range: set 1 ${firstAverage} ${unit}, last set ${lastAverage} ${unit} (${dropOff}% drop-off).`,
  };
}

// ---- Stat drawing (charts only, no calculations) ----

let statChart = null;

// Removes the current chart (Chart.js needs this before reusing the space).
function clearStatChart() {
  if (statChart) {
    statChart.destroy();
    statChart = null;
  }
}

// Shared look for every chart: theme colors and labeled axes.
function chartOptions(xTitle, yTitle, extraY = {}) {
  const css = getComputedStyle(document.documentElement);
  const text = css.getPropertyValue("--text-muted").trim();
  const grid = css.getPropertyValue("--border").trim();
  const axis = (title) => ({
    title: { display: true, text: title, color: text },
    ticks: { color: text },
    grid: { color: grid },
  });
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: axis(xTitle), y: { ...axis(yTitle), ...extraY } },
  };
}

// Turns on the color key under a chart, in the theme's text color.
function showLegend(chartSettings) {
  const css = getComputedStyle(document.documentElement);
  chartSettings.plugins.legend = {
    display: true,
    position: "bottom",
    labels: { color: css.getPropertyValue("--text-muted").trim(), boxWidth: 12 },
  };
}

// A line chart in a fresh canvas. `data`: { labels, values } for one line, or
// { labels, series: [{ label, values, best }] } for several (with a color
// key). `best` is the index of a point drawn as a bigger diamond;
// `dotsOnly: true` draws points with no line; missing values are null. An
// optional `data.note` is shown under the chart.
// `options`: { xTitle, yTitle, yMin, yMax, autoY } — `autoY` lets the side
// axis fit the data instead of starting at 0.
function drawLineChart(data, options) {
  const palette = CHART_PALETTES[currentTheme];
  const series = data.series || [{ label: options.yTitle, values: data.values }];
  const single = series.length === 1;
  const step = colorStep(palette.series.length, series.length);
  const yRange = options.autoY ? {} : { min: options.yMin ?? 0, max: options.yMax };
  const chartSettings = chartOptions(options.xTitle, options.yTitle, yRange);
  if (data.series) {
    showLegend(chartSettings);
  }

  document.getElementById("stat-body").innerHTML = `
    <div class="stat-chart"><canvas></canvas></div>
    ${data.note ? `<p class="stat-note">${data.note}</p>` : ""}
  `;
  statChart = new Chart(document.querySelector("#stat-body canvas"), {
    type: "line",
    data: {
      labels: data.labels,
      datasets: series.map((s, i) => {
        const color = single ? palette.line : palette.series[i * step];
        const isBest = (j) => j === s.best;
        return {
          label: s.label,
          data: s.values,
          borderColor: color,
          backgroundColor: single ? palette.fill : color,
          pointBackgroundColor: color,
          pointStyle: s.values.map((_, j) => (isBest(j) ? "rectRot" : "circle")),
          pointRadius: s.values.map((_, j) => (isBest(j) ? 8 : s.dotsOnly ? 4 : 3)),
          showLine: !s.dotsOnly,
          fill: single,
          spanGaps: true,
          tension: 0.2,
        };
      }),
    },
    options: chartSettings,
  });
}

// How far apart in the palette each bar's color is, so `bars` bars get
// distinct colors: 2 bars -> every 3rd color, 3 bars -> every 2nd.
function colorStep(colors, bars) {
  return bars > 1 ? Math.min(3, Math.floor((colors - 1) / (bars - 1))) : 0;
}

// A bar chart in a fresh canvas. `data`: { labels, series: [{ label, values }] }
// (several series are stacked with a legend) or { labels, values } (one bar
// per label). `options`: { xTitle, yTitle, yMax, colorEachBar }.
function drawBarChart(data, options) {
  const palette = CHART_PALETTES[currentTheme];
  const series = data.series || [{ label: options.yTitle, values: data.values }];
  const stacked = series.length > 1;
  const chartSettings = chartOptions(options.xTitle, options.yTitle, { min: 0, max: options.yMax, stacked });
  chartSettings.scales.x.stacked = stacked;
  if (stacked) {
    showLegend(chartSettings);
  }

  document.getElementById("stat-body").innerHTML = `<div class="stat-chart"><canvas></canvas></div>`;
  statChart = new Chart(document.querySelector("#stat-body canvas"), {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: series.map((s, i) => ({
        label: s.label,
        data: s.values,
        // Several series: one color each. One series: the main color, or
        // well-spaced colors per bar with `colorEachBar`.
        backgroundColor: stacked
          ? palette.series[i]
          : options.colorEachBar
            ? s.values.map((_, j) => palette.series[j * colorStep(palette.series.length, s.values.length)])
            : palette.line,
        borderColor: palette.line,
        borderWidth: 1,
      })),
    },
    options: chartSettings,
  });
}

// A numbered list: [{ name, value }, ...], first = rank 1.
function drawRankedList(items) {
  document.getElementById("stat-body").innerHTML = items
    .map((item, i) => `<div class="list-row"><span>${i + 1}. ${item.name}</span><span>${item.value}</span></div>`)
    .join("");
}

// Weeks as columns, Sunday-Saturday as rows, each day colored by its score
// (the Calendar tab's colors). A month name sits over each month's first week
// (skipped if it would crowd the one before). Opens scrolled to the latest week.
function drawTrainingCalendar(weeks) {
  const dayLetters = ["", "S", "M", "T", "W", "T", "F", "S"];
  let lastLabel = -3;
  const monthLabels = weeks
    .map((week, i) => {
      const month = keyToDate(week.sunday).toLocaleDateString([], { month: "short" });
      const previous = i > 0 ? keyToDate(weeks[i - 1].sunday).toLocaleDateString([], { month: "short" }) : null;
      if (month === previous || i - lastLabel < 3) {
        return "<span></span>";
      }
      lastLabel = i;
      return `<span>${month}</span>`;
    })
    .join("");
  const cells = weeks
    .flatMap((week) => week.days)
    .map((day) => {
      if (day.future) {
        return `<span class="heat-cell future"></span>`;
      }
      if (day.score === null) {
        return `<span class="heat-cell" title="${shortDate(day.key)}: no score"></span>`;
      }
      return `<span class="heat-cell" style="background: ${scoreColor(day.score).background}" title="${shortDate(day.key)}: ${day.score}%"></span>`;
    })
    .join("");
  const legendStops = [0, 50, 70, 90, 100]
    .map((score) => `<span class="heat-cell" style="background: ${scoreColor(score).background}" title="${score}%"></span>`)
    .join("");

  document.getElementById("stat-body").innerHTML = `
    <div class="heatmap">
      <div class="heatmap-days">${dayLetters.map((letter) => `<span>${letter}</span>`).join("")}</div>
      <div class="heatmap-scroll">
        <div class="heatmap-months" style="grid-template-columns: repeat(${weeks.length}, 14px)">${monthLabels}</div>
        <div class="heatmap-grid">${cells}</div>
      </div>
    </div>
    <div class="heatmap-legend">
      <span class="heat-cell"></span> no score
      <span class="heatmap-scale">0% ${legendStops} 100%</span>
    </div>
  `;
  const scroller = document.querySelector("#stat-body .heatmap-scroll");
  scroller.scrollLeft = scroller.scrollWidth;
}

// Two boxes: current and longest streak, plus this week's progress.
function drawStreaks(data) {
  const weeks = (n) => `${n} week${n === 1 ? "" : "s"}`;
  document.getElementById("stat-body").innerHTML = `
    <div class="stat-row">
      <div class="stat-box"><div class="stat-title">Current streak</div><div class="stat-number">${weeks(data.current)}</div></div>
      <div class="stat-box"><div class="stat-title">Longest streak</div><div class="stat-number">${weeks(data.longest)}</div></div>
    </div>
    <p class="stat-note">This week so far: ${data.thisWeek} of ${STREAK_TARGET} workout days.</p>
  `;
}

// A plain table: { headers: [...], rows: [[...], ...] }. Rows whose index is
// in the optional `highlight` list are highlighted.
function drawTable(data) {
  const highlight = data.highlight || [];
  document.getElementById("stat-body").innerHTML = `
    <table class="stat-table">
      <thead><tr>${data.headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
      <tbody>
        ${data.rows
          .map((row, i) => `<tr${highlight.includes(i) ? ` class="highlight"` : ""}>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>
  `;
}

// ---- The list of stats ----
// `chart: true` means it needs Chart.js (tables and lists don't).
// `pickExercise: true` shows the exercise dropdown; `calculate` then gets
// the chosen exercise as a second input.

const MORE_STATS = [
  {
    id: "bodyweight",
    group: "Body",
    title: "Bodyweight trend",
    explain: "Dots are your weigh-ins; the line is the 7-day rolling average, which smooths out day-to-day swings.",
    chart: true,
    calculate: bodyweightSeries,
    draw: (data) => drawLineChart(data, { xTitle: "Day", yTitle: "Bodyweight (lb)", autoY: true }),
  },
  {
    id: "day-score",
    group: "Strength",
    title: "Day score over time",
    explain: "Your score (out of 100) for each saved day; rest days within the allowance are left out.",
    chart: true,
    calculate: dayScoreSeries,
    draw: (data) => drawLineChart(data, { xTitle: "Day", yTitle: "Score (%)", yMax: 100 }),
  },
  {
    id: "strength-progress",
    group: "Strength",
    title: "Strength progress",
    explain: "Your best set each session: estimated 1-rep max (weight × (1 + reps ÷ 30)), or most reps / longest hold for bodyweight exercises.",
    chart: true,
    pickExercise: true,
    calculate: strengthProgressSeries,
    draw: (data) => drawLineChart(data, { xTitle: "Session", yTitle: data.yTitle }),
  },
  {
    id: "personal-records",
    group: "Strength",
    title: "Personal records",
    explain: "Each exercise's best set in this time range, ranked the same way as Strength progress.",
    calculate: personalRecords,
    draw: drawTable,
  },
  {
    id: "effort",
    group: "Strength",
    title: "Perceived effort over time",
    explain: "How hard each day's sessions felt (1-10), averaged when you did more than one.",
    chart: true,
    calculate: effortSeries,
    draw: (data) => drawLineChart(data, { xTitle: "Day", yTitle: "Effort (1-10)", yMin: 1, yMax: 10 }),
  },
  {
    id: "weekly-sets",
    group: "Volume",
    title: "Weekly sets per body area",
    explain: "Sets each week (Sun–Sat): full credit for an exercise's main muscles' area, half for supporting ones.",
    chart: true,
    calculate: weeklySetsByArea,
    draw: (data) => drawBarChart(data, { xTitle: "Week starting", yTitle: "Sets" }),
  },
  {
    id: "weekly-reps",
    group: "Volume",
    title: "Weekly reps per body area",
    explain: "Reps each week, credited the same way as sets. Plank (seconds) is left out.",
    chart: true,
    calculate: weeklyRepsByArea,
    draw: (data) => drawBarChart(data, { xTitle: "Week starting", yTitle: "Reps" }),
  },
  {
    id: "muscles-ranked",
    group: "Volume",
    title: "Most to least trained muscles",
    explain: "Every muscle's sets in this time range — 1 per set for main muscles, ½ for supporting ones.",
    calculate: musclesRanked,
    draw: drawRankedList,
  },
  {
    id: "upper-lower",
    group: "Volume",
    title: "Upper vs Lower balance",
    explain: "The share of all your sets done in Upper (A/B) sessions versus Lower (A/B) sessions.",
    chart: true,
    calculate: upperLowerBalance,
    draw: (data) => drawBarChart(data, { xTitle: "Session type", yTitle: "Share of sets (%)", yMax: 100, colorEachBar: true }),
  },
  {
    id: "workouts-per-week",
    group: "Consistency",
    title: "Workouts per week",
    explain: "Days each week (Sun–Sat) with at least one weight-training session.",
    chart: true,
    calculate: workoutsPerWeek,
    draw: (data) => drawBarChart(data, { xTitle: "Week starting", yTitle: "Workout days", yMax: 7 }),
  },
  {
    id: "training-calendar",
    group: "Consistency",
    title: "Training calendar",
    explain: "Each square is a day, colored by its score like the Calendar tab; gray means no score.",
    calculate: trainingCalendar,
    draw: drawTrainingCalendar,
  },
  {
    id: "streaks",
    group: "Consistency",
    title: "Streaks",
    explain: `Weeks in a row with ${STREAK_TARGET}+ workout days, over all your history (the time range doesn't apply).`,
    calculate: streaks,
    draw: drawStreaks,
  },
  {
    id: "split-frequency",
    group: "Consistency",
    title: "Split frequency",
    explain: "How many sessions of each split you did in this time range.",
    chart: true,
    calculate: splitFrequency,
    draw: (data) => drawBarChart(data, { xTitle: "Split", yTitle: "Sessions" }),
  },
  {
    id: "cardio-by-month",
    group: "Cardio",
    title: "Cardio minutes per month",
    explain: "Minutes of each cardio type per month (the first month only counts days inside the time range).",
    chart: true,
    calculate: cardioMinutesByMonth,
    draw: (data) => drawBarChart(data, { xTitle: "Month", yTitle: "Minutes" }),
  },
  {
    id: "intensity-mix",
    group: "Cardio",
    title: "Intensity mix",
    explain: "The share of your cardio minutes that were Easy, Moderate and Hard.",
    chart: true,
    calculate: intensityMix,
    draw: (data) => drawBarChart(data, { xTitle: "Intensity", yTitle: "Share of minutes (%)", yMax: 100, colorEachBar: true }),
  },
  {
    id: "best-session",
    group: "Reps",
    title: "Best session",
    explain: "The session with the most total reps (seconds for Plank). Dumbbell exercises show the best at each weight.",
    pickExercise: true,
    calculate: bestSessionTable,
    draw: drawTable,
  },
  {
    id: "total-reps",
    group: "Reps",
    title: "Total reps per session",
    explain: "All sets added up, each session. One line per dumbbell weight; the big diamond is the best session.",
    chart: true,
    pickExercise: true,
    calculate: totalRepsSeries,
    draw: (data) => drawLineChart(data, { xTitle: "Session", yTitle: data.yTitle }),
  },
  {
    id: "best-set",
    group: "Reps",
    title: "Best single set",
    explain: "The most reps (seconds for Plank) in one set, for each exercise and dumbbell weight.",
    calculate: bestSingleSetTable,
    draw: drawTable,
  },
  {
    id: "rep-prs",
    group: "Reps",
    title: "Rep PR table",
    explain: "Best session total and best single set per exercise and weight. Highlighted rows: a PR in the last 7 days.",
    calculate: repPrTable,
    draw: drawTable,
  },
  {
    id: "drop-off",
    group: "Reps",
    title: "Set 1 vs last set",
    explain: "Reps in your first and last set each session. A shrinking gap means your endurance is improving.",
    chart: true,
    pickExercise: true,
    calculate: setDropOff,
    draw: (data) => drawLineChart(data, { xTitle: "Session", yTitle: data.yTitle }),
  },
];

// Fills the dropdown with each group's stats.
const statSelect = document.getElementById("stat-select");
const statGroups = [...new Set(MORE_STATS.map((stat) => stat.group))];
statSelect.innerHTML = statGroups
  .map((group) => `
    <optgroup label="${group}">
      ${MORE_STATS.filter((stat) => stat.group === group)
        .map((stat) => `<option value="${stat.id}">${stat.title}</option>`)
        .join("")}
    </optgroup>
  `)
  .join("");

const statExercise = document.getElementById("stat-exercise");
const moreStatsBox = document.getElementById("more-stats");

// Draws the chosen stat. Skipped while the box is closed (charts can't be
// sized while hidden); opening the box draws it.
function renderMoreStats() {
  if (!moreStatsBox.open) {
    return;
  }
  clearStatChart();

  const stat = MORE_STATS.find((s) => s.id === statSelect.value);
  document.querySelectorAll("#stat-range .period-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.range === statRange);
  });

  // Rebuilt each time so renamed exercises show their new names.
  const chosenExercise = statExercise.value || allExercises()[0];
  statExercise.innerHTML = allExercises()
    .map((name) => `<option value="${name}">${displayName(name)}</option>`)
    .join("");
  statExercise.value = chosenExercise;
  statExercise.hidden = !stat.pickExercise;

  document.getElementById("stat-title").textContent = stat.pickExercise
    ? `${stat.title}: ${displayName(chosenExercise)}`
    : stat.title;
  document.getElementById("stat-explain").textContent = stat.explain;

  const body = document.getElementById("stat-body");
  if (stat.chart && typeof Chart === "undefined") {
    body.innerHTML = `<p class="stat-message">Charts need an internet connection. Connect and reopen the Dashboard.</p>`;
    return;
  }
  const data = stat.calculate(statRange, chosenExercise);
  if (data === null) {
    body.innerHTML = `<p class="stat-message">Not enough data yet — keep logging and check back soon.</p>`;
    return;
  }
  stat.draw(data);
}

moreStatsBox.addEventListener("toggle", renderMoreStats);
statSelect.addEventListener("change", renderMoreStats);
statExercise.addEventListener("change", renderMoreStats);
document.querySelectorAll("#stat-range .period-btn").forEach((button) => {
  button.addEventListener("click", () => {
    statRange = button.dataset.range;
    renderMoreStats();
  });
});

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    tabPanels.forEach((panel) => {
      panel.hidden = panel.id !== targetTab;
    });

    // Redrawn each time it's opened, so it shows the latest saves and settings.
    if (targetTab === "calendar") {
      renderCalendar();
    }
    if (targetTab === "dashboard") {
      renderDashboard();
    }
  });
});
