import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, CircleUserRound, GraduationCap, KeyRound, Mail, UserPlus, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const roles = ["student", "faculty", "admin", "alumni", "club"];

export default function Signup() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    rollNo: "",
    password: "",
    role: "student",
    department: "",
    year: "",
  });
  const [error, setError] = useState("");

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    try {
      setError("");
      register({
        ...form,
        rollNo: form.rollNo?.trim().toUpperCase(),
        department: form.department || "General",
        year: form.year || "Member",
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign up.");
    }
  };

  const onGoogleSignUp = () => {
    try {
      setError("");
      loginWithGoogle();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Google sign up failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-indigo-700" />
          <h1 className="text-2xl font-bold text-slate-900">Create UniConnect Account</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Already have one? <Link to="/login" className="font-semibold text-indigo-700">Login</Link>
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium text-slate-700">
            Full Name
            <div className="relative mt-1">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={form.fullName}
                onChange={onChange("fullName")}
                required
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </label>

          <label className="sm:col-span-2 text-sm font-medium text-slate-700">
            Email
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={onChange("email")}
                required
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </label>

          <label className="sm:col-span-2 text-sm font-medium text-slate-700">
            College Roll Number
            <div className="relative mt-1">
              <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.rollNo}
                onChange={onChange("rollNo")}
                placeholder="e.g. 20BCS001"
                required
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Password
            <div className="relative mt-1">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={onChange("password")}
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Role
            <div className="relative mt-1">
              <CircleUserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={form.role}
                onChange={onChange("role")}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Department
            <div className="relative mt-1">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={form.department}
                onChange={onChange("department")}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Year / Batch
            <input
              value={form.year}
              onChange={onChange("year")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          {error && <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 font-semibold text-white hover:bg-indigo-800"
          >
            <UserPlus className="h-4 w-4" />
            Create account
          </button>

          <div className="relative sm:col-span-2 my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoogleSignUp}
            className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            <GoogleIcon className="h-5 w-5" />
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  );
}