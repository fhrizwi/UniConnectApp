import React, { useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Building2, FileCheck, MapPin, PlusCircle, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const eligibleRoles = ["alumni", "faculty", "admin"];

export default function AlumniReferrals() {
  const { user } = useAuth();
  const { referrals, addReferral, applyToReferral } = useData();
  const [form, setForm] = useState({ company: "", role: "", location: "", note: "", eligibilityCriteria: "" });

  const canAdd = eligibleRoles.includes(user?.role);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!canAdd) return;
    addReferral(form);
    setForm({ company: "", role: "", location: "", note: "", eligibilityCriteria: "" });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <BriefcaseBusiness className="h-6 w-6 text-indigo-600" />
          Jobs & Referrals
        </h1>
        <p className="mt-1 text-sm text-slate-500">Apply to opportunities shared by alumni. Check eligibility before applying.</p>
      </div>

      {canAdd && (
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
            <PlusCircle className="h-5 w-5 text-indigo-600" />
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
            <div className="relative md:col-span-2">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={form.location} onChange={onChange("location")} required placeholder="Location" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm" />
            </div>
            <div className="relative md:col-span-2">
              <FileCheck className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea value={form.eligibilityCriteria} onChange={onChange("eligibilityCriteria")} required placeholder="Eligibility criteria (e.g. 3rd/4th year CSE, CGPA ≥ 7.5)" rows={2} className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm" />
            </div>
            <input value={form.note} onChange={onChange("note")} required placeholder="Short note / description" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            <PlusCircle className="h-4 w-4" />
            Add Referral
          </button>
        </form>
      )}

      {!canAdd && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Only alumni, faculty, and admins can post referrals. Students can apply below.
        </p>
      )}

      <div className="space-y-3">
        {referrals.map((referral) => {
          const applied = user && (referral.applicants || []).includes(user.id);
          return (
            <article key={referral.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{referral.company} – {referral.role}</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-600">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {referral.status}
                </span>
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-700">
                <MapPin className="h-4 w-4" />
                {referral.location}
              </p>
              {referral.eligibilityCriteria && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">Eligibility</p>
                  <p className="mt-0.5 text-sm text-slate-700">{referral.eligibilityCriteria}</p>
                </div>
              )}
              <p className="mt-2 text-sm text-slate-600">{referral.note}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
                <UserCheck className="h-3.5 w-3.5" />
                Referred by: {referral.referredBy}
              </p>
              {user && user.role === "student" && (
                <button
                  type="button"
                  onClick={() => applyToReferral(referral.id)}
                  disabled={applied}
                  className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${applied ? "bg-slate-100 text-slate-500 cursor-default" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  <FileCheck className="h-4 w-4" />
                  {applied ? "Applied" : "Apply"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
