import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export default function StoryBar() {
  const { user } = useAuth();
  const { stories, getUser } = useData();

  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-1 -mx-1 scrollbar-hide">
      {user && (
        <Link to="/create" className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="relative w-16 h-16 rounded-full p-[3px] bg-slate-200 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
              <Plus className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-600 truncate max-w-[72px]">Your story</span>
        </Link>
      )}
      {stories.slice(0, 8).map((story) => {
        const u = getUser(story.userId);
        if (!u) return null;
        return (
          <Link key={story.id} to={`/story/${story.id}`} className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                <img src={story.imageUrl} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 truncate max-w-[72px]">{u.fullName?.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}
