"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthContext";
import { useMealScans, type ScanEvent, type MealStats } from "@/hooks/useMealScans";
import type { MealType } from "@/lib/qr-utils";

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};

const MEAL_WINDOWS_DISPLAY: Record<MealType, string> = {
  BREAKFAST: "07:30 – 09:30",
  LUNCH: "12:00 – 14:00",
  DINNER: "19:00 – 00:00",
};

export default function FoodScannerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { scanCode, fetchStats, fetchLogs } = useMealScans();

  const [inputValue, setInputValue] = useState("");
  const [stats, setStats] = useState<MealStats>({
    breakfast: { used: 0, total: 0 },
    lunch: { used: 0, total: 0 },
    dinner: { used: 0, total: 0 },
  });
  const [recentScans, setRecentScans] = useState<ScanEvent[]>([]);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    reason: string;
    mealType?: MealType;
    studentName?: string;
    time: string;
    status: string;
  } | null>(null);
  const [scanning, setScanning] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Get IDs from auth
  const scannedBy = user?.id || "";
  const hackathonId = user?.hackathonId || "";

  // Redirect if not organizer or admin
  useEffect(() => {
    if (user && user.role !== "organizer" && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  // Refresh stats & scan log
  const refreshData = async () => {
    if (!hackathonId) return;
    const [newStats, newLogs] = await Promise.all([
      fetchStats(hackathonId),
      fetchLogs(hackathonId, 15),
    ]);
    setStats(newStats);
    setRecentScans(newLogs);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

  const handleScan = async () => {
    const code = inputValue.trim();
    if (!code || !scannedBy) return;

    // Extract hackathonId from QR code: MEALTYPE-studentId-hackathonId-uuid
    const parts = code.split("-");
    const qrHackathonId = parts.length >= 3 ? parts[2] : hackathonId;

    setScanning(true);
    const result = await scanCode(code, scannedBy, qrHackathonId);

    setLastResult({
      ...result,
      time: new Date().toLocaleTimeString(),
    });

    setInputValue("");
    await refreshData();
    setScanning(false);

    // Re-focus input for rapid scanning
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan();
  };

  // Helper to extract name from populated or raw studentId
  const getStudentName = (scan: ScanEvent): string => {
    if (typeof scan.studentId === "object" && scan.studentId?.name) {
      return scan.studentId.name;
    }
    return String(scan.studentId || "Unknown");
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-8 md:px-8">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Food Counter Scanner
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Scan meal QR codes to redeem breakfast, lunch, and dinner — no
            paper coupons, no duplication.
          </p>
        </div>
        {user && (
          <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 md:text-sm">
            Scanner: {user.name}
          </span>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        {/* Left: Scanner + Result */}
        <div className="space-y-4">
          {/* Scanner input */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-700">
              Scan or enter meal QR code
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Paste the QR code string from a student&apos;s meal pass, or use
              a barcode scanner device.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="BREAKFAST-studentId-hackathonId-uuid..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-black outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleScan}
                disabled={scanning || !inputValue.trim()}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {scanning ? "Scanning..." : "Scan"}
              </button>
            </div>
          </section>

          {/* Last scan result */}
          {lastResult && (
            <section
              className={`rounded-2xl p-5 shadow-sm ring-1 transition-all ${
                lastResult.success
                  ? "bg-emerald-50 ring-emerald-200"
                  : "bg-rose-50 ring-rose-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-lg font-semibold ${
                        lastResult.success
                          ? "text-emerald-900"
                          : "text-rose-900"
                      }`}
                    >
                      {lastResult.success ? "Meal Redeemed!" : "Scan Rejected"}
                    </h3>
                  </div>
                  <p
                    className={`mt-1 text-sm font-medium ${
                      lastResult.success
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {lastResult.reason}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    lastResult.success
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {lastResult.success ? "VALID" : "INVALID"}
                </span>
              </div>

              {(lastResult.mealType || lastResult.studentName) && (
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  {lastResult.mealType && (
                    <div>
                      <p className="font-semibold text-slate-500">Meal Type</p>
                      <p className="mt-0.5 font-semibold text-slate-900">
                        {MEAL_LABELS[lastResult.mealType]}
                      </p>
                    </div>
                  )}
                  {lastResult.studentName && (
                    <div>
                      <p className="font-semibold text-slate-500">Student</p>
                      <p className="mt-0.5 font-semibold text-slate-900">
                        {lastResult.studentName}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-500">Scanned At</p>
                    <p className="mt-0.5 font-semibold text-slate-900">
                      {lastResult.time}
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Recent scans log */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Scans
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                {recentScans.length} entries
              </span>
            </div>

            {recentScans.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                No scans yet. Start scanning meal QR codes above.
              </p>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="space-y-2 md:hidden">
                  {recentScans.map((scan, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">
                          {MEAL_LABELS[scan.mealType]} · {getStudentName(scan)}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            scan.status === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {scan.status === "SUCCESS" ? "Valid" : "Rejected"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {new Date(scan.scannedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden w-full overflow-x-auto md:block">
                  <table className="w-full border-separate border-spacing-y-1 text-xs">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="rounded-l-lg bg-slate-50 px-3 py-2 text-left font-medium">
                          Student
                        </th>
                        <th className="bg-slate-50 px-3 py-2 text-left font-medium">
                          Meal
                        </th>
                        <th className="bg-slate-50 px-3 py-2 text-left font-medium">
                          Time
                        </th>
                        <th className="rounded-r-lg bg-slate-50 px-3 py-2 text-left font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentScans.map((scan, idx) => (
                        <tr key={idx} className="bg-white shadow-xs">
                          <td className="rounded-l-lg px-3 py-2 font-medium text-slate-800">
                            {getStudentName(scan)}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {MEAL_LABELS[scan.mealType]}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {new Date(scan.scannedAt).toLocaleTimeString()}
                          </td>
                          <td className="rounded-r-lg px-3 py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                scan.status === "SUCCESS"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {scan.status === "SUCCESS" ? "Valid" : "Rejected"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Right: Live Stats */}
        <aside className="space-y-4">
          {/* Meal stats */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Live Meal Stats
            </h2>
            <div className="space-y-3">
              {(["BREAKFAST", "LUNCH", "DINNER"] as MealType[]).map((meal) => {
                const key = meal.toLowerCase() as "breakfast" | "lunch" | "dinner";
                const { used, total } = stats[key];
                const pct = total > 0 ? Math.round((used / total) * 100) : 0;

                return (
                  <div
                    key={meal}
                    className="rounded-xl bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {MEAL_LABELS[meal]}
                        </p>
                        <p className="text-xs text-slate-400">
                          {MEAL_WINDOWS_DISPLAY[meal]}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {used}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          / {total}
                        </span>
                      </p>
                    </div>
                    {total > 0 && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Time windows reference */}
          <section className="rounded-2xl bg-slate-900 p-5 text-xs text-slate-100">
            <h3 className="text-sm font-semibold text-white">
              Meal Time Windows
            </h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center justify-between">
                <span>Breakfast</span>
                <span className="font-mono">07:30 – 09:30</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Lunch</span>
                <span className="font-mono">12:00 – 14:00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Dinner</span>
                <span className="font-mono">19:00 – 21:00</span>
              </li>
            </ul>
            <p className="mt-3 text-[11px] text-slate-400">
              QR codes scanned outside these windows will be rejected. Already
              redeemed codes cannot be reused.
            </p>
          </section>

          {/* Scanner tips */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Scanner Tips
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
              <li>Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to scan quickly after pasting a code.</li>
              <li>The input auto-focuses after each scan for rapid use.</li>
              <li>Stats update automatically every 10 seconds.</li>
              <li>Invalid scans are still logged for audit purposes.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
