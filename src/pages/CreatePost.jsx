import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, MessageSquare, PencilLine, Send, Type } from "lucide-react";
import { useData } from "../context/DataContext";

export default function CreatePost() {
  const navigate = useNavigate();
  const { addPost } = useData();
  const [mode, setMode] = useState("post");
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      if (mode === "tweet") {
        result = await addPost({
          title: "",
          content: form.content.trim() || "What's happening on campus?",
          imageUrl: "",
          isTweet: true,
        });
      } else {
        result = await addPost({
          title: form.title.trim() || "Campus Update",
          content: form.content.trim(),
          imageUrl: form.imageUrl.trim(),
          isTweet: false,
        });
      }
      
      if (result) {
        setForm({ title: "", content: "", imageUrl: "" });
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <PencilLine className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Create</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">Share with your university network.</p>

        <div className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("tweet")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              mode === "tweet" ? "bg-white text-indigo-600 shadow" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Quick Post
          </button>
          <button
            type="button"
            onClick={() => setMode("post")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              mode === "post" ? "bg-white text-indigo-600 shadow" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Type className="h-4 w-4" />
            Full Post
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "post" && (
            <label className="block text-sm font-medium text-slate-700">
              Title
              <input
                value={form.title}
                onChange={onChange("title")}
                placeholder="Workshop Highlights"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          )}

          <label className="block text-sm font-medium text-slate-700">
            {mode === "tweet" ? "What's on your mind?" : "Description"}
            <textarea
              value={form.content}
              onChange={onChange("content")}
              rows={mode === "tweet" ? 3 : 5}
              required
              placeholder={mode === "tweet" ? "Share a quick update..." : "Write your post details here"}
              maxLength={mode === "tweet" ? 280 : undefined}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            {mode === "tweet" && <p className="mt-1 text-right text-xs text-slate-500">{form.content.length}/280</p>}
          </label>

          {mode === "post" && (
            <label className="block text-sm font-medium text-slate-700">
              <span className="inline-flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                Image URL (optional)
              </span>
              <input
                value={form.imageUrl}
                onChange={onChange("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {mode === "tweet" ? "Post" : "Publish"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
