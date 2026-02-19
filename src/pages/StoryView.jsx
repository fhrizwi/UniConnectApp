import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <p>Story not found.</p>
        <button type="button" onClick={() => navigate(-1)} className="mt-2 underline">Back</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 z-10">
        <div className="h-full bg-white rounded-r transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10">
        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
        <span className="text-white font-medium">{user.username}</span>
        <button type="button" onClick={() => navigate(-1)} className="ml-auto text-white/90 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <img src={story.image} alt="" className="w-full h-full object-contain" />
    </div>
  );
}
