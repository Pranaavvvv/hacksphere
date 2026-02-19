"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Users, FileText, Award, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, Settings, Eye } from "lucide-react"

export default function OrganizerDashboard() {
  const router = useRouter()
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is organizer
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("hacksphere_role")
      const authToken = localStorage.getItem("hacksphere_auth_token")
      
      if (!authToken || role !== "organizer") {
        router.push("/auth")
      }
    }
  }, [router])

  // Mock data - in real app, fetch from API
  const overallStats = {
    totalHackathons: 3,
    totalParticipants: 1247,
    totalSubmissions: 342,
    activeEvents: 1,
    completedEvents: 2,
    pendingVerifications: 23,
    averageScore: 84.5,
  }

  const myHackathons = [
    {
      id: "campushack-2026",
      name: "CampusHack 2026",
      theme: "Open Innovation",
      status: "Active",
      participants: 142,
      submissions: 89,
      verified: 138,
      pending: 4,
      startDate: "2026-03-15",
      endDate: "2026-03-17",
      daysRemaining: 2,
      topScore: 93,
      averageScore: 84.5,
      shortlisted: 36,
      judges: 5,
      sponsors: 3,
    },
    {
      id: "ai-ignite-2026",
      name: "AI Ignite 2026",
      theme: "AI x Education",
      status: "Completed",
      participants: 856,
      submissions: 198,
      verified: 856,
      pending: 0,
      startDate: "2026-01-10",
      endDate: "2026-01-12",
      daysRemaining: 0,
      topScore: 96,
      averageScore: 87.2,
      shortlisted: 79,
      judges: 8,
      sponsors: 5,
    },
    {
      id: "blockchain-sprint-2026",
      name: "Blockchain Sprint 2026",
      theme: "Web3 & DeFi",
      status: "Upcoming",
      participants: 249,
      submissions: 0,
      verified: 226,
      pending: 23,
      startDate: "2026-04-20",
      endDate: "2026-04-22",
      daysRemaining: 45,
      topScore: 0,
      averageScore: 0,
      shortlisted: 0,
      judges: 3,
      sponsors: 2,
    },
  ]

  const recentActivity = [
    { type: "submission", message: "New submission from Team Zero Knowledge Ninjas", time: "5 min ago", hackathon: "CampusHack 2026" },
    { type: "verification", message: "23 students verified in last hour", time: "1 hour ago", hackathon: "Blockchain Sprint 2026" },
    { type: "judge", message: "Judge scores updated for CampusHack 2026", time: "2 hours ago", hackathon: "CampusHack 2026" },
    { type: "shortlist", message: "Top 40% teams shortlisted for final round", time: "3 hours ago", hackathon: "CampusHack 2026" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700"
      case "Completed":
        return "bg-slate-50 text-slate-700"
      case "Upcoming":
        return "bg-blue-50 text-blue-700"
      default:
        return "bg-slate-50 text-slate-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Clock className="w-3 h-3" />
      case "Completed":
        return <CheckCircle className="w-3 h-3" />
      case "Upcoming":
        return <Calendar className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 md:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Organizer Dashboard
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Manage your hackathons, evaluate submissions, and track participants.
          </p>
        </div>
        <Link
          href="/organizer/create"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <span>+</span>
          Create New Hackathon
        </Link>
      </header>

      {/* Overall Statistics */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Participants"
          value={overallStats.totalParticipants.toLocaleString()}
          trend="+12%"
          color="blue"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Submissions"
          value={overallStats.totalSubmissions.toLocaleString()}
          trend="+8%"
          color="purple"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Active Events"
          value={overallStats.activeEvents.toString()}
          trend=""
          color="emerald"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Avg Score"
          value={overallStats.averageScore.toFixed(1)}
          trend="+2.3"
          color="amber"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Completed"
          value={overallStats.completedEvents.toString()}
          trend=""
          color="slate"
        />
        <StatCard
          icon={<AlertCircle className="w-5 h-5" />}
          label="Pending Review"
          value={overallStats.pendingVerifications.toString()}
          trend=""
          color="rose"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Total Events"
          value={overallStats.totalHackathons.toString()}
          trend=""
          color="indigo"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hackathons List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Your Hackathons</h2>
            <span className="text-sm text-slate-500">{myHackathons.length} total</span>
          </div>

          {myHackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-all"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {hackathon.name}
                    </h3>
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(hackathon.status)}`}>
                      {getStatusIcon(hackathon.status)}
                      {hackathon.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{hackathon.theme}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                    </span>
                    {hackathon.status === "Active" && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Clock className="w-3 h-3" />
                        {hackathon.daysRemaining} days remaining
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Participants</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{hackathon.participants}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {hackathon.verified} verified
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Submissions</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{hackathon.submissions}</p>
                  {hackathon.status === "Active" && (
                    <p className="mt-0.5 text-[10px] text-emerald-600">
                      {hackathon.shortlisted} shortlisted
                    </p>
                  )}
                </div>
                {hackathon.status !== "Upcoming" && (
                  <>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Top Score</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{hackathon.topScore || "—"}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Avg: {hackathon.averageScore || "—"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Judges</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{hackathon.judges}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {hackathon.sponsors} sponsors
                      </p>
                    </div>
                  </>
                )}
                {hackathon.status === "Upcoming" && (
                  <>
                    <div className="rounded-xl bg-amber-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">Pending</p>
                      <p className="mt-1 text-lg font-semibold text-amber-900">{hackathon.pending}</p>
                      <p className="mt-0.5 text-[10px] text-amber-600">
                        Verifications
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Days Left</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{hackathon.daysRemaining}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Until start
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Progress Bar for Active Events */}
              {hackathon.status === "Active" && (
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                    <span>Evaluation Progress</span>
                    <span>{Math.round((hackathon.submissions / hackathon.participants) * 100)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${Math.min((hackathon.submissions / hackathon.participants) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {hackathon.status === "Active" && (
                  <>
                    <Link
                      href={`/organizer/judge/${hackathon.id}`}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Judge Submissions
                    </Link>
                    <Link
                      href={`/hackathons/${hackathon.id}`}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </>
                )}
                {hackathon.status === "Completed" && (
                  <>
                    <Link
                      href={`/organizer/judge/${hackathon.id}`}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Results
                    </Link>
                    <Link
                      href={`/hackathons/${hackathon.id}`}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                  </>
                )}
                {hackathon.status === "Upcoming" && (
                  <>
                    <Link
                      href={`/hackathons/${hackathon.id}`}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Event
                    </Link>
                    <Link
                      href={`/hackathons/${hackathon.id}`}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {myHackathons.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No hackathons yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Create your first hackathon to get started
              </p>
              <Link
                href="/organizer/create"
                className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create Hackathon
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Recent Activity */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    {activity.type === "submission" && <FileText className="w-4 h-4 text-blue-600" />}
                    {activity.type === "verification" && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    {activity.type === "judge" && <BarChart3 className="w-4 h-4 text-purple-600" />}
                    {activity.type === "shortlist" && <Award className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span className="truncate">{activity.hackathon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              View All Activity
            </button>
          </section>

          {/* Quick Stats */}
          <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="mb-4 text-base font-semibold">Quick Insights</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs opacity-90">Total Events Created</p>
                <p className="mt-1 text-2xl font-bold">{overallStats.totalHackathons}</p>
              </div>
              <div>
                <p className="text-xs opacity-90">Success Rate</p>
                <p className="mt-1 text-2xl font-bold">
                  {Math.round((overallStats.completedEvents / overallStats.totalHackathons) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-xs opacity-90">Avg Participants/Event</p>
                <p className="mt-1 text-2xl font-bold">
                  {Math.round(overallStats.totalParticipants / overallStats.totalHackathons)}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/organizer/create"
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>+</span>
                  Create New Hackathon
                </span>
                <span>→</span>
              </Link>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </span>
                <span>→</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Manage Participants
                </span>
                <span>→</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </span>
                <span>→</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: string
  trend?: string
  color: "blue" | "purple" | "emerald" | "amber" | "slate" | "rose" | "indigo"
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-50 text-slate-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className={`mb-2 inline-flex rounded-lg p-2 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
