import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, PencilLine, Send, Type } from "lucide-react";
import { useData } from "../context/DataContext";

export default function CreatePost() {
  const navigate = useNavigate();
  const { addPost } = useData();
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    addPost({
      title: form.title.trim() || "Campus Update",
      content: form.content.trim(),
      imageUrl: form.imageUrl.trim(),
    });
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <PencilLine className="h-5 w-5 text-emerald-700" />
        <h1 className="text-2xl font-bold text-slate-900">Create Post</h1>
      </div>
      <p className="mt-1 text-sm text-slate-500">Share updates with your university network.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-1">
            <Type className="h-4 w-4" />
            Title
          </span>
          <input
            value={form.title}
            onChange={onChange("title")}
            placeholder="Workshop Highlights"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-1">
            <PencilLine className="h-4 w-4" />
            Description
          </span>
          <textarea
            value={form.content}
            onChange={onChange("content")}
            rows={5}
            required
            placeholder="Write your post details here"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            Image URL (optional)
          </span>
          <input
            value={form.imageUrl}
            onChange={onChange("imageUrl")}
            placeholder="https://example.com/image.jpg"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">
          <Send className="h-4 w-4" />
          Publish Post
        </button>
      </form>
    </div>
  );
}