import React from 'react'

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
        <p className="text-gray-600 mb-6 text-lg">
          At <span className="text-pink-500 font-semibold">Idealz</span>, we believe that happiness starts with a paleta.  
          Our mission is simple: bring joy to every bite with tropical, fruity, and creamy flavors made with love and local ingredients. 💖
        </p>

        <p className="text-gray-600 mb-6">
          What started as a small family idea in Belize has grown into a community favorite.
          We mix tradition and creativity to create frozen treats that bring people together — from kids to abuelitas.
        </p>

        <p className="text-gray-600">
          Whether it’s <span className="font-medium text-yellow-600">Mango</span>, <span className="font-medium text-pink-600">Picafresa</span>, or our famous <span className="font-medium text-brown-600">Chocolate Coco</span>,  
          we’re here to sweeten your day. Come chill with us! 🍦🇧🇿
        </p>
      </div>
    </section>
  )
}

export default About
