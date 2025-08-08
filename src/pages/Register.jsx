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
      return setError("Las contraseñas no coinciden");
    }

    if (!formData.terms) {
      return setError("Debes aceptar los términos y condiciones");
    }

    if (!formData.first_name || !formData.last_name) {
      return setError("Por favor ingresa tu nombre completo.");
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
      return setError("No se pudo obtener el ID del usuario.");
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
    <section className="bg-gradient-to-br from-[#f5ece7] to-[#f2e6df] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#f9f2ed] rounded-3xl shadow-2xl p-10 space-y-6 transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <img
          src={logo}
          alt="Logo"
          className="h-14 mx-auto mb-2 animate-fade-in"
        />
        <h1 className="text-3xl font-extrabold text-[#4e342e] text-center drop-shadow animate-fade-in">
          Crear Cuenta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-500 text-sm font-medium text-center animate-fade-in">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 flex text-sm font-medium text-[#5d4037]"
              >
                Nombre
              </label>
              <input
                placeholder="Introduce tu nombre"
                type="text"
                name="first_name"
                id="firstName"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#d7c4b8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b89c87] shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-[#c4a793]"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1 flex text-sm font-medium text-[#5d4037]"
              >
                Apellido
              </label>
              <input
                placeholder="Introduce tu apellido"
                type="text"
                name="last_name"
                id="lastName"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#d7c4b8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b89c87] shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-[#c4a793]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 flex text-sm font-medium text-[#5d4037]"
            >
              Correo
            </label>
            <input
              placeholder="Introduce tu correo"
              type="email"
              name="email"
              id="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d7c4b8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b89c87] shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-[#c4a793]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 flex text-sm font-medium text-[#5d4037]"
            >
              Contraseña
            </label>
            <input
              placeholder="Introduce tu contraseña"
              type="password"
              name="password"
              id="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d7c4b8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b89c87] shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-[#c4a793]"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 flex text-sm font-medium text-[#5d4037]"
            >
              Confirmar Contraseña
            </label>
            <input
              placeholder="Confirma tu contraseña"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d7c4b8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b89c87] shadow-inner transition duration-300 ease-in-out hover:ring-2 hover:ring-[#c4a793]"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="w-4 h-4 text-[#8d6e63] bg-gray-100 border-gray-300 rounded focus:ring-[#a67d61]"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-[#5d4037]">
              Acepto los{" "}
              <a href="#" className="text-[#a67d61] hover:underline font-medium">
                Términos y Condiciones
              </a>
            </label>
          </div>

         <button
  type="submit"
  className="w-full bg-[#6d4c41] hover:bg-[#4e342e] text-[#efebe9] font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out hover:scale-105"
>
  Crear Cuenta
</button>
        </form>

        <p className="text-sm text-center text-[#6d4c41]">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-[#a67d61] hover:underline font-bold">
            Iniciar Sesión
          </a>
        </p>
      </div>
    </section>
  );
}
