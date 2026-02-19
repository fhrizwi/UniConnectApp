import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Heart, MessageCircle, SendHorizontal } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const { getUser, toggleLike, addComment } = useData();
  const [comment, setComment] = useState("");

  const author = getUser(post.userId);
  const isLiked = !!(user && post.likedBy.includes(user.id));

  const onComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      return;
    }

    addComment(post.id, comment);
    setComment("");
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <Link to={`/profile/${post.userId}`} className="flex items-center gap-3">
          <img src={author?.avatar} alt={author?.fullName} className="h-10 w-10 rounded-full border border-slate-200" />
          <div>
            <p className="font-semibold text-slate-900">{author?.fullName || post.authorName}</p>
            <p className="text-xs uppercase text-slate-500">{post.role}</p>
          </div>
        </Link>
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </header>

      <img src={post.imageUrl} alt={post.title} className="h-64 w-full object-cover" />

      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
        <p className="text-sm text-slate-700">{post.content}</p>

        <div className="flex items-center gap-5 text-sm">
          <button
            type="button"
            onClick={() => toggleLike(post.id)}
            className={`inline-flex items-center gap-1 font-semibold ${isLiked ? "text-rose-600" : "text-slate-700"}`}
          >
            <Heart className="h-4 w-4" />
            {isLiked ? "Unlike" : "Like"} ({post.likes})
          </button>
          <Link to={`/post/${post.id}`} className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <MessageCircle className="h-4 w-4" />
            Comments ({post.comments.length})
          </Link>
        </div>

        <div className="space-y-1">
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

        <form onSubmit={onComment} className="flex gap-2">
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a comment"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <button type="submit" className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            <SendHorizontal className="h-4 w-4" />
            Post
          </button>
        </form>
      </div>
    </article>
  );
}