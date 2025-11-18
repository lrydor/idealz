import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.JPG";
import cartLogo from "../assets/cart.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, profile } = useAuth();
  const userName = profile?.first_name ?? null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const renderAuthButtons = (isMobile = false) => {
    if (!user) {
      return (
        <>
          <button
            className="bg-[#f5f5f5] text-[#4e342e] font-semibold px-4 py-2 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
            onClick={() => {
              if (isMobile) setIsOpen(false);
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            className="bg-gradient-to-br from-[#6d4c41] to-[#4e342e] text-[#f5f5f5] font-extrabold px-4 py-2 rounded-full hover:brightness-110 transition"
            onClick={() => {
              if (isMobile) setIsOpen(false);
              navigate("/register");
            }}
          >
            Unirse
          </button>
        </>
      );
    }

    return (
      <>
        <span className="text-[#4e342e] font-medium">
          Hola{userName ? `, ${userName}` : ""}!
        </span>
        {(role === "employee" || role === "admin") && (
          <button
            className="bg-[#f5f5f5] text-[#4e342e] font-semibold px-4 py-2 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
            onClick={() => {
              if (isMobile) setIsOpen(false);
              navigate("/displaykitchen");
            }}
          >
            Pedidos
          </button>
        )}
        {role === "admin" && (
          <button
            className="bg-[#f5f5f5] text-[#4e342e] font-semibold px-4 py-2 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
            onClick={() => {
              if (isMobile) setIsOpen(false);
              navigate("/admin");
            }}
          >
            Panel
          </button>
        )}
         {/* Fila */}
        <button
            className="bg-[#f5f5f5] text-[#4e342e] font-semibold px-4 py-2 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
            onClick={() => {
              if (isMobile) setIsOpen(false);
              navigate("/displayqueue");
            }}
          >
            Fila
          </button>
          

        <button
          className="bg-[#f5f5f5] text-[#4e342e] font-semibold px-4 py-2 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
          onClick={() => {
            if (isMobile) setIsOpen(false);
            handleLogout();
          }}
        >
          Logout
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 border border-[#d7ccc8] rounded-full hover:bg-[#ede7e3] transition"
          onClick={() => {
            if (isMobile) setIsOpen(false);
            navigate("/cart");
          }}
        >
          <img src={cartLogo} alt="Cart" className="h-5 w-5" />
        </button>
      </>
    );
  };

  return (
    <nav className="w-full bg-[#f5f5f5] border-b border-[#d7ccc8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/">
            <img src={logo} alt="Logo" className="h-12" />
          </a>

          {/* Right section (Desktop) */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="/menu"
              className="text-[#4e342e] hover:underline font-medium"
            >
              Menú
            </a>
            <a
              href="#about"
              className="text-[#4e342e] hover:underline font-medium"
            >
              Sobre Nosotros
            </a>
            <a
              href="#contact"
              className="text-[#4e342e] hover:underline font-medium"
            >
              Contacto
            </a>

            {renderAuthButtons(false)}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-2 rounded text-sm font-medium text-[#6d4c41] hover:bg-[#ede7e3] transition"
            >
              <img
                src="https://img.icons8.com/?size=100&id=36389&format=png&color=000000"
                alt="Menu Icon"
                className="h-5 w-5 inline-block ml-1"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-[#f5f5f5] border-t border-[#d7ccc8]">
          <a
            href="/menu"
            onClick={() => setIsOpen(false)}
            className="block text-[#4e342e] hover:underline"
          >
            Menú
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block text-[#4e342e] hover:underline"
          >
            Sobre Nosotros
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block text-[#4e342e] hover:underline"
          >
            Contacto
          </a>

          <button
            onClick={() => {
              navigate("/cart");
            }}
            className="w-full flex items-center gap-2 text-[#4e342e] hover:bg-[#ede7e3] px-4 py-2 rounded transition justify-center"
          >
            <img src={cartLogo} alt="Cart" className="h-5 w-5" />
            <span className="text-[#4e342e]">Carrito</span>
          </button>

          <div className="flex flex-col gap-2 mt-4">
            {renderAuthButtons(true)}
          </div>
        </div>
      )}
    </nav>
  );
}
