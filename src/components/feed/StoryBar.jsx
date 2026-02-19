import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function StoryBar() {
  const { stories, users, getUser } = useData();
  const { user } = useAuth();

  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-4 -mx-4 scrollbar-hide bg-white border-b border-slate-100">
      {/* Your story (add) */}
      {user && (
        <Link to="/create" className="flex-shrink-0 flex flex-col items-center gap-1">
          <div className="relative w-16 h-16 rounded-full p-[3px] bg-slate-200 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden">
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</span>
          </div>
          <span className="text-xs text-slate-600 font-medium truncate max-w-[72px]">Your story</span>
        </Link>
      )}
      {stories.slice(0, 8).map((story) => {
        const u = getUser(story.userId);
        if (!u) return null;
        return (
          <Link key={story.id} to={`/story/${story.id}`} className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                <img src={story.image} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <span className="text-xs text-slate-700 font-medium truncate max-w-[72px]">{u.username}</span>
          </Link>
        );
      })}
    </div>
  );
}
