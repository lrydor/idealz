import React from 'react'

const About = () => {
  return (
    <section
      id="about"
      className="w-full pt-24 pb-0 px-10 flex justify-center"
    >
      <div className="max-w-7xl w-full flex flex-col items-center bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-pink-600 mb-12 text-center drop-shadow-md">
          About Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center">
            <h3 className="text-xl font-bold text-pink-600 mb-4">Our Mission</h3>
            <p className="text-gray-700">
              At <span className="text-pink-500 font-semibold">Idealz</span>, we believe happiness begins with a paleta.
              Our goal is simple: bring joy to every bite with tropical, fruity, and creamy flavors made with love and local ingredients. 💖
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center">
            <h3 className="text-xl font-bold text-pink-600 mb-4">Our Story</h3>
            <p className="text-gray-700">
              What began as a small family dream in Belize is now a community favorite.
              We blend tradition and creativity to create frozen treats that bring smiles to every generation — from kids to abuelitas.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center">
            <h3 className="text-xl font-bold text-pink-600 mb-4">Our Flavors</h3>
            <p className="text-gray-700">
              From <span className="text-yellow-600 font-semibold">Mango</span> and <span className="text-pink-600 font-semibold">Picafresa </span>
              to our iconic <span className="text-red-500 font-semibold">Mangonada</span>,
              we craft each paleta to sweeten your day. Come chill with us! 🍦🇧🇿
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About