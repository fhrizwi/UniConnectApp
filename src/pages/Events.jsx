import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Video } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function Events() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, participateEvent } = useData();

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Calendar className="h-6 w-6 text-indigo-600" />
          Campus Events
        </h1>
        <p className="mt-1 text-sm text-slate-500">Discover events and participate online as a student.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const participating = user && (event.participants || []).includes(user.id);
          const participantCount = (event.participants || []).length;
          return (
            <article 
              key={event.id} 
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-card-hover cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={event.cover} alt={event.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-slate-900">{event.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    {event.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4 text-indigo-500" />
                    {event.attendees + participantCount} going
                  </span>
                  {event.mode === "Online" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <Video className="h-3.5 w-3.5" />
                      Online
                    </span>
                  )}
                  {event.mode === "Hybrid" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                      <Video className="h-3.5 w-3.5" />
                      Hybrid
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      user && participateEvent(event.id);
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      participating
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {participating ? "Participating" : "Participate"}
                  </button>
                  <span className="text-xs text-indigo-600 font-medium">Click for details →</span>
                </div>
                {participantCount > 0 && (
                  <p className="mt-2 text-xs text-slate-500">{participantCount} student(s) participating</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
