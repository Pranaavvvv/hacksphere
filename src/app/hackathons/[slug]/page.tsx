 "use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";

type HackathonPageProps = {
  params: Promise<{ slug: string }>;
};

type TabId = "overview" | "prizes" | "people" | "schedule" | "application";

type ApplicationStepKey =
  | "verification"
  | "registration"
  | "qr"
  | "ai";

export default function HackathonDetail({ params }: HackathonPageProps) {
  const { slug } = use(params);
  const isCampusHack = slug === "campushack-2026";
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form data state
  const [verificationData, setVerificationData] = useState({
    collegeIdFile: null as File | null,
    aadhaar: "",
    selfieCaptured: false,
    otp: "",
    otpVerified: false,
  });
  
  const [registrationData, setRegistrationData] = useState({
    teamName: "",
    problemStatement: "",
    round1PPT: null as File | null,
  });
  
  const [aiCompliance, setAiCompliance] = useState(false);

  const { applicationPercent, canSubmit } = useMemo(() => {
    const verificationComplete = 
      verificationData.collegeIdFile !== null &&
      verificationData.aadhaar.length >= 4 &&
      verificationData.selfieCaptured &&
      verificationData.otpVerified;
    
    const registrationComplete =
      registrationData.teamName.length > 0 &&
      registrationData.problemStatement.length > 0 &&
      registrationData.round1PPT !== null;
    
    const qrComplete = verificationComplete; // QR is auto-generated after verification
    
    // Only 3 required sections: verification, registration, QR
    const requiredKeys: ApplicationStepKey[] = [
      "verification",
      "registration",
      "qr",
    ];
    
    const completed = [
      verificationComplete,
      registrationComplete,
      qrComplete,
    ];
    
    const completedCount = completed.filter(Boolean).length;
    const percent = Math.round((completedCount / requiredKeys.length) * 100);
    const readyToSubmit = completed.every(Boolean);
    
    return { applicationPercent: percent, canSubmit: readyToSubmit };
  }, [verificationData, registrationData]);

  const handleSubmit = () => {
    if (canSubmit) {
      setShowSuccess(true);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 md:px-8">
      {/* Hackathon header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
            🪙
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {isCampusHack ? "CampusHack 2026" : "Campus Hackathon"}
            </h1>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {isCampusHack ? "College Innovation Festival" : "Hackathon"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="hidden items-center gap-2 md:flex">
            <span className="h-8 w-8 rounded-full bg-slate-200" />
            <span className="h-8 w-8 rounded-full bg-slate-300" />
            <span className="h-8 w-8 rounded-full bg-slate-400" />
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
            Applications open
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-slate-600 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0">
        {(
          [
            ["overview", "Overview"],
            ["prizes", "Prizes"],
            ["people", "People"],
            ["schedule", "Schedule"],
            ["application", "Application"],
          ] as [TabId, string][]
        ).map(([id, label]) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`rounded-full px-4 py-1.5 whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {showSuccess ? (
        <div className="mt-6 flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-slate-100 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Application Submitted Successfully!</h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Your application for CampusHack 2026 has been submitted and is now under review.
            </p>
            <div className="mt-6 space-y-3 text-left rounded-xl bg-slate-50 p-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-slate-600">Application ID</span>
                <span className="font-mono font-semibold text-slate-900 break-all sm:break-normal">APP-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-slate-600">Submitted on</span>
                <span className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-slate-600">Status</span>
                <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-700 inline-block w-fit">Under Review</span>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-500">
              You will receive an email confirmation shortly. Check your dashboard for updates.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/hackathons"
                className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 text-center"
              >
                Browse More
              </Link>
              <Link
                href="/student/pass"
                className="flex-1 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 text-center"
              >
                View QR Pass
              </Link>
            </div>
          </div>
        </div>
      ) : activeTab === "application" ? (
        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          {/* Application sections */}
          <div className="space-y-4">
            <VerificationSection
              data={verificationData}
              onChange={setVerificationData}
            />

            <RegistrationSection
              data={registrationData}
              onChange={setRegistrationData}
            />

            <QRPassSection
              isComplete={verificationData.otpVerified}
            />

            <AIComplianceSection
              enabled={aiCompliance}
              onChange={setAiCompliance}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl flex-shrink-0">
                    📋
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Application filled
                    </p>
                    <p className="text-xl sm:text-2xl font-semibold text-slate-900">
                      {applicationPercent}%
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-emerald-600 whitespace-nowrap">
                  {canSubmit ? "Ready to submit" : "Complete all steps"}
                </span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                  style={{ width: `${applicationPercent}%` }}
                />
              </div>

              <dl className="mt-5 space-y-3 text-xs sm:text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-500">Runs from</dt>
                  <dd className="mt-0.5 break-words">
                    Mar 15 – 17, 2026 · Mumbai, India
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">
                    Applications close in
                  </dt>
                  <dd className="mt-0.5 rounded-xl bg-indigo-50 px-3 py-1 font-mono text-xs sm:text-[11px] text-indigo-700 inline-block">
                    2d : 9h : 18m
                  </dd>
                </div>
              </dl>

              <button
                onClick={handleSubmit}
                className="mt-5 flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canSubmit}
              >
                Submit application
              </button>
              <p className="mt-2 text-xs sm:text-[11px] text-slate-400">
                {canSubmit
                  ? "Once you submit, your application will be locked for evaluation."
                  : "Finish all required sections (verification, registration, and QR passes) to enable submission."}
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                What organizers see
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Your submission appears in a structured evaluation dashboard with
                scoring for innovation, feasibility, technical depth, presentation
                clarity, and social impact.
              </p>
              <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>• Weighted scoring matrix per judge</li>
                <li>• Auto-generated leaderboards</li>
                <li>• One-click shortlisting with instant notifications</li>
              </ul>
              <Link
                href="/admin"
                className="inline-flex text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Preview organizer dashboard →
              </Link>
            </div>
          </aside>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <div className="space-y-4">
            {activeTab === "overview" && (
              <>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Build innovative solutions for real-world problems
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    A three-day innovation festival with exciting prizes, hands-on
                    workshops, and round-the-clock mentor support. From beginners to
                    experienced developers, everyone can build something amazing here.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      Offline · Mumbai, India
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      Multiple prize tracks
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      Student-focused events
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Why we use HackSphere
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li>• Strong student verification and secure QR entry.</li>
                    <li>• Digital-only food management and attendance.</li>
                    <li>• Structured evaluation, AI assistance and fair rankings.</li>
                  </ul>
                </div>
              </>
            )}

            {activeTab === "prizes" && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Prize tracks
                  </h2>
                  <div className="mt-3 grid gap-3 md:grid-cols-2 text-xs">
                    <PrizeCard title="Grand Prize" value="$25,000" detail="For the best overall hack across all tracks." />
                    <PrizeCard title="Best Student Team" value="$10,000" detail="Awarded to the strongest all-student team." />
                    <PrizeCard title="Social Impact" value="$7,500" detail="For projects maximising community & environmental impact." />
                    <PrizeCard title="Best First-time Hacker" value="$5,000" detail="Celebrating newcomers shipping in public." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "people" && (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">People</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Judges, mentors and organizers you&apos;ll meet at this hackathon.
                </p>
                <div className="mt-3 grid gap-3 text-xs md:grid-cols-2">
                  <PersonCard role="Judge" name="Tech industry expert" detail="Evaluates main-round finalists on technical depth." />
                  <PersonCard role="Judge" name="Product manager" detail="Focuses on feasibility & real-world adoption." />
                  <PersonCard role="Mentor" name="Senior developer" detail="Office hours for teams building innovative solutions." />
                  <PersonCard role="Organizer" name="College hack club" detail="Runs student operations and on-ground logistics." />
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">
                  Schedule
                </h2>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  <li>
                    <strong>Day 0</strong> · Check-in, verification helpdesk, team
                    formation.
                  </li>
                  <li>
                    <strong>Day 1</strong> · Opening ceremony, sponsor pitches,
                    hacking starts.
                  </li>
                  <li>
                    <strong>Day 2</strong> · Round 1 PPT deadline, shortlisting, tech
                    talks.
                  </li>
                  <li>
                    <strong>Day 3</strong> · Final demos, main-round judging, results
                    & closing.
                  </li>
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Get started
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                First, create your account and complete student verification. Once
                approved, you can register your team and select a problem statement.
              </p>
              <Link
                href="/signup"
                className="mt-3 inline-flex rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Sign up & verify →
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

type SectionCardProps = {
  title: string;
  subtitle: string;
  items: string[];
  footer: string;
  status: "complete" | "in-progress" | "pending" | "info";
  onToggle?: () => void;
  actionLabel?: string;
  required?: boolean;
};

function SectionCard({
  title,
  subtitle,
  items,
  footer,
  status,
  onToggle,
  actionLabel,
  required,
}: SectionCardProps) {
  const statusLabel =
    status === "complete"
      ? "Completed"
      : status === "in-progress"
      ? "In progress"
      : status === "pending"
      ? "Pending"
      : "Optional";

  const statusColor =
    status === "complete"
      ? "text-emerald-700 bg-emerald-50"
      : status === "in-progress"
      ? "text-amber-700 bg-amber-50"
      : status === "pending"
      ? "text-slate-600 bg-slate-100"
      : "text-sky-700 bg-sky-50";

  const badge =
    status === "complete"
      ? "✓"
      : status === "in-progress"
      ? "•"
      : status === "pending"
      ? "○"
      : "☆";

  return (
    <details className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 open:ring-blue-100">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              {badge}
            </span>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            {required && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                Required
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor}`}
        >
          {statusLabel}
        </span>
      </summary>
      <div className="mt-3 space-y-2 text-xs text-slate-600">
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
          {footer}
        </p>
        {onToggle && actionLabel && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggle();
            }}
            className="mt-1 inline-flex rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-black"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </details>
  );
}

type PrizeCardProps = { title: string; value: string; detail: string };

function PrizeCard({ title, value, detail }: PrizeCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-[11px] text-slate-600">{detail}</p>
    </div>
  );
}

type PersonCardProps = { role: string; name: string; detail: string };

function PersonCard({ role, name, detail }: PersonCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {role}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{name}</p>
      <p className="mt-1 text-[11px] text-slate-600">{detail}</p>
    </div>
  );
}

// Verification Section Component
type VerificationData = {
  collegeIdFile: File | null;
  aadhaar: string;
  selfieCaptured: boolean;
  otp: string;
  otpVerified: boolean;
};

function VerificationSection({
  data,
  onChange,
}: {
  data: VerificationData;
  onChange: (data: VerificationData) => void;
}) {
  const isComplete =
    data.collegeIdFile !== null &&
    data.aadhaar.length >= 4 &&
    data.selfieCaptured &&
    data.otpVerified;

  const handleSendOTP = () => {
    // Simulate OTP sending
    alert("OTP sent to your registered email/phone!");
  };

  const handleVerifyOTP = () => {
    if (data.otp.length === 6) {
      onChange({ ...data, otpVerified: true });
      alert("OTP verified successfully!");
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 flex-shrink-0">
              {isComplete ? "✓" : "○"}
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Student verification</h2>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 whitespace-nowrap">
              Required
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Verify you are a genuine student</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
            isComplete ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {isComplete ? "Completed" : "Pending"}
        </span>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Upload College ID Card
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange({ ...data, collegeIdFile: file });
            }}
            className="w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          {data.collegeIdFile && (
            <p className="mt-2 text-sm font-medium text-emerald-700">✓ {data.collegeIdFile.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Aadhaar Number (last 4 digits will be stored)
          </label>
          <input
            type="text"
            maxLength={12}
            value={data.aadhaar}
            onChange={(e) => onChange({ ...data, aadhaar: e.target.value.replace(/\D/g, "") })}
            placeholder="Enter 12-digit Aadhaar"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {data.aadhaar.length >= 4 && (
            <p className="mt-2 text-sm text-slate-700">
              Masked: XXXX-XXXX-<span className="font-mono font-semibold">{data.aadhaar.slice(-4)}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Capture Live Selfie
          </label>
          <button
            onClick={() => {
              onChange({ ...data, selfieCaptured: true });
              alert("Selfie captured! (In production, this would use your camera)");
            }}
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:border-blue-500"
          >
            {data.selfieCaptured ? "✓ Selfie Captured" : "Open Camera & Capture"}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            OTP Verification
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              maxLength={6}
              value={data.otp}
              onChange={(e) => onChange({ ...data, otp: e.target.value.replace(/\D/g, "") })}
              placeholder="Enter 6-digit OTP"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSendOTP}
                className="flex-1 sm:flex-none rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:border-blue-500 whitespace-nowrap"
              >
                Send OTP
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={data.otp.length !== 6}
                className="flex-1 sm:flex-none rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Verify
              </button>
            </div>
          </div>
          {data.otpVerified && (
            <p className="mt-2 text-sm font-semibold text-emerald-700">✓ OTP verified successfully</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Registration Section Component
type RegistrationData = {
  teamName: string;
  problemStatement: string;
  round1PPT: File | null;
};

function RegistrationSection({
  data,
  onChange,
}: {
  data: RegistrationData;
  onChange: (data: RegistrationData) => void;
}) {
  const problemStatements = [
    "Build an AI-powered learning assistant",
    "Create a sustainable energy monitoring system",
    "Develop a healthcare accessibility platform",
    "Design a smart campus management solution",
    "Build a financial literacy app for students",
  ];

  const isComplete =
    data.teamName.length > 0 &&
    data.problemStatement.length > 0 &&
    data.round1PPT !== null;

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 flex-shrink-0">
              {isComplete ? "✓" : "○"}
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Registration & Problem Statement</h2>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 whitespace-nowrap">
              Required
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Create team and select problem statement</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
            isComplete ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {isComplete ? "Completed" : "Pending"}
        </span>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={data.teamName}
            onChange={(e) => onChange({ ...data, teamName: e.target.value })}
            placeholder="Enter your team name"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Select Problem Statement
          </label>
          <select
            value={data.problemStatement}
            onChange={(e) => onChange({ ...data, problemStatement: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Choose a problem statement...</option>
            {problemStatements.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Upload Round 1 PPT
          </label>
          <input
            type="file"
            accept=".ppt,.pptx,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange({ ...data, round1PPT: file });
            }}
            className="w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          {data.round1PPT && (
            <p className="mt-2 text-sm font-medium text-emerald-700">✓ {data.round1PPT.name}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// QR Pass Section Component
function QRPassSection({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 flex-shrink-0">
              {isComplete ? "✓" : "○"}
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">QR Passes: Entry & Meals</h2>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 whitespace-nowrap">
              Required
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Your QR passes will be generated after verification</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
            isComplete ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {isComplete ? "Available" : "Pending Verification"}
        </span>
      </div>

      {isComplete ? (
        <div className="mt-4 p-4 rounded-xl bg-slate-50">
          <p className="text-sm text-slate-700 mb-3 font-medium">
            Your QR passes have been generated! View them in your dashboard.
          </p>
          <Link
            href="/student/pass"
            className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View QR Passes →
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          Complete student verification first to generate your QR passes.
        </p>
      )}
    </div>
  );
}

// AI Compliance Section Component
function AIComplianceSection({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 flex-shrink-0">
              ☆
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">AI & Compliance Checks</h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Optional AI assistance features</p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold bg-sky-50 text-sky-700 whitespace-nowrap flex-shrink-0">
          Optional
        </span>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-900">
            Enable AI-based PPT review assistance and plagiarism detection
          </span>
        </label>
        <p className="mt-2 text-sm text-slate-600">
          This helps judges evaluate submissions more efficiently while maintaining fairness.
        </p>
      </div>
    </div>
  );
}

