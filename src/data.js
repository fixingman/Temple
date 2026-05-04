// ─── Exercise Library ───
export const DEFAULT_EXERCISES = [
  // Chest
  { id: "e1", name: "Bench Press", muscle: "Chest", equipment: "weighted", category: "strength", yt: "bench+press+form" },
  { id: "e2", name: "Incline Dumbbell Press", muscle: "Chest", equipment: "weighted", category: "strength", yt: "incline+dumbbell+press" },
  { id: "e3", name: "Cable Fly", muscle: "Chest", equipment: "weighted", category: "strength", yt: "cable+fly+form" },
  { id: "e25", name: "Push-up", muscle: "Chest", equipment: "bodyweight", category: "strength", yt: "push+up+form" },
  // Legs
  { id: "e4", name: "Squat", muscle: "Legs", equipment: "weighted", category: "strength", yt: "barbell+squat+form" },
  { id: "e5", name: "Romanian Deadlift", muscle: "Legs", equipment: "weighted", category: "strength", yt: "romanian+deadlift+form" },
  { id: "e6", name: "Leg Press", muscle: "Legs", equipment: "weighted", category: "strength", yt: "leg+press+form" },
  { id: "e7", name: "Leg Curl", muscle: "Legs", equipment: "weighted", category: "strength", yt: "leg+curl+form" },
  { id: "e23", name: "Bulgarian Split Squat", muscle: "Legs", equipment: "weighted", category: "strength", yt: "bulgarian+split+squat" },
  { id: "e24", name: "Calf Raise", muscle: "Legs", equipment: "weighted", category: "strength", yt: "calf+raise+form" },
  { id: "e26", name: "Front Squat", muscle: "Legs", equipment: "weighted", category: "strength", yt: "front+squat+form" },
  { id: "e27", name: "Lunge", muscle: "Legs", equipment: "bodyweight", category: "strength", yt: "lunge+form" },
  { id: "e28", name: "Pistol Squat", muscle: "Legs", equipment: "bodyweight", category: "strength", yt: "pistol+squat+tutorial" },
  { id: "e29", name: "Bodyweight Squat", muscle: "Legs", equipment: "bodyweight", category: "strength", yt: "bodyweight+squat+form" },
  { id: "e30", name: "World's Greatest Stretch", muscle: "Legs", equipment: "bodyweight", category: "mobility", yt: "worlds+greatest+stretch" },
  // Shoulders
  { id: "e8", name: "Overhead Press", muscle: "Shoulders", equipment: "weighted", category: "strength", yt: "overhead+press+form" },
  { id: "e9", name: "Lateral Raise", muscle: "Shoulders", equipment: "weighted", category: "strength", yt: "lateral+raise+form" },
  { id: "e10", name: "Face Pull", muscle: "Shoulders", equipment: "weighted", category: "strength", yt: "face+pull+form" },
  { id: "e31", name: "Arnold Press", muscle: "Shoulders", equipment: "weighted", category: "strength", yt: "arnold+press+form" },
  { id: "e32", name: "Shoulder Dislocate", muscle: "Shoulders", equipment: "bodyweight", category: "mobility", yt: "shoulder+dislocate+band" },
  // Back
  { id: "e11", name: "Barbell Row", muscle: "Back", equipment: "weighted", category: "strength", yt: "barbell+row+form" },
  { id: "e12", name: "Lat Pulldown", muscle: "Back", equipment: "weighted", category: "strength", yt: "lat+pulldown+form" },
  { id: "e13", name: "Seated Cable Row", muscle: "Back", equipment: "weighted", category: "strength", yt: "seated+cable+row" },
  { id: "e14", name: "Deadlift", muscle: "Back", equipment: "weighted", category: "strength", yt: "deadlift+form" },
  { id: "e33", name: "Pendlay Row", muscle: "Back", equipment: "weighted", category: "strength", yt: "pendlay+row+form" },
  { id: "e34", name: "Pull-up", muscle: "Back", equipment: "bodyweight", category: "strength", yt: "pull+up+form" },
  { id: "e35", name: "Thoracic Rotation", muscle: "Back", equipment: "bodyweight", category: "mobility", yt: "thoracic+spine+rotation+mobility" },
  { id: "e36", name: "Cat-Cow", muscle: "Back", equipment: "bodyweight", category: "mobility", yt: "cat+cow+stretch" },
  { id: "e40", name: "Dead Hang", muscle: "Back", equipment: "bodyweight", category: "mobility", yt: "dead+hang+form+benefits" },
  // Arms
  { id: "e15", name: "Barbell Curl", muscle: "Arms", equipment: "weighted", category: "strength", yt: "barbell+curl+form" },
  { id: "e16", name: "Tricep Pushdown", muscle: "Arms", equipment: "weighted", category: "strength", yt: "tricep+pushdown" },
  { id: "e17", name: "Hammer Curl", muscle: "Arms", equipment: "weighted", category: "strength", yt: "hammer+curl+form" },
  { id: "e18", name: "Skull Crusher", muscle: "Arms", equipment: "weighted", category: "strength", yt: "skull+crusher+form" },
  { id: "e37", name: "Dip", muscle: "Arms", equipment: "bodyweight", category: "strength", yt: "dip+form+tricep" },
  // Core
  { id: "e19", name: "Plank", muscle: "Core", equipment: "bodyweight", category: "strength", yt: "plank+form" },
  { id: "e20", name: "Cable Crunch", muscle: "Core", equipment: "weighted", category: "strength", yt: "cable+crunch+form" },
  { id: "e21", name: "Hanging Leg Raise", muscle: "Core", equipment: "bodyweight", category: "strength", yt: "hanging+leg+raise" },
  // Glutes
  { id: "e22", name: "Hip Thrust", muscle: "Glutes", equipment: "weighted", category: "strength", yt: "hip+thrust+form" },
  { id: "e38", name: "Hip Circle", muscle: "Glutes", equipment: "bodyweight", category: "mobility", yt: "hip+circle+activation" },
  { id: "e39", name: "90/90 Hip Stretch", muscle: "Glutes", equipment: "bodyweight", category: "mobility", yt: "90+90+hip+stretch" },
  { id: "e50", name: "Pigeon Pose", muscle: "Glutes", equipment: "bodyweight", category: "mobility", yt: "pigeon+pose+hip+stretch" },
  { id: "e41", name: "Frog Stretch", muscle: "Glutes", equipment: "bodyweight", category: "mobility", yt: "frog+stretch+hip+mobility" },
  { id: "e42", name: "Cossack Squat", muscle: "Legs", equipment: "bodyweight", category: "mobility", yt: "cossack+squat+mobility" },
  { id: "e43", name: "Standing Forward Fold", muscle: "Legs", equipment: "bodyweight", category: "mobility", yt: "standing+forward+fold+hamstring" },
  { id: "e44", name: "Supine Hamstring Stretch", muscle: "Legs", equipment: "bodyweight", category: "mobility", yt: "supine+hamstring+stretch" },
  { id: "e45", name: "Jefferson Curl", muscle: "Back", equipment: "bodyweight", category: "mobility", yt: "jefferson+curl+mobility" },
  { id: "e46", name: "Nordic Hamstring Curl", muscle: "Legs", equipment: "bodyweight", category: "strength", yt: "nordic+hamstring+curl" },
  { id: "e47", name: "Elephant Walk", muscle: "Legs", equipment: "bodyweight", category: "mobility", yt: "elephant+walk+hamstring+stretch" },
  { id: "e48", name: "Glute Bridge", muscle: "Glutes", equipment: "bodyweight", category: "strength", yt: "glute+bridge+form" },
  { id: "e49", name: "Single-Leg RDL", muscle: "Legs", equipment: "bodyweight", category: "strength", yt: "single+leg+rdl+bodyweight" },
];

