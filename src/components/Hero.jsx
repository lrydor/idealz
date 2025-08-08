import nanceImg from "../assets/products/nance.jpeg";

export default function Hero() {
  return (
    <section
      className="w-full min-h-[90vh] flex items-center justify-center px-6 bg-cover bg-center"
      style={{
        backgroundImage: `url(${nanceImg})`,
      }}
    >
      <div className="bg-[#ffffffdc] backdrop-blur-sm p-10 rounded-3xl shadow-2xl max-w-4xl w-full text-center border border-[#d7ccc8]">
        <h2 className="text-5xl sm:text-6xl font-serif text-[#4e342e] mb-6 drop-shadow-md tracking-wide">
          Bienvenidos a Idealz 🍨
        </h2>
        <p className="text-xl text-[#6d4c41] mb-4 font-medium">
          Disfruta de sabores artesanales irresistibles y únicos
        </p>
        <h3 className="text-lg text-[#5d4037] font-semibold mb-8 italic">
          Dulces, frutales y cremosos — ¡para cada gusto!
        </h3>
        <button
          onClick={() => (window.location.href = "/menu")}
          className="bg-[#4e342e] hover:bg-[#3e2723] text-[#fff8f1] font-bold py-3 px-10 rounded-full transition duration-300 shadow-lg uppercase tracking-wider"
        >
          Ver el Menú
        </button>
      </div>
    </section>
  );
}
