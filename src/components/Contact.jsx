import React from "react";
import logo from "../assets/ddlogo.png";

const Contact = () => {
  return (
    <>
      {/* Sección de contacto */}
      <section
        id="contact"
        className="w-full pt-28 pb-24 px-4 flex justify-center"
      >
        <div className="max-w-5xl w-full bg-[#f5f5f5]/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 text-center">
          <h2 className="text-4xl font-extrabold text-[#6d4c41] mb-6 drop-shadow-sm">
            Contáctanos
          </h2>
          <p className="text-[#4e342e] text-lg mb-8 font-medium">
            ¿Tienes preguntas, sugerencias o simplemente quieres decir hola?
            🌞🍧 <br />
            ¡Nos encantaría saber de ti!
          </p>

          <div className="text-[#5d4037] space-y-6 mb-10">
            <p className="font-medium text-lg">
              📍 Visítanos: Ranchito, Corozal
            </p>

            <div className="rounded-2xl overflow-hidden shadow-md w-full h-[450px]">
              <iframe
                title="Google Map of Ranchito"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3921.6542694582745!2d-88.38951612523737!3d18.387950482636037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5e44cf272e3a05%3A0x95a00b4b842060cf!2sRanchito!5e0!3m2!1ses-419!2sbz!4v1721682431234"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0 w-full h-full"
              ></iframe>
            </div>

            <p className="font-medium text-lg">📞 Llámanos: +501 000-0000</p>
            <p className="text-lg">
              📩 Correo electrónico:{" "}
              <a
                href="mailto:paletas@idealz.com"
                className="text-[#6d4c41] hover:text-[#4e342e] hover:underline font-semibold"
              >
                paletas@idealz.com
              </a>
            </p>
          </div>

          <a
            href="mailto:paletas@idealz.com"
            className="inline-block bg-[#6d4c41] hover:bg-[#4e342e] text-[#f5f5f5] font-semibold py-3 px-8 rounded-full shadow-md transition"
          >
            Envíanos un mensaje
          </a>
        </div>
      </section>
    </>
  );
};

export default Contact;
