
export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-r from-yellow-100 to-pink-100 py-16 text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to Idealz 🇧🇿
        </h2>
        <p className="text-lg text-gray-600">
          Get your frozen treat fix — sweet, fruity, creamy and cold!
        </p>
        <div className="text-lg mt-4">
          <h1>Take a look at our amazing flavors</h1>
          <button 
            onClick={() => window.location.href = '/menu'} 
            className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-lg"
          >
            Order Now
          </button>
        </div>
      </div>
    </section>
  )
}
