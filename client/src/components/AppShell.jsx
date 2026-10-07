
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
    <div className="min-h-screen bg-[#050A08] text-[#86EFAC]">
      <header className="sticky top-0 z-50 border-b border-green-500/20 bg-[#050A08]">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#166534] text-sm font-bold text-[#DCFCE7] shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              AF
            </span>

            <span className="flex flex-col">
              <strong className="text-sm font-semibold text-[#22C55E]">
                AI Farmer
              </strong>

              <small className="text-xs text-[#86EFAC]/70">
                Field intelligence
              </small>
            </span>
          </NavLink>

          <nav
            className="flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navigation.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-[#166534] text-[#DCFCE7]"
                      : "text-[#86EFAC] hover:bg-[#166534]/20 hover:text-[#22C55E]"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E] text-sm font-bold text-[#050A08]">
              {user.name?.charAt(0)?.toUpperCase() || "F"}
            </span>

            <span className="hidden text-sm font-medium text-[#86EFAC] sm:inline">
              {user.name}
            </span>

            <button
              type="button"
              className="rounded-full border border-green-500/30 px-4 py-2 text-sm font-medium text-[#86EFAC] transition-colors duration-150 hover:border-green-500/50 hover:bg-[#166534]/20 hover:text-[#22C55E]"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="app-content">{children}</main>
    </div>
  );
}

export default AppShell;

