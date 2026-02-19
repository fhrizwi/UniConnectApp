import React from "react";
import { Tags, UserPlus2, Users } from "lucide-react";
import { useData } from "../context/DataContext";

export default function Groups() {
  const { groups, joinGroup } = useData();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Users className="h-6 w-6 text-emerald-700" />
          Groups and Communities
        </h1>
        <p className="mt-1 text-sm text-slate-500">Join campus groups based on interests, projects, and careers.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article key={group.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              <Tags className="h-3.5 w-3.5" />
              {group.category}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{group.name}</h2>
            <p className="mt-1 text-sm text-slate-700">{group.about}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              Members: {group.members}
            </p>
            <button
              type="button"
              onClick={() => joinGroup(group.id)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <UserPlus2 className="h-4 w-4" />
              Join Group
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}