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
    first_name: "",
    last_name: "",
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

    if (!formData.first_name || !formData.last_name) {
      return setError("Please enter your full name.");
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      return setError(error.message);
    }

    const userId = data?.user?.id;
    if (!userId) {
      return setError("Failed to get user ID after registration.");
    }

    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      },
    ]);

    if (insertError) {
      return setError(insertError.message);
    }

    navigate("/login");
  };

  return (
    <section className="bg-gradient-to-br from-yellow-50 to-rose-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 space-y-6 transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <img src={logo} alt="Logo" className="h-14 mx-auto mb-2 animate-fade-in" />
        <h1 className="text-3xl font-extrabold text-rose-600 text-center drop-shadow animate-fade-in">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-600 text-sm font-medium text-center animate-fade-in">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                placeholder="Enter your first name"
                type="text"
                name="first_name"
                id="firstName"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-rose-300"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                placeholder="Enter your last name"
                type="text"
                name="last_name"
                id="lastName"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-rose-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              id="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-rose-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              placeholder="Enter your password"
              type="password"
              name="password"
              id="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-rose-300"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              placeholder="Confirm your password"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-rose-300"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I accept the{" "}
              <a href="#" className="text-rose-500 hover:underline font-medium">
                Terms & Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-200 to-pink-300 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:brightness-110"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-rose-500">
          Already have an account?{" "}
          <a href="/login" className="text-pink-600 hover:underline font-bold">
            Login here
          </a>
        </p>
      </div>
    </section>
  );
}
