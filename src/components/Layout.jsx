import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CirclePlus,
  House,
  LogOut,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: House },
  { path: "/create", label: "Create", icon: CirclePlus },
  { path: "/groups", label: "Groups", icon: Users },
  { path: "/alumni-referrals", label: "Referrals", icon: BriefcaseBusiness },
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
          <h1 className="text-2xl font-bold tracking-tight text-emerald-700">UniConnect</h1>
          <p className="mt-1 text-sm text-slate-500">University Social Network</p>

          <div className="mt-8 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-emerald-100 text-emerald-800" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.path === "/notifications" && unreadCount > 0 ? ` (${unreadCount})` : ""}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-emerald-100 text-emerald-800" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Shield className="h-4 w-4" />
                Admin Analytics
              </NavLink>
            )}
          </div>

          <div className="mt-10 rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Logged in as</p>
            <p className="mt-1 font-semibold">{user?.fullName}</p>
            <p className="text-sm text-slate-600">{user?.role}</p>
            <button
              type="button"
              onClick={onLogout}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="min-h-screen flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-lg font-semibold text-emerald-700 lg:hidden"
              >
                UniConnect
              </button>
              <div className="hidden lg:block" />
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                  {user?.role}
                </span>
                <img src={user?.avatar} alt={user?.fullName} className="h-9 w-9 rounded-full border border-slate-200" />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl px-4 py-5 pb-24 lg:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white lg:hidden">
        <div className="grid grid-cols-5">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `px-2 py-3 text-center text-xs font-semibold ${
                  isActive ? "text-emerald-700" : "text-slate-500"
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