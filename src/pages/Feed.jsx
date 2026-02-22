import React from "react";
import { Activity, CalendarClock, TrendingUp, Users } from "lucide-react";
import StoryBar from "../components/feed/StoryBar";
import PostCard from "../components/feed/PostCard";
import { useData } from "../context/DataContext";

export default function Feed() {
  const { posts, loadingPosts, feedError, hashtags } = useData();

  // Ensure posts are sorted by latest first (defensive sorting)
  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <StoryBar />
        </div>

        {loadingPosts && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">Loading feed...</p>}
        {feedError && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{feedError}</p>}

        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <aside className="hidden space-y-4 lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <CalendarClock className="h-4 w-4 text-indigo-600" />
              Today on campus
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-lg bg-slate-50 px-3 py-2">Career Fair registrations close tonight.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2">Hackathon shortlist at 6 PM.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2">Alumni mentorship slots open.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              Trending
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {hashtags?.slice(0, 5).map((h) => (
                <span key={h.tag} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100 cursor-pointer">
                  #{h.tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <Activity className="h-4 w-4 text-indigo-600" />
              Quick stats
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-3">
                <p className="inline-flex items-center gap-1 text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Posts
                </p>
                <p className="text-xl font-bold text-indigo-700">{sortedPosts.length}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-3">
                <p className="inline-flex items-center gap-1 text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  Active
                </p>
                <p className="text-xl font-bold text-amber-700">482</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
