import React from "react";
import fam from "../assets/products/fam.jpeg";
import ideal from "../assets/products/ideal.jpeg";
import blz from "../assets/products/blz.jpeg";

const About = () => {
  return (
    <section
      id="about"
      className="w-full pt-24 pb-44 px-4 sm:px-10 flex justify-center bg-[#fdf8f5]"
    >
      <div className="max-w-7xl w-full flex flex-col items-center bg-[#f8f2ed] backdrop-blur-xl rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-[#5c3a2e] mb-16 text-center drop-shadow-md tracking-wide">
          Sobre Nosotros
        </h2>

        <div className="grid md:grid-cols-3 gap-10 w-full">
         
          <div className="bg-[#fdf5f0] p-6 rounded-3xl shadow-md flex flex-col items-center hover:shadow-2xl transition-all">
            <img
              src={ideal}
              alt="Nuestra Misión"
              className="rounded-2xl w-full h-64 object-cover mb-5"
            />
            <h3 className="text-xl font-semibold text-[#6d4c41] mb-2">
              Nuestra Misión
            </h3>
            <p className="text-[#5a4033] text-sm leading-relaxed text-center px-2">
              En <span className="font-bold">Idealz</span>, creemos que la felicidad comienza con una paleta. Nuestro objetivo es simple: brindar alegría en cada bocado con sabores tropicales, frutales y cremosos hechos con amor e ingredientes locales. 💖
            </p>
          </div>

      
          <div className="bg-[#fdf5f0] p-6 rounded-3xl shadow-md flex flex-col items-center hover:shadow-2xl transition-all">
            <img
              src={fam}
              alt="Nuestra Historia"
              className="rounded-2xl w-full h-64 object-cover mb-5"
            />
            <h3 className="text-xl font-semibold text-[#6d4c41] mb-2">
              Nuestra Historia
            </h3>
            <p className="text-[#5a4033] text-sm leading-relaxed text-center px-2">
              Lo que comenzó como un pequeño sueño familiar en Belice, ahora es el favorito de la comunidad. Combinamos tradición y creatividad para crear helados que sacan sonrisas a cada generación — desde niños hasta abuelitas.
            </p>
          </div>

          
          <div className="bg-[#fdf5f0] p-6 rounded-3xl shadow-md flex flex-col items-center hover:shadow-2xl transition-all">
            <img
              src={blz}
              alt="Nuestros Sabores"
              className="rounded-2xl w-full h-64 object-cover mb-5"
            />
            <h3 className="text-xl font-semibold text-[#6d4c41] mb-2">
              Nuestros Sabores
            </h3>
            <p className="text-[#5a4033] text-sm leading-relaxed text-center px-2">
              Desde <span className="font-bold">Mango</span> y <span className="font-bold">Picafresa</span> hasta nuestra icónica <span className="font-bold">Mangonada</span>, elaboramos cada paleta para endulzar tu día. ¡Ven a refrescarte con nosotros! 🍦🇧🇿
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
