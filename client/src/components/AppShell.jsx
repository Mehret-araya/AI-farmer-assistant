import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { to: "/dashboard", label: "Overview" },
  { to: "/crops", label: "My crops" },
  { to: "/weather", label: "Weather" },
  { to: "/assistant", label: "AI assistant" },
];

function AppShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isProtectedPage = navigation.some(({ to }) => location.pathname === to);

  if (!isProtectedPage || !user) {
    return children;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/dashboard" className="brand-lockup">
          <span className="brand-mark">AF</span>
          <span>
            <strong>AI Farmer</strong>
            <small>Field intelligence</small>
          </span>
        </NavLink>
        <nav className="app-nav" aria-label="Main navigation">
          {navigation.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-account">
          <span className="account-avatar">{user.name?.charAt(0)?.toUpperCase() || "F"}</span>
          <span className="account-name">{user.name}</span>
          <button type="button" className="button button-quiet" onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}

export default AppShell;
