export default function Hero() {
  return (
    <section className="w-full min-h-[90vh] flex items-center justify-center px-6">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-4xl w-full text-center">
        <h2 className="text-5xl sm:text-6xl font-extrabold text-rose-700 mb-6 drop-shadow-md">
          Bienvenidos a Idealz 🇧🇿
        </h2>
        <p className="text-xl text-amber-800 mb-4 font-medium">
          ¡Consigue tu antojo helado — dulce, frutal, cremoso y frío!
        </p>
        <h3 className="text-lg text-pink-700 font-semibold mb-8">
          Echa un vistazo a nuestros sabores increíbles
        </h3>
        <button
          onClick={() => (window.location.href = "/menu")}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
        >
          Ordenar Ahora
        </button>
      </div>
    </section>
  );
}
