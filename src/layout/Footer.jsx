import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";

const Footer = () => {
  const footerLinks = [
    "Get the Omni App",
    "Help",
    "Site Index",
    "Omni Pro",
    "Advertising",
    "Omni Developer",
    "Jobs",
    "Privacy Policy",
  ];

  const socialIcons = [
    <FaFacebookF />,
    <FaInstagram />,
    <FaLinkedinIn />,
    <FaYoutube />,
    <FaTelegramPlane />,
  ];

  return (
    <footer className="w-full relative py-20">
      
      <div className="container">
        
        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-5 text-white font-medium text-lg">
          
          {footerLinks.map((item, index) => (
            <Link
              key={index}
              to="/"
              className="flex items-center gap-2 hover:text-blue-500 transition duration-300"
            >
              {item}

              <span className="text-xl">›</span>
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-8 mt-20">
          
          {socialIcons.map((icon, index) => (
            <Link
              key={index}
              to="/"
              className="w-14 h-14 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white text-2xl hover:bg-blue-500 transition duration-300"
            >
              {icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;