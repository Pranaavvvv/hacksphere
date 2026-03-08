"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { useAuth } from "@/app/AuthContext";
import api from "@/lib/api";
import { useMealScans, type MealQR } from "@/hooks/useMealScans";
import {
  getMealTimeWindow,
  isWithinMealWindow,
  getNextMealInfo,
  type MealType,
} from "@/lib/qr-utils";

// ── Constants ─────────────────────────────────────────────────────
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

// ── Helper: format seconds to HH:MM:SS ────────────────────────────
function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ── QR Card Component ─────────────────────────────────────────────
function MealQRCard({ qr }: { qr: MealQR }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const window = getMealTimeWindow(qr.mealType);
  const active = isWithinMealWindow(qr.mealType);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qr.code,
        {
          width: 180,
          margin: 2,
          color: {
            dark: qr.used ? "#94a3b8" : "#0f172a",
            light: "#ffffff",
          },
        },
        (err) => {
          if (err) console.error("QR render error:", err);
        }
      );
    }
  }, [qr.code, qr.used]);

  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 transition-all ${
        qr.used
          ? "ring-slate-200 opacity-70"
          : active
          ? "ring-emerald-200 shadow-md"
          : "ring-slate-100"
      }`}
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">
            {MEAL_LABELS[qr.mealType]}
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            qr.used
              ? "bg-slate-100 text-slate-600"
              : active
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {qr.used ? "USED" : active ? "ACTIVE" : "UPCOMING"}
        </span>
      </div>

      {/* QR Code */}
      <div className="flex justify-center rounded-xl bg-slate-50 p-4">
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>

      {/* Code string */}
      <p className="mt-3 break-all rounded-lg bg-slate-900 px-3 py-2 font-mono text-[10px] text-slate-300">
        {qr.code}
      </p>

      {/* Time window */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <span>
          Valid: <strong>{window.validFrom} – {window.validUntil}</strong>
        </span>
        {active && !qr.used && (
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Window open
          </span>
        )}
      </div>

      {/* Used timestamp */}
      {qr.used && qr.usedAt && (
        <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Redeemed at{" "}
          <span className="font-semibold text-slate-700">
            {new Date(qr.usedAt).toLocaleTimeString()}
          </span>{" "}
          on {new Date(qr.usedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function MealPassesPage() {
  const { user } = useAuth();
  const { registerMealQRs, fetchStudentQRs } = useMealScans();
  const [mealQRs, setMealQRs] = useState<MealQR[]>([]);
  const [countdown, setCountdown] = useState("");
  const [nextMealLabel, setNextMealLabel] = useState("");
  const [loading, setLoading] = useState(true);

  // Get student/hackathon IDs from auth context
  const studentId = user?.id || "";
  const hackathonId = user?.hackathonId || "";

  // Register/fetch QRs on mount
  useEffect(() => {
    if (!studentId || !hackathonId) {
      setLoading(false);
      return;
    }

    const init = async () => {
      // First try to fetch existing QRs
      let qrs = await fetchStudentQRs(studentId, hackathonId);

      // If none exist, generate them
      if (qrs.length === 0) {
        qrs = await registerMealQRs(studentId, hackathonId);
      }

      setMealQRs(qrs);
      setLoading(false);
    };

    init();
  }, [studentId, hackathonId, registerMealQRs, fetchStudentQRs]);

  // Refresh QR states from API periodically
  useEffect(() => {
    if (!studentId || !hackathonId) return;

    const interval = setInterval(async () => {
      const qrs = await fetchStudentQRs(studentId, hackathonId);
      if (qrs.length > 0) setMealQRs(qrs);
    }, 5000);
    return () => clearInterval(interval);
  }, [studentId, hackathonId, fetchStudentQRs]);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const info = getNextMealInfo();
      if (info) {
        setNextMealLabel(info.label);
        setCountdown(
          info.startsIn > 0
            ? fmtDuration(info.startsIn)
            : `Ends in ${fmtDuration(info.endsIn)}`
        );
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sort: BREAKFAST, LUNCH, DINNER
  const sorted = [...mealQRs].sort((a, b) => {
    const order: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];
    return order.indexOf(a.mealType) - order.indexOf(b.mealType);
  });

  const usedCount = mealQRs.filter((q) => q.used).length;

  // ── Quick test setup (no hackathon linked yet) ───────────────────
  const [settingUp, setSettingUp] = useState(false);

  const handleQuickSetup = async () => {
    setSettingUp(true);
    try {
      const res = await api.post("/api/test/setup");
      // Update user in localStorage with hackathonId
      const updatedUser = res.user;
      localStorage.setItem("hacksphere_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-state-changed"));
      // Reload to pick up new hackathonId
      window.location.reload();
    } catch (err) {
      console.error("Test setup failed:", err);
      setSettingUp(false);
    }
  };

  if (!hackathonId) {
    return (
      <div className="mx-auto max-w-5xl px-5 pb-16 pt-8 md:px-8">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">No Hackathon Linked</h2>
          <p className="mt-2 text-sm text-slate-500">
            Generate test meal passes to verify that QR codes work — no hackathon
            registration needed.
          </p>
          <button
            onClick={handleQuickSetup}
            disabled={settingUp}
            className="mt-5 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {settingUp ? "Setting up..." : "Generate Test Passes"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-8 md:px-8">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            My Meal Passes
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Each QR is one-time-use and valid only inside its time window. Show
            it at the food counter to redeem.
          </p>
        </div>
        {user && (
          <span className="rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
            {user.name}
          </span>
        )}
      </header>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Total Passes
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {mealQRs.length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Redeemed
          </p>
          <p className="mt-1 text-xl font-semibold text-emerald-700">
            {usedCount}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Remaining
          </p>
          <p className="mt-1 text-xl font-semibold text-amber-700">
            {mealQRs.length - usedCount}
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wide opacity-90">
            {nextMealLabel}
          </p>
          <p className="mt-1 font-mono text-xl font-semibold">{countdown}</p>
        </div>
      </div>

      {/* QR Cards */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-400">
          Loading your meal passes...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {sorted.map((qr) => (
            <MealQRCard key={qr.code} qr={qr} />
          ))}
        </div>
      )}

      {/* Info panel */}
      <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-xs text-slate-300">
        <h3 className="text-sm font-semibold text-white">How meal passes work</h3>
        <ul className="mt-3 space-y-1.5">
          <li>Each QR code can be scanned <strong>only once</strong>.</li>
          <li>
            QR codes are valid only during their time window — Breakfast
            (07:30–09:30), Lunch (12:00–14:00), Dinner (19:00–00:00).
          </li>
          <li>
            Once scanned, the pass is marked as USED and cannot be reused or
            transferred.
          </li>
          <li>
            If you face any issues, visit the help desk with your student ID.
          </li>
        </ul>
      </div>
    </div>
  );
}
