import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useData } from "../context/DataContext";

export default function StoryView() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { stories, getUser } = useData();
  const [progress, setProgress] = useState(0);

  const story = stories.find((s) => s.id === storyId);
  const user = story ? getUser(story.userId) : null;

  useEffect(() => {
    if (!story) return;
    const duration = 5000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed < duration) requestAnimationFrame(tick);
      else navigate(-1);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [story, navigate]);

  if (!story || !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 text-white">
        <p>Story not found.</p>
        <button type="button" onClick={() => navigate(-1)} className="mt-2 underline">Back</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900">
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
        <div className="h-full bg-white rounded-r transition-all duration-75" style={{ width: `${progress}%` }} />
      </div>
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
        <img src={user.avatar} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
        <span className="font-medium text-white">{user.fullName}</span>
        <button type="button" onClick={() => navigate(-1)} className="ml-auto rounded-full p-2 text-white/90 hover:bg-white/20">
          <X className="h-5 w-5" />
        </button>
      </div>
      <img src={story.imageUrl} alt="" className="h-full w-full object-contain" />
    </div>
  );
}
