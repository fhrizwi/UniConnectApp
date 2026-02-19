import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-100 px-4">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <h1 className="text-xl font-semibold text-amber-800">Access Restricted</h1>
          <p className="mt-2 text-sm text-amber-700">
            This module is not available for your role: {user.role}.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
