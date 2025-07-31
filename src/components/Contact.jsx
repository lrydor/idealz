// import React from 'react'

// const Contact = () => {
//   return (
//     <section id="contact" className="py-20 bg-yellow-50">
//       <div className="max-w-3xl mx-auto px-4 text-center">
//         <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
//         <p className="text-gray-600 mb-8">
//           Do you have questions, suggestions, or just want to say hola?  
//           We’d love to hear from you! 🌞🍧
//         </p>

//         <div className="space-y-4 text-gray-700">
//           <p>
//             📍 Visit us: Ranchito, Corozal
//           </p>
//           <p>
//             📞 Call us: +501 000-0000
//           </p>
//           <p>
//             📩 Email: <a href="mailto:paletas@idealz.com" className="text-blue-600 hover:underline">paletas@idealz.com</a>
//           </p>
//         </div>

//         <div className="mt-10">
//           <a
//             href="mailto:paletas@idealz.com"
//             className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition"
//           >
//             Send us a message
//           </a>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Contact


import React from 'react'
import logo from '../assets/ddlogo.png'

const Contact = () => {
  return (
    <>
      {/* Sección de contacto */}
      <section id="contact" className="w-full pt-28 pb-24 px-4 flex justify-center">
        <div className="max-w-5xl w-full bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 text-center">
          <h2 className="text-4xl font-extrabold text-rose-600 mb-6 drop-shadow-sm">
            Contact Us
          </h2>
          <p className="text-amber-800 text-lg mb-8 font-medium">
            Do you have questions, suggestions, or just want to say hola? 🌞🍧 <br />
            We'd love to hear from you!
          </p>

          <div className="text-gray-800 space-y-6 mb-10">
            <p className="font-medium text-lg">📍 Visit us: Ranchito, Corozal</p>

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

            <p className="font-medium text-lg">📞 Call us: +501 000-0000</p>
            <p className="text-lg">
              📩 Email: <a href="mailto:paletas@idealz.com" className="text-pink-600 hover:underline">paletas@idealz.com</a>
            </p>
          </div>

          <a
            href="mailto:paletas@idealz.com"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition"
          >
            Send us a message
          </a>
        </div>
      </section>

      <footer className="w-full bg-pink-100 text-center text-sm text-rose-700 pt-10 pb-6 px-4 border-t border-rose-200">
        <div className="flex flex-col items-center gap-3 mb-4">
          <img src={logo} alt="D&D Logo" className="h-14" />
          <p className="font-bold text-pink-600">D&D CREATION</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-4 text-xs font-medium">
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Help</a>
        </div>

        <div className="mb-3">
          <p className="text-xs">Contact us:</p>
          <p className="text-xs">
            📧 <a href="mailto:dorran.solis@unadeca.net" className="hover:underline">dorran.solis@unadeca.net</a> | <a href="mailto:d.ruiz@unadeca.net" className="hover:underline">d.ruiz@unadeca.net</a>
          </p>
        </div>

        <p className="text-xs max-w-xl mx-auto text-rose-500">
          D&D CREATION is a creative project made for learning and fun. All product names, logos, and brands are property of their respective owners.
        </p>

        <p className="mt-4 text-xs text-rose-400">&copy; 2025 D&D. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Contact