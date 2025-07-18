import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!formData.terms) {
      return setError("You must accept the terms and conditions");
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <img src={logo} alt="Logo" className="h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="flex mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              id="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="flex mb-1 text-sm font-medium text-gray-700 "
            >
              Password
            </label>
            <input
              placeholder="Enter your password"
              type="password"
              name="password"
              id="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="flex mb-1 text-sm font-medium text-gray-700 "
            >
              Confirm Password
            </label>
            <input
              placeholder="Confirm your password"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I accept the{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Terms & Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-100 to-pink-100
          text-black font-bold py-2 px-4 rounded-full transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </div>
    </section>
  );
}