export const MUSCLE_GROUPS = ["All", "Chest", "Back", "Shoulders", "Legs", "Arms", "Core", "Glutes"];
export const MUSCLE_GROUPS_NO_ALL = MUSCLE_GROUPS.slice(1);
export const MUSCLE_ICONS = { Chest: "🫁", Back: "🔙", Shoulders: "💪", Legs: "🦵", Arms: "💪", Core: "🎯", Glutes: "🍑" };
export const EQUIPMENT_TYPES = ["Weighted", "Bodyweight"];
export const CATEGORY_TYPES = ["Strength", "Mobility"];
export const KG_TO_LBS = 2.20462;
export const DEFAULT_SETTINGS = { unit: "kg", anthropicKey: "" };
export const STORAGE_KEY = "temple-data";
export const DEFAULT_REST = 90;

// ─── Utilities ───
export const uid = () => Math.random().toString(36).slice(2, 9);
export const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
export const fmtDateFull = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
export const mkDefault = () => ({ exercises: DEFAULT_EXERCISES, sets: [], sessions: [], prs: {}, settings: DEFAULT_SETTINGS });

export function displayWeight(kg, unit) {
  if (unit === "lbs") return Math.round(kg * KG_TO_LBS * 10) / 10;
  return kg;
}
export function toKg(val, unit) {
  if (unit === "lbs") return Math.round((val / KG_TO_LBS) * 10) / 10;
  return val;
}
export function weightLabel(unit) { return unit === "lbs" ? "lbs" : "kg"; }

// Epley formula: estimated 1RM = weight × (1 + reps/30)
export function est1RM(weight, reps) {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
