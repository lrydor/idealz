import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

// logos
import logo from "../assets/logo.png";
import cartLogo from "../assets/cart.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();

        if (profile?.first_name) {
          setUserName(profile.first_name);
        }
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserName(null);
    navigate("/");
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
            <a href="/menu" className="text-[#4e342e] hover:underline font-medium">
              Menú
            </a>
            <a href="#about" className="text-[#4e342e] hover:underline font-medium">
              Sobre Nosotros
            </a>
            <a href="#contact" className="text-[#4e342e] hover:underline font-medium">
              Contacto
            </a>

            {userName ? (
              <>
                <span className="text-[#4e342e] font-medium">
                  Hola, {userName}!
                </span>
                <button
                  className="bg-[#f5f5f5] text-[#4e342e] font-semibold px-4 py-2 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 border border-[#d7ccc8] rounded-full hover:bg-[#ede7e3] transition"
                  onClick={() => navigate("/cart")}
                >
                  <img src={cartLogo} alt="Cart" className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-[#f5f5f5] text-[#4e342e] font-semibold px-4 py-2 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="bg-gradient-to-br from-[#6d4c41] to-[#4e342e] text-[#f5f5f5] font-extrabold px-4 py-2 rounded-full hover:brightness-110 transition"
                  onClick={() => navigate("/register")}
                >
                  Unirse
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-2 rounded text-sm font-medium text-[#6d4c41] hover:bg-[#ede7e3] transition"
            >
              Menú
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
            className="flex items-center gap-2 text-[#4e342e] hover:bg-[#ede7e3] px-4 py-2 rounded transition"
          >
            <img src={cartLogo} alt="Cart" className="h-5 w-5" />
            Carrito
          </button>

          {userName ? (
            <>
              <span className="block text-[#4e342e] font-medium">
                Hola, {userName}!
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full bg-[#f5f5f5] text-[#4e342e] font-bold py-2 px-6 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full bg-[#f5f5f5] text-[#4e342e] font-bold py-2 px-6 rounded-full border border-[#d7ccc8] hover:bg-[#ede7e3] transition"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                className="w-full bg-gradient-to-br from-[#6d4c41] to-[#4e342e] text-[#f5f5f5] font-bold py-2 px-6 rounded-full hover:brightness-110 transition"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/register");
                }}
              >
                Unirse
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}