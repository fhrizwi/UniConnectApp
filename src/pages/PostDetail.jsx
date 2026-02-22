import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, MessageCircle, SendHorizontal } from "lucide-react";
import { useData } from "../context/DataContext";

export default function PostDetail() {
  const { postId } = useParams();
  const { posts, getUser, addComment, toggleLike } = useData();
  const [comment, setComment] = useState("");

  const post = posts.find((item) => item.id === postId);

  if (!post) {
    return <p className="rounded-xl border border-slate-200 bg-white p-4">Post not found.</p>;
  }

  const author = getUser(post.userId);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      return;
    }
    addComment(post.id, comment);
    setComment("");
  };

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-100 p-4">
        <img src={author?.avatar} alt={author?.fullName} className="h-11 w-11 rounded-full border border-slate-200" />
        <div>
          <Link to={`/profile/${post.userId}`} className="font-semibold text-slate-900 hover:underline">
            {author?.fullName || post.authorName}
          </Link>
          <p className="text-xs uppercase text-slate-500">{post.role}</p>
        </div>
      </header>

      {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="h-80 w-full object-cover" />}

      <div className="space-y-4 p-5">
        {post.title && <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>}
        <p className="text-slate-700">{post.content}</p>

        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
        >
          <Heart className="h-4 w-4" />
          Like ({post.likes})
        </button>

        <section>
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
            <MessageCircle className="h-5 w-5 text-indigo-600" />
            Comments
          </h2>
          <div className="mt-3 space-y-2">
            {post.comments.length === 0 && <p className="text-sm text-slate-500">No comments yet.</p>}
            {post.comments.map((item) => {
              const commentAuthor = getUser(item.userId);
              return (
                <p key={item.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <span className="font-semibold">{commentAuthor?.fullName || item.authorName}: </span>
                  {item.text}
                </p>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a comment"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button type="submit" className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              <SendHorizontal className="h-4 w-4" />
              Comment
            </button>
          </form>
        </section>
      </div>
    </article>
  );
}