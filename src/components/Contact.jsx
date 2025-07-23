import React from 'react'

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-yellow-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-8">
          Do you have questions, suggestions, or just want to say hola?  
          We’d love to hear from you! 🌞🍧
        </p>

        <div className="space-y-4 text-gray-700">
          <p>
            📍 Visit us: Ranchito, Corozal
          </p>
          <p>
            📞 Call us: +501 000-0000
          </p>
          <p>
            📩 Email: <a href="mailto:paletas@idealz.com" className="text-blue-600 hover:underline">paletas@idealz.com</a>
          </p>
        </div>

        <div className="mt-10">
          <a
            href="mailto:paletas@idealz.com"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition"
          >
            Send us a message
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
