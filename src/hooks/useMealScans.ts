"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { MealType } from "@/lib/qr-utils";

// ── Types ─────────────────────────────────────────────────────────
export interface MealQR {
  _id: string;
  code: string;
  mealType: MealType;
  used: boolean;
  usedAt: string | null;
  validFrom: string;
  validUntil: string;
  studentId: string;
  hackathonId: string;
}

export interface ScanEvent {
  code: string;
  studentId: string | { _id: string; name: string; email: string };
  mealType: MealType;
  scannedAt: string;
  status: "SUCCESS" | "ALREADY_USED" | "INVALID_WINDOW" | "NOT_FOUND";
  scannedBy?: string | { _id: string; name: string };
}

export interface MealStats {
  breakfast: { used: number; total: number };
  lunch: { used: number; total: number };
  dinner: { used: number; total: number };
}

// ── Main Hook ─────────────────────────────────────────────────────

export function useMealScans() {
  const [qrCodes, setQrCodes] = useState<MealQR[]>([]);
  const [scanLog, setScanLog] = useState<ScanEvent[]>([]);
  const [stats, setStats] = useState<MealStats>({
    breakfast: { used: 0, total: 0 },
    lunch: { used: 0, total: 0 },
    dinner: { used: 0, total: 0 },
  });

  // ── Fetch QR codes for a student from API ───────────────────────
  const fetchStudentQRs = useCallback(
    async (studentId: string, hackathonId: string): Promise<MealQR[]> => {
      try {
        const data = await api.get(`/api/qr/${studentId}/${hackathonId}`);
        const codes: MealQR[] = data.qrCodes || [];
        setQrCodes(codes);
        return codes;
      } catch {
        return [];
      }
    },
    []
  );

  // ── Generate QR codes via API (idempotent) ──────────────────────
  const registerMealQRs = useCallback(
    async (studentId: string, hackathonId: string): Promise<MealQR[]> => {
      try {
        const data = await api.post("/api/qr/generate", {
          studentId,
          hackathonId,
        });
        const codes: MealQR[] = data.qrCodes || [];
        setQrCodes(codes);
        return codes;
      } catch {
        return [];
      }
    },
    []
  );

  // ── Scan a QR code via API ──────────────────────────────────────
  const scanCode = useCallback(
    async (
      code: string,
      scannedBy: string,
      hackathonId: string
    ): Promise<{
      success: boolean;
      reason: string;
      mealType?: MealType;
      studentName?: string;
      status: string;
    }> => {
      try {
        const data = await api.post("/api/scanner/scan", {
          code,
          scannedBy,
          hackathonId,
        });

        return {
          success: data.status === "SUCCESS",
          reason: data.message,
          mealType: data.mealType,
          studentName: data.studentName,
          status: data.status,
        };
      } catch (err) {
        return {
          success: false,
          reason: err instanceof Error ? err.message : "Network error",
          status: "ERROR",
        };
      }
    },
    []
  );

  // ── Fetch stats from API ────────────────────────────────────────
  const fetchStats = useCallback(
    async (hackathonId: string): Promise<MealStats> => {
      try {
        const data = await api.get(`/api/scanner/stats/${hackathonId}`);
        setStats(data);
        return data;
      } catch {
        return stats;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Fetch scan logs from API ────────────────────────────────────
  const fetchLogs = useCallback(
    async (hackathonId: string, limit = 20): Promise<ScanEvent[]> => {
      try {
        const data = await api.get(
          `/api/scanner/logs/${hackathonId}?limit=${limit}`
        );
        const logs: ScanEvent[] = data || [];
        setScanLog(logs);
        return logs;
      } catch {
        return [];
      }
    },
    []
  );

  return {
    qrCodes,
    scanLog,
    stats,
    fetchStudentQRs,
    registerMealQRs,
    scanCode,
    fetchStats,
    fetchLogs,
  };
}
