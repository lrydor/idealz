import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import logo from "../assets/logo.png";

//registering logic using supabase
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

    // insert into profiles table after registration
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      },
    ]);
    // if there's an error inserting into profiles
    if (insertError) {
      return setError(insertError.message);
    }

    // redirect to login page after successful registration
    navigate("/login");
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
              htmlFor="firstName"
              className="flex mb-1 text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              placeholder="Enter your first name"
              type="text"
              name="first_name"
              id="firstName"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="flex mb-1 text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              placeholder="Enter your last name"
              type="text"
              name="last_name"
              id="lastName"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              <a href="#" className="text-gray-600 hover:underline font-medium">
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
          <a href="/login" className="text-black hover:underline font-bold">
            Login here
          </a>
        </p>
      </div>
    </section>
  );
}
