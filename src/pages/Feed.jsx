import React from "react";
import { Activity, CalendarClock, Newspaper, TrendingUp, Users } from "lucide-react";
import PostCard from "../components/feed/PostCard";
import { useData } from "../context/DataContext";

export default function Feed() {
  const { posts, loadingPosts, feedError } = useData();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-emerald-700" />
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Feed</h1>
          </div>
          <p className="text-sm text-slate-600">
            Dynamic posts from JSONPlaceholder + your campus activities.
          </p>
        </div>

        {loadingPosts && <p className="rounded-xl border border-slate-200 bg-white p-4 text-slate-600">Loading feed...</p>}
        {feedError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{feedError}</p>}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <CalendarClock className="h-4 w-4 text-emerald-700" />
            Today on campus
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Career Fair registrations close tonight.</li>
            <li>Hackathon shortlist announced at 6 PM.</li>
            <li>Alumni mentorship slots now open.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <Activity className="h-4 w-4 text-emerald-700" />
            Quick stats
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="inline-flex items-center gap-1 text-slate-500">
                <TrendingUp className="h-3.5 w-3.5" />
                Feed posts
              </p>
              <p className="text-lg font-bold text-slate-900">{posts.length}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="inline-flex items-center gap-1 text-slate-500">
                <Users className="h-3.5 w-3.5" />
                Active now
              </p>
              <p className="text-lg font-bold text-slate-900">482</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}