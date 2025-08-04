import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      navigate("/");
    }
  };

  return (
    <section className="bg-gradient-to-br from-yellow-50 to-rose-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 space-y-6 transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <img
          src={logo}
          alt="Logo"
          className="h-14 mx-auto mb-2 animate-fade-in"
        />
        <h1 className="text-3xl font-extrabold text-rose-600 text-center drop-shadow animate-fade-in">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <p className="text-red-600 text-sm font-medium text-center animate-fade-in">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 flex text-lg font-medium text-gray-700"
            >
              Correo
            </label>
            <input
              placeholder="Introduce tu correo"
              type="email"
              name="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-rose-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 flex text-lg font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              placeholder="Introduce tu contraseña"
              type="password"
              name="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-rose-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-200 to-pink-300 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:brightness-110"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-sm text-center text-rose-500">
          No tienes una cuenta?{" "}
          <a href="/register" className="text-pink-600 hover:underline font-bold">
            Registrarse
          </a>
        </p>  
      </div>
    </section>
  );
}