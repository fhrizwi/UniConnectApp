import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Heart, MessageCircle, SendHorizontal } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

// Helper function to format relative time
function getRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

export default function PostCard({ post }) {
  const { user } = useAuth();
  const { getUser, toggleLike, addComment } = useData();
  const [comment, setComment] = useState("");

  const author = getUser(post.userId);
  const isLiked = !!(user && post.likedBy?.includes(user.id));
  const isTweet = post.isTweet;

  const onComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    addComment(post.id, comment);
    setComment("");
  };

  return (
    <article className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-card-hover ${isTweet ? "p-4" : ""}`}>
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <Link to={`/profile/${post.userId}`} className="flex items-center gap-3">
          <img src={author?.avatar} alt={author?.fullName} className="h-10 w-10 rounded-full border-2 border-slate-100 object-cover" />
          <div>
            <p className="font-semibold text-slate-900">{author?.fullName || post.authorName}</p>
            <p className="text-xs text-slate-500 capitalize">{post.role} · {post.department || "Campus"}</p>
          </div>
        </Link>
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {getRelativeTime(post.createdAt)}
        </span>
      </header>

      {!isTweet && post.imageUrl && (
        <Link to={`/post/${post.id}`}>
          <img src={post.imageUrl} alt={post.title} className="h-72 w-full object-cover" />
        </Link>
      )}

      <div className="space-y-3 p-4">
        {isTweet ? (
          <p className="text-slate-800 whitespace-pre-wrap">{post.content}</p>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
            <p className="text-sm text-slate-700">{post.content}</p>
          </>
        )}

        <div className="flex items-center gap-6 text-sm">
          <button
            type="button"
            onClick={() => toggleLike(post.id)}
            className={`inline-flex items-center gap-1.5 font-semibold transition ${isLiked ? "text-rose-600" : "text-slate-600 hover:text-rose-600"}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            {post.likes}
          </button>
          <Link to={`/post/${post.id}`} className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-indigo-600">
            <MessageCircle className="h-4 w-4" />
            {post.comments?.length || 0}
          </Link>
        </div>

        {post.comments?.length > 0 && (
          <div className="space-y-1 border-t border-slate-100 pt-2">
            {post.comments.slice(-2).map((item) => {
              const commentAuthor = getUser(item.userId);
              return (
                <p key={item.id} className="text-sm text-slate-700">
                  <span className="font-semibold">{commentAuthor?.fullName || item.authorName}: </span>
                  {item.text}
                </p>
              );
            })}
          </div>
        )}

        <form onSubmit={onComment} className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button type="submit" className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            <SendHorizontal className="h-4 w-4" />
            Post
          </button>
        </form>
      </div>
    </article>
  );
}
