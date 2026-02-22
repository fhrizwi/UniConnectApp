import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Video, Clock, DollarSign, ArrowLeft, Tag, User, Info, Users2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Payment from "../components/Payment";

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, participateEvent } = useData();
  const [showPayment, setShowPayment] = useState(false);
  const [participationType, setParticipationType] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [teamMembers, setTeamMembers] = useState([""]);

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Event Not Found</h1>
          <p className="mt-2 text-slate-500">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/events")}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const participating = user && (event.participants || []).includes(user.id);
  const participantCount = (event.participants || []).length;

  const handleParticipate = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // If event is free, participate directly
    if (event.isFree) {
      participateEvent(event.id);
      return;
    }

    // For paid events, check if participation type is selected
    if (event.participationType === "both" && !participationType) {
      alert("Please select participation type (Individual or Team)");
      return;
    }

    // Show payment modal
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    participateEvent(event.id);
  };

  const handleTeamSizeChange = (newSize) => {
    setTeamSize(newSize);
    // Adjust team members array
    const currentMembers = [...teamMembers];
    if (newSize > currentMembers.length) {
      // Add empty slots
      for (let i = currentMembers.length; i < newSize; i++) {
        currentMembers.push("");
      }
    } else {
      // Remove extra slots
      currentMembers.splice(newSize);
    }
    setTeamMembers(currentMembers);
  };

  const handleTeamMemberChange = (index, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = value;
    setTeamMembers(updatedMembers);
  };

  const getParticipationOptions = () => {
    switch (event.participationType) {
      case "individual":
        return [{ value: "individual", label: "Individual Participation" }];
      case "team":
        return [{ value: "team", label: "Team Participation" }];
      case "both":
        return [
          { value: "individual", label: "Individual Participation" },
          { value: "team", label: "Team Participation" }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/events")}
          className="rounded-lg p-2 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Event Details</h1>
      </div>

      {/* Event Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={event.cover} 
            alt={event.title} 
            className="h-full w-full object-cover"
          />
        </div>

        {/* Event Info */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900">{event.title}</h2>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  {event.date} {event.endDate && `- ${event.endDate}`}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  {event.startTime} - {event.endTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-indigo-500" />
                  {event.attendees + participantCount} attending
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  event.mode === "Online" ? "bg-green-100 text-green-700" :
                  event.mode === "Offline" ? "bg-blue-100 text-blue-700" :
                  "bg-purple-100 text-purple-700"
                }`}>
                  {event.mode === "Online" && <Video className="h-3.5 w-3.5" />}
                  {event.mode}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Info className="h-5 w-5 text-indigo-600" />
              About Event
            </h3>
            <p className="mt-2 text-slate-600">{event.description}</p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <Tag className="h-5 w-5 text-indigo-600" />
                Tags
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Participation Criteria */}
          <div className="mt-6">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Users className="h-5 w-5 text-indigo-600" />
              Participation Criteria
            </h3>
            <p className="mt-2 text-slate-600">{event.criteria}</p>
          </div>

          {/* Event Details Grid */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <h4 className="flex items-center gap-2 font-medium text-slate-900">
                <User className="h-4 w-4 text-indigo-600" />
                Organizer
              </h4>
              <p className="mt-1 text-slate-600">{event.organizer}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <h4 className="flex items-center gap-2 font-medium text-slate-900">
                <DollarSign className="h-4 w-4 text-indigo-600" />
                Entry Fee
              </h4>
              <p className="mt-1 text-slate-600">{event.price}</p>
            </div>
          </div>

          {/* Participation Type Selection */}
          {!participating && getParticipationOptions().length > 0 && (
            <div className="mt-6">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <Users2 className="h-5 w-5 text-indigo-600" />
                Participation Type
              </h3>
              {getParticipationOptions().length > 1 ? (
                <div className="mt-3 space-y-2">
                  {getParticipationOptions().map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
                    >
                      <input
                        type="radio"
                        name="participationType"
                        value={option.value}
                        checked={participationType === option.value}
                        onChange={(e) => setParticipationType(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-900">{option.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-slate-600">
                  {getParticipationOptions()[0]?.label}
                </p>
              )}
              
              {/* Team Size and Members Selection */}
              {(participationType === "team" || event.participationType === "team") && event.teamSize && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Team Size ({event.teamSize.min}-{event.teamSize.max} members)
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => handleTeamSizeChange(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {Array.from(
                        { length: event.teamSize.max - event.teamSize.min + 1 },
                        (_, i) => event.teamSize.min + i
                      ).map((size) => (
                        <option key={size} value={size}>
                          {size} {size === 1 ? "Member" : "Members"}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Team Members Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Team Members' Names
                    </label>
                    <div className="space-y-2">
                      {teamMembers.slice(0, teamSize).map((member, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={`Team Member ${index + 1} Name`}
                          value={member}
                          onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleParticipate}
              disabled={!user}
              className={`w-full rounded-lg px-6 py-3 text-lg font-semibold transition ${
                !user
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : participating
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {!user
                ? "Login to Participate"
                : participating
                ? "✓ Already Participating"
                : "Participate in Event"}
            </button>
            {participantCount > 0 && (
              <p className="mt-2 text-center text-sm text-slate-500">
                {participantCount} student(s) participating
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <Payment
          event={event}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
