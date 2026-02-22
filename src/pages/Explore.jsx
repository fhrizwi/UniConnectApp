import React from "react";
import { Link } from "react-router-dom";
import { Compass, Hash, Image as ImageIcon, UserPlus, UserCheck } from "lucide-react";
import { useData } from "../context/DataContext";

export default function Explore() {
  const { posts, hashtags, getSuggestedUsers, connectUser, isUserConnected } = useData();
  const imagePosts = posts.filter((p) => p.imageUrl);
  const suggestedUsers = getSuggestedUsers().slice(0, 8); // Show max 8 users

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Compass className="h-6 w-6 text-indigo-600" />
          Explore
        </h1>
        <p className="mt-1 text-sm text-slate-500">Discover posts and trending topics across campus.</p>
      </div>

      {/* Suggested Users Section */}
      {suggestedUsers.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <UserPlus className="h-5 w-5 text-indigo-600" />
            Connect with People
          </h2>
          <div className="mt-4 overflow-x-auto">
            <div className="grid grid-cols-2 gap-4 min-w-max">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                  <Link 
                    to={`/profile/${user.id}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.fullName} 
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <p className="font-medium text-slate-900 text-sm hover:text-indigo-600 transition">{user.fullName}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      connectUser(user.id);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isUserConnected(user.id)
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isUserConnected(user.id) ? (
                      <>
                        <UserCheck className="h-3.5 w-3.5" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {hashtags && hashtags.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <Hash className="h-5 w-5 text-indigo-600" />
            Trending
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {hashtags.map((h) => (
              <span
                key={h.tag}
                className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 cursor-pointer transition"
              >
                #{h.tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <ImageIcon className="h-5 w-5 text-indigo-600" />
          Discover
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
          {imagePosts.length === 0 ? (
            <p className="col-span-full py-8 text-center text-slate-500">No posts to explore yet.</p>
          ) : (
            imagePosts.map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className="group block aspect-square overflow-hidden rounded-xl">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover transition group-hover:scale-110"
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
