import React from "react";
import { FaSearch, FaBell, FaUser} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo.svg";

const Navbar = () => {
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
        <div className="header-inner bg-[#1a19194d] border border-cyan-400/20 rounded-2xl px-8 py-0 flex items-center justify-between  backdrop-blur-lg">
          {/* Left Side */}
          <div className="flex items-center gap-6  w-full">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/">
                <img  loading="lazy" decoding="async" src={logo}/>
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
          <div className="flex items-center gap-5 text-white text-lg">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
