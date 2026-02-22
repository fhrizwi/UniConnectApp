import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Calendar,
  CirclePlus,
  Compass,
  House,
  LogOut,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const navItems = [
  { path: "/", label: "Feed", icon: House },
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/create", label: "Create", icon: CirclePlus },
  { path: "/events", label: "Events", icon: Calendar },
  { path: "/groups", label: "Groups", icon: Users },
  { path: "/alumni-referrals", label: "Jobs", icon: BriefcaseBusiness },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/profile", label: "Profile", icon: UserRound },
];

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useData();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">UniConnect</h1>
          <p className="mt-1 text-sm text-slate-500">Your University Network</p>

          <div className="mt-8 space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
                {item.path === "/notifications" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span>
                )}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <Shield className="h-5 w-5 shrink-0" />
                Admin
              </NavLink>
            )}
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-100">
            <div className="flex items-center gap-3">
              <img src={user?.avatar} alt="" className="h-12 w-12 rounded-full border-2 border-white shadow object-cover" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="min-h-screen flex-1">
          <main className="mx-auto w-full max-w-5xl px-4 py-5 pb-24 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-3 text-center text-xs font-semibold ${
                  isActive ? "text-indigo-600" : "text-slate-500"
                }`
              }
            >
              <span className="flex items-center justify-center gap-1">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}