import {
  BarChart3,
  Code2,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const primaryNavigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Start Interview",
    path: "/interview/new",
    icon: Sparkles,
  },
  {
    name: "Interview History",
    path: "/history",
    icon: History,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

const secondaryNavigation = [
  {
    name: "Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function NavigationLink({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-brand-50 text-brand-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        ].join(" ")
      }
    >
      <Icon size={19} strokeWidth={1.9} />
      <span>{item.name}</span>
    </NavLink>
  );
}

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  function handleLogout() {
    logout();
    onClose();
    navigate("/login", { replace: true });
  }
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Code2 size={20} />
            </span>

            <span>
              <span className="block text-base font-bold leading-none text-ink">
                DevPrep AI
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                Interview Studio
              </span>
            </span>
          </NavLink>

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {primaryNavigation.map((item) => (
              <NavigationLink key={item.path} item={item} onClick={onClose} />
            ))}
          </div>

          <div className="my-5 border-t border-line" />

          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <NavigationLink key={item.path} item={item} onClick={onClose} />
            ))}
          </div>
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-muted">{user?.email || ""}</p>
            </div>

            <button
              type="button"
              aria-label="Log out"
              onClick={handleLogout}
              className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-danger"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
