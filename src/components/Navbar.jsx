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
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/">
            <img src={logo} alt="Logo" className="h-12" />
          </a>

          {/* Right section (Desktop) */}
          <div className="hidden md:flex items-center gap-5">
            <a href="/menu" className="text-black hover:underline font-medium">
              Menu
            </a>
            <a href="#about" className="text-black hover:underline font-medium">
              About
            </a>
            <a
              href="#contact"
              className="text-black hover:underline font-medium"
            >
              Contact
            </a>

            {userName ? (
              <>
                <span className="text-black font-medium">
                  Hello, {userName}!
                </span>
                <button
                  className="bg-white text-black font-semibold px-4 py-2 rounded-full border border-rose-400 hover:bg-rose-50 transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                {/* cart icon */}
                <button
                  className="flex items-center gap-2 px-3 py-2 border rounded-full hover:bg-gray-100 transition"
                  onClick={() => navigate("/cart")} // si tienes una ruta /cart
                >
                  <img src={cartLogo} alt="Cart" className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-white text-black font-semibold px-4 py-2 rounded-full border border-rose-400 hover:bg-rose-50 transition"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="bg-gradient-to-br from-pink-300 to-yellow-300 text-white font-extrabold px-4 py-2 rounded-full hover:brightness-110 transition"
                  onClick={() => navigate("/register")}
                >
                  Join now
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
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

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          <a
            href="/menu"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:underline"
          >
            Menu
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:underline"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:underline"
          >
            Contact
          </a>

          <button
            onClick={() => {
              navigate("/cart");
            }}
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded transition"
          >
            <img src={cartLogo} alt="Cart" className="h-5 w-5" />
            Cart
          </button>

          {userName ? (
            <>
              <span className="block text-black font-medium">
                Hello, {userName}!
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full bg-white text-black font-bold py-2 px-6 rounded-full border border-rose-400 hover:bg-rose-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full bg-white text-black font-bold py-2 px-6 rounded-full border border-rose-400 hover:bg-rose-50 transition"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                className="w-full bg-gradient-to-br from-pink-300 to-yellow-300 text-white font-bold py-2 px-6 rounded-full hover:brightness-110 transition"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/register");
                }}
              >
                Join now
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
