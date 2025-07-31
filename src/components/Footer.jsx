import React from 'react'
import logo from '../assets/ddelogo.jpeg'

const Footer = () => {
  return (
    <footer className="bg-pink-100 w-full text-center text-sm text-rose-700 pt-10 pb-6 px-4 border-t border-rose-200">
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
  )
}

export default Footer