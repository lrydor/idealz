import logo from "../assets/ddlogo.png";

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f5] w-full text-center text-sm text-[#6d4c41] pt-10 pb-6 px-4 border-t border-[#d7ccc8]">
      <div className="flex flex-col items-center gap-3 mb-4">
        <img src={logo} alt="D&D Logo" className="h-14" />
        <p className="font-bold text-[#8d6e63]">D&D CREACIÓN</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-4 text-xs font-medium">
        <a href="#" className="hover:underline text-[#6d4c41] hover:text-[#4e342e]">
          Términos de Uso
        </a>
        <a href="#" className="hover:underline text-[#6d4c41] hover:text-[#4e342e]">
          Política de Privacidad
        </a>
        <a href="#" className="hover:underline text-[#6d4c41] hover:text-[#4e342e]">
          Contacto
        </a>
        <a href="#" className="hover:underline text-[#6d4c41] hover:text-[#4e342e]">
          Ayuda
        </a>
      </div>

      <div className="mb-3">
        <p className="text-xs text-[#5d4037]">Contáctanos:</p>
        <p className="text-xs text-[#5d4037]">
          📧{" "}
          <a href="mailto:dorran.solis@unadeca.net" className="hover:underline text-[#6d4c41] hover:text-[#4e342e]">
            dorran.solis@unadeca.net
          </a>{" "}
          |{" "}
          <a href="mailto:d.ruiz@unadeca.net" className="hover:underline text-[#6d4c41] hover:text-[#4e342e]">
            d.ruiz@unadeca.net
          </a>
        </p>
      </div>

      <p className="text-xs max-w-xl mx-auto text-[#8d6e63]">
        D&D CREACIÓN es un proyecto creativo hecho para aprender y divertirse.
        Todos los nombres de productos, logotipos y marcas son propiedad de sus
        respectivos dueños.
      </p>

      <p className="mt-4 text-xs text-[#a1887f]">
        &copy; 2025 D&D. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
