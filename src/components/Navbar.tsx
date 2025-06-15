
import { NavLink, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
            <User className="w-5 h-5" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
