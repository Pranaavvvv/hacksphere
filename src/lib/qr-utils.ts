import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Meal QR Utilities ──────────────────────────────────────────────

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

export interface MealQR {
  code: string;
  mealType: MealType;
  used: boolean;
  usedAt: string | null;
  validFrom: string; // HH:MM
  validUntil: string; // HH:MM
  studentId: string;
  hackathonId: string;
}

export interface MealTimeWindow {
  validFrom: string;
  validUntil: string;
  fromHour: number;
  fromMinute: number;
  toHour: number;
  toMinute: number;
}

export interface ParsedQRCode {
  mealType: MealType;
  studentId: string;
  hackathonId: string;
  uuid: string;
}

const MEAL_WINDOWS: Record<MealType, { fromHour: number; fromMinute: number; toHour: number; toMinute: number }> = {
  BREAKFAST: { fromHour: 7, fromMinute: 30, toHour: 9, toMinute: 30 },
  LUNCH: { fromHour: 12, fromMinute: 0, toHour: 14, toMinute: 0 },
  DINNER: { fromHour: 19, fromMinute: 0, toHour: 24, toMinute: 0 },
};

/** Generate a v4-ish UUID without crypto dependency */
function generateUUID(): string {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Format hours/minutes to HH:MM */
function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Get the time window for a meal type */
export function getMealTimeWindow(mealType: MealType): MealTimeWindow {
  const w = MEAL_WINDOWS[mealType];
  return {
    validFrom: `${pad(w.fromHour)}:${pad(w.fromMinute)}`,
    validUntil: `${pad(w.toHour)}:${pad(w.toMinute)}`,
    ...w,
  };
}

/** Check whether current time falls within a meal window */
export function isWithinMealWindow(mealType: MealType): boolean {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const w = MEAL_WINDOWS[mealType];
  const start = w.fromHour * 60 + w.fromMinute;
  const end = w.toHour * 60 + w.toMinute;
  return minutes >= start && minutes <= end;
}

/** Get the next upcoming meal window (or current if within one) */
export function getNextMealInfo(): {
  mealType: MealType;
  label: string;
  startsIn: number; // seconds until window opens (0 if currently open)
  endsIn: number; // seconds until window closes
} | null {
  const now = new Date();
  const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const meals: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];
  const labels: Record<MealType, string> = {
    BREAKFAST: "Breakfast",
    LUNCH: "Lunch",
    DINNER: "Dinner",
  };

  for (const meal of meals) {
    const w = MEAL_WINDOWS[meal];
    const startSec = w.fromHour * 3600 + w.fromMinute * 60;
    const endSec = w.toHour * 3600 + w.toMinute * 60;

    if (totalSeconds < endSec) {
      const startsIn = Math.max(0, startSec - totalSeconds);
      const endsIn = endSec - totalSeconds;
      return { mealType: meal, label: labels[meal], startsIn, endsIn };
    }
  }
  // All windows passed today — next is breakfast tomorrow
  const bw = MEAL_WINDOWS.BREAKFAST;
  const bStart = bw.fromHour * 3600 + bw.fromMinute * 60;
  const startsIn = 86400 - totalSeconds + bStart;
  const endsIn = startsIn + (bw.toHour - bw.fromHour) * 3600 + (bw.toMinute - bw.fromMinute) * 60;
  return { mealType: "BREAKFAST", label: "Breakfast (tomorrow)", startsIn, endsIn };
}

/** Generate a single meal QR object */
export function generateMealQR(
  studentId: string,
  hackathonId: string,
  mealType: MealType
): MealQR {
  const uuid = generateUUID();
  const code = `${mealType}-${studentId}-${hackathonId}-${uuid}`;
  const window = getMealTimeWindow(mealType);

  return {
    code,
    mealType,
    used: false,
    usedAt: null,
    validFrom: window.validFrom,
    validUntil: window.validUntil,
    studentId,
    hackathonId,
  };
}

/** Generate all 3 meal QRs for a student */
export function generateAllMealQRs(
  studentId: string,
  hackathonId: string
): MealQR[] {
  return (["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).map((mealType) =>
    generateMealQR(studentId, hackathonId, mealType)
  );
}

/** Parse a QR code string back into its parts */
export function parseMealQRCode(code: string): ParsedQRCode | null {
  const parts = code.split("-");
  if (parts.length < 4) return null;

  const mealType = parts[0] as MealType;
  if (!["BREAKFAST", "LUNCH", "DINNER"].includes(mealType)) return null;

  const studentId = parts[1];
  const hackathonId = parts[2];
  const uuid = parts.slice(3).join("-");

  if (!studentId || !hackathonId || !uuid) return null;

  return { mealType, studentId, hackathonId, uuid };
}

/** Validate a QR code scan — returns { valid, reason } */
export function validateScan(
  code: string,
  usedCodes: Set<string>
): { valid: boolean; reason: string; parsed: ParsedQRCode | null } {
  const parsed = parseMealQRCode(code);

  if (!parsed) {
    return { valid: false, reason: "Invalid QR code format", parsed: null };
  }

  if (usedCodes.has(code)) {
    return { valid: false, reason: "Already redeemed", parsed };
  }

  if (!isWithinMealWindow(parsed.mealType)) {
    const window = getMealTimeWindow(parsed.mealType);
    return {
      valid: false,
      reason: `Outside meal window (${window.validFrom} – ${window.validUntil})`,
      parsed,
    };
  }

  return { valid: true, reason: "Valid", parsed };
}
