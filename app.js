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

// `saved` is optional: a workout loaded from storage to fill the box back in.
function addWorkoutEntry(saved) {
  const entry = document.createElement("div");
  entry.className = "workout-entry";

  const select = document.createElement("select");
  select.className = "workout-type";
  select.innerHTML = `
    <option value="">Select a workout type...</option>
    <option value="Upper A">Upper A</option>
    <option value="Upper B">Upper B</option>
    <option value="Lower A">Lower A</option>
    <option value="Lower B">Lower B</option>
    <option value="Rest">Rest</option>
  `;

  const checklist = document.createElement("div");
  checklist.className = "exercise-checklist";

  const roundsPicker = document.createElement("div");
  roundsPicker.className = "rounds-picker";
  roundsPicker.hidden = true;
  // Rounds = how many exercises are checked, counted automatically.
  roundsPicker.innerHTML = `
    Rounds completed: <strong class="rounds-count">0</strong> of 7
  `;

  const effortPicker = document.createElement("label");
  effortPicker.className = "effort-picker";
  effortPicker.hidden = true;
  const effortOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map((n) => `<option value="${n}">${n}</option>`)
    .join("");
  effortPicker.innerHTML = `
    Perceived effort (1-10)
    <select class="effort-input">
      <option value="">Select...</option>
      ${effortOptions}
    </select>
  `;

  function updateRoundsCount() {
    const checkedCount = checklist.querySelectorAll("input[type=checkbox]:checked").length;
    roundsPicker.querySelector(".rounds-count").textContent = checkedCount;
  }

  select.addEventListener("change", () => {
    const selectedType = select.value;

    checklist.innerHTML = "";
    updateRoundsCount();

    if (selectedType === "") {
      roundsPicker.hidden = true;
      effortPicker.hidden = true;
      return;
    }

    if (selectedType === "Rest") {
      checklist.textContent = "Rest day - no exercises to log.";
      roundsPicker.hidden = true;
      effortPicker.hidden = true;
      return;
    }

    const exercises = settings.exerciseWeights[selectedType];
    Object.keys(exercises).forEach((exerciseName) => {
      const item = document.createElement("div");
      item.className = "checklist-item";

      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = exerciseName;
      label.appendChild(checkbox);
      label.append(" " + displayName(exerciseName));

      const detail = document.createElement("span");
      detail.className = "exercise-detail";
      detail.hidden = true;
      const unit = TIMED_EXERCISES.includes(exerciseName) ? "Seconds" : "Reps";
      const repsBoxes = [1, 2, 3, 4]
        .map((set) => `<input type="number" class="reps-input" min="0" placeholder="${set}" title="Set ${set} ${unit.toLowerCase()}">`)
        .join("");
      detail.innerHTML = `
        <label>${unit} ${repsBoxes}</label>
      `;

      if (!BODYWEIGHT_EXERCISES.includes(exerciseName)) {
        const weightOptions = DUMBBELL_WEIGHTS
          .map((lbs) => `<option value="${lbs}">${lbs}</option>`)
          .join("");
        detail.innerHTML += `
          <label>Weight (lbs)
            <select class="weight-input">
              <option value="">-</option>
              ${weightOptions}
            </select>
          </label>
        `;
      }

      checkbox.addEventListener("change", () => {
        updateRoundsCount();
        detail.hidden = !checkbox.checked;
        if (!checkbox.checked) {
          detail.querySelectorAll(".reps-input").forEach((input) => {
            input.value = "";
          });
          const weightInput = detail.querySelector(".weight-input");
          if (weightInput) {
            weightInput.value = "";
          }
        }
      });

      const infoBtn = document.createElement("button");
      infoBtn.type = "button";
      infoBtn.className = "info-btn";
      infoBtn.textContent = "i";
      infoBtn.title = "Exercise info";

      const infoBox = document.createElement("div");
      infoBox.className = "exercise-info";
      infoBox.hidden = true;

      infoBtn.addEventListener("click", () => {
        const wasOpen = !infoBox.hidden;
        document.querySelectorAll(".exercise-info").forEach((box) => {
          box.hidden = true;
        });
        if (!wasOpen) {
          // Rebuilt on every open so it includes anything just saved.
          const stats = exerciseStats(exerciseName);
          const muscles = EXERCISE_MUSCLES[exerciseName];
          infoBox.innerHTML = `
            <div><strong>Primary:</strong> ${muscleList(muscles.primary)}</div>
            ${muscles.secondary.length > 0 ? `<div><strong>Secondary:</strong> ${muscleList(muscles.secondary)}</div>` : ""}
            <div><strong>Personal best:</strong> ${stats.best}</div>
            <div><strong>Sets this month:</strong> ${stats.setsThisMonth}</div>
          `;
        }
        infoBox.hidden = wasOpen;
      });

      item.appendChild(label);
      item.appendChild(infoBtn);
      item.appendChild(detail);
      item.appendChild(infoBox);
      checklist.appendChild(item);
    });

    roundsPicker.hidden = false;
    effortPicker.hidden = false;
  });

  entry.appendChild(select);
  entry.appendChild(checklist);
  entry.appendChild(roundsPicker);
  entry.appendChild(effortPicker);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-small btn-delete";
  deleteBtn.textContent = "Delete workout";
  deleteBtn.addEventListener("click", () => {
    entry.remove();
    saveStatus.textContent = "";
    hasUnsavedChanges = true;
  });
  entry.appendChild(deleteBtn);

  workoutEntriesContainer.appendChild(entry);

  if (saved) {
    select.value = saved.type;
    select.dispatchEvent(new Event("change"));

    saved.exercises.forEach((exercise) => {
      const checkbox = checklist.querySelector(`input[value="${exercise.name}"]`);
      if (!checkbox) {
        return;
      }
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change"));

      const item = checkbox.closest(".checklist-item");
      item.querySelectorAll(".reps-input").forEach((input, i) => {
        input.value = exercise.reps[i];
      });
      const weightInput = item.querySelector(".weight-input");
      if (weightInput && exercise.weight !== null) {
        weightInput.value = exercise.weight;
      }
    });

    effortPicker.querySelector(".effort-input").value = saved.effort ?? "";
  }
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

// Reads everything on the Today tab. Marks any missing reps/weight in red.
function collectToday() {
  let allFilled = true;
  const workouts = [];

  workoutEntriesContainer.querySelectorAll(".workout-entry").forEach((entry) => {
    const type = entry.querySelector(".workout-type").value;
    if (type === "") {
      return;
    }

    const exercises = [];
    entry.querySelectorAll(".checklist-item").forEach((item) => {
      const checkbox = item.querySelector("input[type=checkbox]");
      if (!checkbox.checked) {
        return;
      }

      const repsInputs = [...item.querySelectorAll(".reps-input")];
      const weightInput = item.querySelector(".weight-input");
      [...repsInputs, weightInput].forEach((input) => {
        if (input && input.value === "") {
          input.classList.add("missing");
          allFilled = false;
        }
      });

      exercises.push({
        name: checkbox.value,
        reps: repsInputs.map((input) => Number(input.value)),
        weight: weightInput ? Number(weightInput.value) : null,
      });
    });

    const effortInput = entry.querySelector(".effort-input");
    const effortValue = effortInput.value;
    if (type !== "Rest" && effortValue === "") {
      effortInput.classList.add("missing");
      allFilled = false;
    }
    workouts.push({
      type,
      exercises,
      effort: effortValue === "" ? null : Number(effortValue),
    });
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
document.getElementById("today").addEventListener("input", (event) => {
  event.target.classList.remove("missing");
  saveStatus.textContent = "";
  hasUnsavedChanges = true;
});
document.getElementById("today").addEventListener("change", (event) => {
  event.target.classList.remove("missing");
  saveStatus.textContent = "";
  hasUnsavedChanges = true;
});

const dayHeading = document.getElementById("day-heading");
const backToTodayBtn = document.getElementById("back-to-today-btn");

// Clears the Today tab and fills it with a saved day (or one empty workout
// box if nothing was saved).
function loadDayIntoForm(key) {
  activeDayKey = key;
  const savedDay = loadLog()[key];

  workoutEntriesContainer.innerHTML = "";
  cardioSessionsContainer.innerHTML = "";
  document.querySelectorAll("input[name=cardio]").forEach((radio) => {
    radio.checked = false;
  });
  kcalInput.value = "";
  saveStatus.textContent = "";

  if (savedDay && savedDay.workouts.length > 0) {
    savedDay.workouts.forEach((workout) => addWorkoutEntry(workout));
  } else {
    addWorkoutEntry();
  }
  if (savedDay) {
    if (savedDay.cardio) {
      document.querySelector(`input[name=cardio][value=${savedDay.cardio}]`).checked = true;
    }
    // Older saves have no session details.
    (savedDay.cardioSessions || []).forEach((session) => addCardioSession(session));
    kcalInput.value = savedDay.kcal ?? "";
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

function renderDashboard() {
  const today = new Date();

  // This week: Sunday through Saturday.
  const { sunday } = weekCounts(todayKey());
  const weekKeys = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    weekKeys.push(dateToKey(day));
  }
  const saturday = keyToDate(weekKeys[6]);
  const format = (d) => d.toLocaleDateString([], { month: "short", day: "numeric" });

  // This month: the 1st through the last day.
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthKeys = [];
  for (let day = 1; day <= daysInMonth; day++) {
    monthKeys.push(dateToKey(new Date(today.getFullYear(), today.getMonth(), day)));
  }
  const monthName = today.toLocaleDateString([], { month: "long" });

  document.getElementById("dashboard-averages").innerHTML =
    averageBox(`This week (${format(sunday)} – ${format(saturday)})`, averageScore(weekKeys)) +
    averageBox(`This month (${monthName})`, averageScore(monthKeys));

  renderRoundsProgress(monthKeys, monthName);
  renderCardioMinutes();
  renderMuscleMap();
}

// Rounds logged this month for each split, against the monthly goal.
// One round = one exercise checked, same as on the Today tab.
function renderRoundsProgress(monthKeys, monthName) {
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
  document.getElementById("rounds-title").textContent = `Rounds this month (${monthName})`;
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

// The month the Dashboard's month-by-month sections show (cardio minutes).
// Starts on the current month; the ‹ › arrows change it.
const dashboardMonth = new Date();
dashboardMonth.setDate(1);

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
  document.getElementById("cardio-month-title").textContent =
    dashboardMonth.toLocaleDateString([], { month: "long", year: "numeric" });
  document.getElementById("dashboard-cardio").innerHTML =
    Object.entries(minutesByType)
      .map(([type, minutes]) => `<div class="list-row"><span>${type}</span><span>${minutes} min</span></div>`)
      .join("") +
    `<div class="list-row list-total"><span>Total</span><span>${total} min</span></div>`;
}

// Moves the shared Dashboard month (cardio minutes and muscle map).
function changeDashboardMonth(step) {
  dashboardMonth.setMonth(dashboardMonth.getMonth() + step);
  renderCardioMinutes();
  renderMuscleMap();
}

document.getElementById("cardio-month-prev").addEventListener("click", () => changeDashboardMonth(-1));
document.getElementById("cardio-month-next").addEventListener("click", () => changeDashboardMonth(1));

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
  const multiplier = muscleMapPeriod === "week" ? 1 : MONTH_MULTIPLIER;
  return WEEK_SHADE_LIMITS.map((limit) => limit * multiplier);
}

// "This week" or "This month" — chosen with the toggle.
let muscleMapPeriod = "week";

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
  const isWeek = muscleMapPeriod === "week";
  const keys = isWeek ? weekKeysFor(todayKey()) : monthKeysFor(dashboardMonth);

  document.querySelectorAll(".period-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.period === muscleMapPeriod);
  });
  document.getElementById("muscle-month-nav").hidden = isWeek;
  const format = (key) => keyToDate(key).toLocaleDateString([], { month: "short", day: "numeric" });
  document.getElementById("muscle-period-label").textContent = isWeek
    ? `This week (${format(keys[0])} – ${format(keys[6])})`
    : "";
  document.getElementById("muscle-month-title").textContent =
    dashboardMonth.toLocaleDateString([], { month: "long", year: "numeric" });

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
document.getElementById("muscle-month-prev").addEventListener("click", () => changeDashboardMonth(-1));
document.getElementById("muscle-month-next").addEventListener("click", () => changeDashboardMonth(1));

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
