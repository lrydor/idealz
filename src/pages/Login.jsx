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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      
      <form
        className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg space-y-5"
        onSubmit={handleLogin}
      >
        <img src={logo} alt="Logo" className="h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Sign in to your account
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-100 to-pink-100
        text-black font-bold py-2 px-4 rounded-full transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-black hover:underline font-bold"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
