import { NavLink, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import AuthModal from "@/components/AuthModal";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, signOut } = useUser();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white z-30 transition-shadow ${
        scrolled ? "shadow-[0_1.5px_8px_0_rgba(0,0,0,0.06)]" : ""
      }`}
      style={{ minHeight: 56 }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="font-extrabold text-xl text-black tracking-tight">Stridely</div>
        {/* Nav Links */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/plan"
            className={({ isActive }) =>
              `px-4 py-2 font-semibold text-sm rounded-md transition-colors ${
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-primary/80 hover:text-accent"
              }`
            }
          >
            Plan
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `px-4 py-2 font-semibold text-sm rounded-md transition-colors ${
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-primary/80 hover:text-accent"
              }`
            }
          >
            Progress
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `p-2 rounded-full transition-colors ${
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-primary/80 hover:text-accent"
              }`
            }
            aria-label="Account"
          >
            <UserIcon className="w-5 h-5" />
          </NavLink>
          {/* Auth Section */}
          {user ? (
            <div className="relative group ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <UserIcon />
              </Button>
              <div className="absolute right-0 mt-1 w-36 bg-white border rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-auto z-30 transition p-2">
                <NavLink
                  to="/plan"
                  className="block px-3 py-1 hover:text-accent"
                >
                  My Plan
                </NavLink>
                <button
                  className="w-full flex items-center gap-2 px-3 py-1 text-left hover:text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Button onClick={() => setAuthOpen(true)} className="ml-2" size="sm">
                Sign In
              </Button>
              <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
