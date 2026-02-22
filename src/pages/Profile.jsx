import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Grid3X3, User, Users, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, posts, userConnections, getConnectedUsers, connectUser } = useData();
  const [showConnections, setShowConnections] = useState(false);

  const profile = userId ? users.find((u) => u.id === userId) : user;

  if (!profile) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">Profile not found.</p>;
  }

  const userPosts = posts.filter((post) => post.userId === profile.id);
  const imagePosts = userPosts.filter((p) => p.imageUrl);
  const isOwnProfile = user && profile.id === user.id;
  
  // Get connections count for this specific user
  const userConnectionsCount = userConnections && userConnections[profile.id] ? userConnections[profile.id].length : 0;
  
  // Get actual connections for this user
  const profileConnections = userConnections && userConnections[profile.id] 
    ? userConnections[profile.id].map(connectionId => users.find(u => u.id === connectionId)).filter(Boolean)
    : [];

  // Handle connecting from someone's profile
  const handleConnectFromProfile = async (targetUserId) => {
    if (!user) return;
    
    const success = await connectUser(targetUserId);
    if (success) {
      // Navigate back to own profile after connecting
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Show connections list when clicked, otherwise show profile */}
      {showConnections ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4">
            <button
              onClick={() => setShowConnections(false)}
              className="mb-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Profile
            </button>
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-4">
              <Users className="h-5 w-5 text-indigo-600" />
              {profile.fullName}'s Connections ({userConnectionsCount})
            </h3>
            <div className="space-y-3">
              {profileConnections.map((connection) => (
                <Link 
                  key={connection.id} 
                  to={`/profile/${connection.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition w-full"
                >
                  <img
                    src={connection.avatar}
                    alt={connection.fullName}
                    className="h-12 w-12 rounded-full border-2 border-slate-200 object-cover"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-900">{connection.fullName}</p>
                    <p className="text-xs text-slate-500 capitalize">{connection.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Instagram-style: compact header */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col items-center px-4 py-6 sm:flex-row sm:items-start sm:gap-8 sm:px-8">
              <div className="flex-shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.fullName}
                  className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover sm:h-32 sm:w-32"
                />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:flex-1 sm:text-left">
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{profile.fullName}</h1>
                <p className="mt-1 text-sm text-slate-600">
                  {profile.department} · {profile.year}
                </p>
                <p className="mt-1 text-xs font-medium uppercase text-slate-500">{profile.role}</p>
                {/* Stats row - Instagram style */}
                <div className="mt-4 flex justify-center gap-6 sm:justify-start">
                  <div className="text-center sm:text-left">
                    <span className="block font-semibold text-slate-900">{userPosts.length}</span>
                    <span className="text-slate-500">posts</span>
                  </div>
                  <button
                    onClick={() => setShowConnections(true)}
                    className="text-center sm:text-left hover:bg-slate-100 rounded-lg px-2 py-1 transition"
                  >
                    <span className="block font-semibold text-slate-900">{userConnectionsCount}</span>
                    <span className="text-slate-500">connections</span>
                  </button>
                </div>
                {/* Connect button for other profiles */}
                {!isOwnProfile && user && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleConnectFromProfile(profile.id)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                      Connect
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Posts grid - Instagram style: 3 columns, no labels */}
          <div className="mt-6">
            <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-2">
              <Grid3X3 className="h-5 w-5 text-slate-700" />
              <span className="text-sm font-semibold text-slate-900">Posts</span>
            </div>
            {userPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-b-2xl border border-t-0 border-slate-200 bg-white py-16">
                <div className="rounded-full border-2 border-slate-200 p-4">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">No posts yet</p>
                <p className="text-sm text-slate-500">When you share, your posts will appear here.</p>
                {isOwnProfile && (
                  <Link to="/create" className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    Share your first post
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5 rounded-b-2xl border border-t-0 border-slate-200 bg-white">
                {userPosts.map((post) => (
                  <Link key={post.id} to={`/post/${post.id}`} className="aspect-square block bg-slate-100">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title || "Post"}
                        className="h-full w-full object-cover transition hover:opacity-90"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-2">
                        <p className="line-clamp-3 text-center text-xs text-slate-600">{post.content || post.title}</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
