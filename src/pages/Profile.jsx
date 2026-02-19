import React from "react";
import { useParams } from "react-router-dom";
import { Briefcase, FileText, GraduationCap, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { users, posts } = useData();

  const profile = userId ? users.find((u) => u.id === userId) : user;

  if (!profile) {
    return <p className="rounded-xl border border-slate-200 bg-white p-4">Profile not found.</p>;
  }

  const userPosts = posts.filter((post) => post.userId === profile.id);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img src={profile.avatar} alt={profile.fullName} className="h-20 w-20 rounded-full border border-slate-200" />
          <div>
            <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
              <UserCircle2 className="h-6 w-6 text-emerald-700" />
              {profile.fullName}
            </h1>
            <p className="inline-flex items-center gap-2 text-sm text-slate-600">
              <GraduationCap className="h-4 w-4" />
              {profile.department} | {profile.year}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
              <Briefcase className="h-3.5 w-3.5" />
              {profile.role}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
          <FileText className="h-5 w-5 text-emerald-700" />
          Posts by {profile.fullName}
        </h2>
        <div className="mt-4 space-y-3">
          {userPosts.length === 0 && <p className="text-sm text-slate-500">No posts yet.</p>}
          {userPosts.map((post) => (
            <article key={post.id} className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{post.content}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}