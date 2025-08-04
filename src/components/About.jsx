import React from "react";

const About = () => {
  return (
    <section id="about" className="w-full pt-24 pb-0 px-10 flex justify-center">
      <div className="max-w-7xl w-full flex flex-col items-center bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-pink-600 mb-12 text-center drop-shadow-md">
          Sobre Nosotros
        </h2>
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center">
            <h3 className="text-xl font-bold text-pink-600 mb-4">
              Nuestra Misión
            </h3>
            <p className="text-gray-700">
              En <span className="text-pink-500 font-semibold">Idealz</span>,
              creemos que la felicidad comienza con una paleta. Nuestro objetivo
              es simple: brindar alegría en cada bocado con sabores tropicales,
              frutales y cremosos hechos con amor e ingredientes locales. 💖
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center">
            <h3 className="text-xl font-bold text-pink-600 mb-4">
              Nuestra Historia
            </h3>
            <p className="text-gray-700">
              Lo que comenzó como un pequeño sueño familiar en Belice, ahora es
              el favorito de la comunidad. Combinamos tradición y creatividad
              para crear helados que sacan sonrisas a cada generación — desde
              niños hasta abuelitas.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center">
            <h3 className="text-xl font-bold text-pink-600 mb-4">
              Nuestros Sabores
            </h3>
            <p className="text-gray-700">
              Desde <span className="text-yellow-600 font-semibold">Mango</span>{" "}
              y <span className="text-pink-600 font-semibold">Picafresa </span>
              hasta nuestra icónica{" "}
              <span className="text-red-500 font-semibold">Mangonada</span>,
              elaboramos cada paleta para endulzar tu día. ¡Ven a refrescarte
              con nosotros! 🍦🇧🇿
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
