import { Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  function handleSearch(event) {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      navigate("/history");
      return;
    }

    navigate(`/history?q=${encodeURIComponent(normalizedQuery)}`);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg border border-line p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search interviews..."
                className="h-9 w-72 rounded-lg border border-line bg-slate-50 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-surface focus:ring-4 focus:ring-brand-100"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition hover:text-ink"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div
              title={user?.name || "User"}
              className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
            >
              {userInitial}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
