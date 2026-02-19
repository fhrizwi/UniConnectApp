import React, { useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Building2, MapPin, PlusCircle, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const eligibleRoles = ["alumni", "faculty", "admin"];

export default function AlumniReferrals() {
  const { user } = useAuth();
  const { referrals, addReferral } = useData();
  const [form, setForm] = useState({ company: "", role: "", location: "", note: "" });

  const canAdd = eligibleRoles.includes(user?.role);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!canAdd) {
      return;
    }

    addReferral(form);
    setForm({ company: "", role: "", location: "", note: "" });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <BriefcaseBusiness className="h-6 w-6 text-emerald-700" />
          Alumni Referral Module
        </h1>
        <p className="mt-1 text-sm text-slate-500">Career opportunities shared by alumni and mentors.</p>
      </div>

      {canAdd && (
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
            <PlusCircle className="h-5 w-5 text-emerald-700" />
            Post referral opportunity
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={form.company} onChange={onChange("company")} required placeholder="Company" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm" />
            </div>
            <div className="relative">
              <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={form.role} onChange={onChange("role")} required placeholder="Role" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm" />
            </div>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={form.location} onChange={onChange("location")} required placeholder="Location" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm" />
            </div>
            <input value={form.note} onChange={onChange("note")} required placeholder="Short note" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            <PlusCircle className="h-4 w-4" />
            Add Referral
          </button>
        </form>
      )}

      {!canAdd && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Only alumni, faculty, and admins can post referrals.
        </p>
      )}

      <div className="space-y-3">
        {referrals.map((referral) => (
          <article key={referral.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{referral.company} - {referral.role}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {referral.status}
              </span>
            </div>
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-700">
              <MapPin className="h-4 w-4" />
              {referral.location}
            </p>
            <p className="mt-1 text-sm text-slate-600">{referral.note}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
              <UserCheck className="h-3.5 w-3.5" />
              Referred by: {referral.referredBy}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}