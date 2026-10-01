import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg border border-line p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="relative hidden sm:block">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search interviews..."
                className="h-9 w-72 rounded-lg border border-line bg-slate-50 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg border border-line p-2 text-slate-600 hover:bg-slate-50"
            >
              <Bell size={19} />

              <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-brand-600" />
            </button>

            <div className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              D
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
