import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, MessageSquare, Sparkles, ThumbsUp } from "lucide-react";
import { useData } from "../context/DataContext";

function iconByType(type) {
  if (type === "comment") return MessageSquare;
  if (type === "like") return ThumbsUp;
  return Sparkles;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAllNotificationsRead } = useData();

  useEffect(() => {
    markAllNotificationsRead();
  }, [markAllNotificationsRead]);

  const handleNotificationClick = (notification) => {
    if (notification.navigation) {
      const { type, userId, postId } = notification.navigation;
      
      if (type === "profile" && userId) {
        navigate(`/profile/${userId}`);
      } else if (type === "post" && postId) {
        navigate(`/post/${postId}`);
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
        <BellRing className="h-6 w-6 text-indigo-600" />
        Notifications
      </h1>
      <p className="mt-1 text-sm text-slate-500">Campus activity alerts and engagement updates.</p>

      <div className="mt-6 space-y-3">
        {notifications.map((item) => {
          const Icon = iconByType(item.type);
          const isClickable = item.navigation;
          
          return (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                item.read 
                  ? "border-slate-200 bg-slate-50 hover:bg-slate-100" 
                  : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
              } ${isClickable ? 'hover:shadow-md' : ''}`}
            >
              <p className="inline-flex items-center gap-2 text-sm text-slate-800">
                <Icon className="h-4 w-4 text-indigo-600" />
                {item.text}
                {isClickable && <span className="text-xs text-indigo-600 ml-2">→ Click to view</span>}
              </p>
              <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}