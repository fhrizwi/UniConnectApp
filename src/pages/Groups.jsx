import React from "react";
import { useNavigate } from "react-router-dom";
import { Tags, UserPlus2, Users } from "lucide-react";
import { useData } from "../context/DataContext";

export default function Groups() {
  const navigate = useNavigate();
  const { groups, joinGroup } = useData();

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Users className="h-6 w-6 text-indigo-600" />
          Groups & Communities
        </h1>
        <p className="mt-1 text-sm text-slate-500">Join campus groups based on interests, projects, and careers.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article 
            key={group.id} 
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-card-hover cursor-pointer"
            onClick={() => handleGroupClick(group.id)}
          >
            <div className="aspect-[3/2] overflow-hidden">
              <img src={group.cover} alt={group.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                <Tags className="h-3.5 w-3.5" />
                {group.category}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{group.name}</h2>
              <p className="mt-1 text-sm text-slate-700">{group.about}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="inline-flex items-center gap-1 text-sm text-slate-500">
                  <Users className="h-4 w-4" />
                  {group.members} members
                </p>
                <span className="text-xs text-indigo-600 font-medium">Click for details →</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  joinGroup(group.id);
                }}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <UserPlus2 className="h-4 w-4" />
                Join Group
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
