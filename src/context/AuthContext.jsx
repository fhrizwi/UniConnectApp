import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const defaultAccounts = [
  {
    id: "u1",
    fullName: "Aarav Mehta",
    email: "student@uniconnect.edu",
    rollNo: "20BCS001",
    password: "password123",
    role: "student",
    department: "Computer Science",
    year: "3rd Year",
  },
  {
    id: "u2",
    fullName: "Dr. Nisha Rao",
    email: "faculty@uniconnect.edu",
    rollNo: "FEC001",
    password: "password123",
    role: "faculty",
    department: "Electronics",
    year: "Faculty",
  },
  {
    id: "u3",
    fullName: "Sana Khan",
    email: "alumni@uniconnect.edu",
    rollNo: "17BME042",
    password: "password123",
    role: "alumni",
    department: "Mechanical",
    year: "Class of 2021",
  },
  {
    id: "u4",
    fullName: "Campus Clubs Office",
    email: "club@uniconnect.edu",
    rollNo: "CLUB01",
    password: "password123",
    role: "club",
    department: "Student Affairs",
    year: "Club",
  },
  {
    id: "u10",
    fullName: "Admin Office",
    email: "admin@uniconnect.edu",
    rollNo: "ADMIN01",
    password: "password123",
    role: "admin",
    department: "Administration",
    year: "Admin",
  },
];

function createToken(user) {
  return btoa(`${user.id}:${user.role}:${Date.now()}`);
}

function normalizeUser(account) {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    role: account.role,
    department: account.department,
    year: account.year,
    username: account.email.split("@")[0],
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account.fullName)}`,
  };
}

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("uniconnect_accounts");
    return saved ? JSON.parse(saved) : defaultAccounts;
  });

  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("uniconnect_session");
    return saved ? JSON.parse(saved) : null;
  });

  const user = session?.user || null;
  const token = session?.token || null;

  const persistAccounts = (next) => {
    setAccounts(next);
    localStorage.setItem("uniconnect_accounts", JSON.stringify(next));
  };

  const login = ({ email, rollNo, password }) => {
    const account = accounts.find(
      (a) =>
        a.email.toLowerCase() === email.toLowerCase() &&
        (a.rollNo || "").toUpperCase() === (rollNo || "").toUpperCase() &&
        a.password === password,
    );

    if (!account) {
      throw new Error("Invalid email, roll number or password.");
    }

    const nextSession = {
      token: createToken(account),
      user: normalizeUser(account),
    };

    setSession(nextSession);
    localStorage.setItem("uniconnect_session", JSON.stringify(nextSession));
    return nextSession;
  };

  const register = ({ fullName, email, rollNo, password, role, department, year }) => {
    const exists = accounts.some((a) => a.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("An account with this email already exists.");
    }
    const rollExists = accounts.some((a) => (a.rollNo || "").toUpperCase() === (rollNo || "").toUpperCase());
    if (rollExists) {
      throw new Error("This college roll number is already registered.");
    }

    const newAccount = {
      id: `u${Date.now()}`,
      fullName,
      email,
      rollNo: (rollNo || "").trim().toUpperCase(),
      password,
      role,
      department,
      year,
    };

    const nextAccounts = [newAccount, ...accounts];
    persistAccounts(nextAccounts);

    const nextSession = {
      token: createToken(newAccount),
      user: normalizeUser(newAccount),
    };

    setSession(nextSession);
    localStorage.setItem("uniconnect_session", JSON.stringify(nextSession));

    return nextSession;
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("uniconnect_session");
  };

  const loginWithGoogle = () => {
    const googleUser = {
      id: `google_${Date.now()}`,
      fullName: "Google User",
      email: "user@gmail.com",
      role: "student",
      department: "General",
      year: "Member",
      username: "googleuser",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=google",
    };
    const nextSession = {
      token: createToken({ id: googleUser.id, role: googleUser.role, email: googleUser.email }),
      user: googleUser,
    };
    setSession(nextSession);
    localStorage.setItem("uniconnect_session", JSON.stringify(nextSession));
    return nextSession;
  };

  const value = useMemo(
    () => ({ user, token, login, register, logout, loginWithGoogle, accounts }),
    [user, token, accounts],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
