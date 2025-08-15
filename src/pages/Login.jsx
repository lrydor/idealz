import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
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

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor introduce tu correo para restablecer la contraseña.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        "https://idealz-git-main-lrydors-projects.vercel.app/UpdatePassword", // adjust URL
    });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setMessage("Hemos enviado un enlace para restablecer tu contraseña.");
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#fdf8f5] to-[#f8f2ed] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#fffaf7] rounded-3xl shadow-2xl p-10 space-y-6 transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <img
          src={logo}
          alt="Logo"
          className="h-14 mx-auto mb-2 animate-fade-in"
        />
        <h1 className="text-3xl font-extrabold text-[#6d4c41] text-center drop-shadow animate-fade-in">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-600 text-sm font-medium text-center">
              {message}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 flex text-lg font-medium text-[#5c3a2e]"
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
              className="w-full px-4 py-3 border border-[#e8dcd4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8bfae] shadow-inner"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 flex text-lg font-medium text-[#5c3a2e]"
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
              className="w-full px-4 py-3 border border-[#e8dcd4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8bfae] shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6d4c41] hover:bg-[#4e342e] text-[#efebe9] font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResetPassword}
            className="text-[#a47551] hover:underline font-bold text-sm"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <p className="text-sm text-center text-[#6d4c41]">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-[#a47551] hover:underline font-bold"
          >
            Registrarse
          </a>
        </p>
      </div>
    </section>
  );
}
