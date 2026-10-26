import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const menuItems = [
  { name: "HOME", path: "/" },
  { name: "ABOUT", path: "/about" },
  { name: "TEACHING", path: "/teaching" },
  { name: "RESEARCH", path: "/research" },
  { name: "ACADEMIC ACTIVITIES", path: "/academic-activities" },
  { name: "E-CONTENT", path: "/e-content" },
  { name: "ACHIEVEMENTS", path: "/achievements" },
  { name: "GALLERY", path: "/gallery" },
  { name: "CONTACT", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative px-2.5 py-2 text-xs 2xl:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
      isActive
        ? "text-[#54765C]"
        : "text-[#555D50] hover:text-[#54765C]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E7DF] shadow-sm">
      <nav className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LOGO AND PROFESSOR NAME */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-[#54765C] flex items-center justify-center text-white text-xl font-bold shadow-sm">
              TT
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-bold text-[#343C32] leading-tight">
                Dr. Trupti Thorat
              </span>
              <span className="text-[11px] sm:text-xs text-[#8A806F] tracking-wide">
                Associate Professor
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden xl:flex items-center gap-1 2xl:gap-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={linkClass}
              >
                {({ isActive }) => (
                  <span className="relative py-1">
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#54765C] rounded-full" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* DESKTOP GET IN TOUCH BUTTON */}
          <div className="hidden xl:block shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#54765C] text-white px-5 py-2.5 rounded-full text-xs 2xl:text-sm font-semibold hover:bg-[#405C47] transition duration-300 shadow-sm"
            >
              Get in Touch
              <span>↗</span>
            </Link>
          </div>

          {/* MOBILE / TABLET MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden flex items-center justify-center w-11 h-11 rounded-lg bg-[#E9EEDC] text-[#54765C] hover:bg-[#DDE6D4] transition shrink-0"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE / TABLET NAVIGATION DRAWER */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="xl:hidden pb-6 pt-3 border-t border-[#E8E7DF] max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="flex flex-col gap-1.5">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition ${
                      isActive
                        ? "bg-[#E9EEDC] text-[#54765C]"
                        : "text-[#555D50] hover:bg-[#F1F3EA] hover:text-[#54765C]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 text-center bg-[#54765C] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#405C47] transition shadow-sm"
              >
                Get in Touch ↗
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}