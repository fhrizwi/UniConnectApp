import React from "react";
import { BarChart3, LineChart, ShieldCheck } from "lucide-react";
import { useData } from "../context/DataContext";

export default function AdminDashboard() {
  const { analytics } = useData();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <ShieldCheck className="h-6 w-6 text-emerald-700" />
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">Platform analytics for UniConnect operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Users" value={analytics.activeUsers} icon={LineChart} />
        <StatCard label="Posts Today" value={analytics.postsToday} icon={BarChart3} />
        <StatCard label="Engagement %" value={`${analytics.engagementRate}%`} icon={LineChart} />
        <StatCard label="New Groups" value={analytics.newGroups} icon={BarChart3} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
          <BarChart3 className="h-5 w-5 text-emerald-700" />
          Role Distribution
        </h2>
        <div className="mt-4 space-y-3">
          {analytics.roleDistribution.map((item) => {
            const width = Math.min(100, Math.round((item.count / analytics.activeUsers) * 100));
            return (
              <div key={item.role}>
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>{item.role}</span>
                  <span>{item.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="inline-flex items-center gap-1 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </article>
  );
}