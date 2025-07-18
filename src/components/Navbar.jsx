import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <a href="">
              <img src={logo} alt="Logo" className="h-12" />
            </a>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex space-x-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 transition transform text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg"
            onClick={() => {
              setIsOpen(false);
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
