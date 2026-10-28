import React, { useState } from "react";
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navText = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Movies", path: "/movies" },
    { name: "Series", path: "/series" },
    { name: "Collection", path: "/collection" },
    { name: "FAQ", path: "/frequently-asked-questions" },
  ];

  return (
    <header className="w-full fixed top-0 z-[9999] py-4">
      <div className="container">
        <div className="header-inner bg-[#1a19194d] border border-cyan-400/20 rounded-2xl px-4 sm:px-8 py-0 flex items-center justify-between backdrop-blur-lg relative">
          {/* Left Side */}
          <div className="flex items-center gap-3 sm:gap-6 w-full min-w-0">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/">
                <img  loading="lazy" decoding="async" src={logo} className="h-10 sm:h-auto w-auto max-w-[120px] sm:max-w-none"/>
              </Link>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-white text-[18px] font-medium">
              <ul className="flex items-center justify-start gap-5">
                {navText.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `transition duration-300 border-b pb-1 ${isActive ? "text-blue border-b-blue-500" : "text-white border-b-transparent hover:text-blue-500 hover:border-b-blue-500"}`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-5 text-white text-lg shrink-0">
            <button className="hover:text-blue transition duration-300">
              <FaSearch />
            </button>

            <button className="relative hover:text-blue transition duration-300">
              <FaBell />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500"></span>
            </button>

            <button className="hover:text-blue transition duration-300">
              <FaUser />
            </button>

            <button
              type="button"
              aria-label="Toggle menu"
              className="md:hidden hover:text-blue transition duration-300"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {menuOpen && (
            <nav className="md:hidden absolute top-full left-0 w-full mt-2 bg-[#030A1B]/95 border border-cyan-400/20 rounded-2xl backdrop-blur-lg p-4">
              <ul className="flex flex-col gap-3 text-white text-lg font-medium">
                {navText.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block py-1 transition duration-300 ${isActive ? "text-blue" : "text-white hover:text-blue-500"}`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
