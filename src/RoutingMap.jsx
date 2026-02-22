import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/Layout";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import Explore from "./pages/Explore";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import AlumniReferrals from "./pages/AlumniReferrals";
import AdminDashboard from "./pages/AdminDashboard";
import StoryView from "./pages/StoryView";

export default function RoutingMap() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/story/:storyId" element={<StoryView />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="post/:postId" element={<PostDetail />} />
            <Route path="explore" element={<Explore />} />
            <Route path="events" element={<Events />} />
            <Route path="event/:eventId" element={<EventDetail />} />
            <Route path="groups" element={<Groups />} />
            <Route path="group/:groupId" element={<GroupDetail />} />
            <Route path="alumni-referrals" element={<AlumniReferrals />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<Layout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
