import React from "react";
import { Link } from "react-router-dom";
import { Compass, Image as ImageIcon } from "lucide-react";
import { useData } from "../context/DataContext";

export default function Explore() {
  const { posts } = useData();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Compass className="h-6 w-6 text-emerald-700" />
          Explore
        </h1>
        <p className="mt-1 text-sm text-slate-500">Discover trending visual posts across UniConnect.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img src={post.imageUrl} alt={post.title} className="h-40 w-full object-cover" />
            <div className="flex items-center gap-1 border-t border-slate-100 px-2 py-1.5 text-xs text-slate-600">
              <ImageIcon className="h-3.5 w-3.5" />
              Open post
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}