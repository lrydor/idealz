import React from 'react';
import ideal1 from '../assets/products/nance.jpeg';
import ideal2 from '../assets/products/corn.jpeg';
import logo from '../assets/ddlogo.png'; // ✅ Asegúrate de que la ruta sea correcta
import Navbar from './Navbar';

export default function Grid() {
  const products = [
    { name: 'Nance', image: ideal1, price: 2.5, desc: 'Sweet tropical yellow fruit flavor' },
    { name: 'Sugar Corn', image: ideal2, price: 2.5, desc: 'Sweet creamy corn flavor' },
    { name: 'Pica Fresa', image: ideal1, price: 2.5, desc: 'Spicy strawberry delight' },
    { name: 'Mangonada', image: ideal2, price: 2.5, desc: 'Tangy mango with chili' },
    { name: 'Piña Colada', image: ideal1, price: 2.5, desc: 'Tropical pineapple and coconut mix' },
    { name: 'Snickers', image: ideal2, price: 2.5, desc: 'Caramel, peanut and chocolate blend' },
    { name: 'Oreo', image: ideal2, price: 2.5, desc: 'Cookies and cream classic' },
    { name: 'Coconut', image: ideal2, price: 2.5, desc: 'Creamy tropical coconut flavor' },
    { name: 'Peanuts', image: ideal2, price: 2.5, desc: 'Roasted nutty goodness' },
  ];

  const dozensPrice = (unitPrice) => (unitPrice * 12 * 0.9).toFixed(2); // 10% discount for dozen

  return (
    <>
      <Navbar />
      <section className="w-full bg-gradient-to-br from-yellow-50 to-rose-100 py-16 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-rose-600 mb-4 drop-shadow">Order By Unit</h1>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center p-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded-2xl mb-6 shadow-md"
              />
              <h3 className="text-2xl font-bold text-rose-600 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 px-2">{item.desc}</p>
              <p className="text-lg font-semibold text-amber-700 mb-4">${item.price.toFixed(2)} / each</p>
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition"
                onClick={() => console.log(`Added ${item.name} (CU) to cart`)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-20 mb-10">
          <h1 className="text-4xl font-extrabold text-pink-600 mb-4 drop-shadow">Order By Dozen</h1>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((item, idx) => (
            <div
              key={`dozen-${idx}`}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center p-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded-2xl mb-6 shadow-md"
              />
              <h3 className="text-2xl font-bold text-pink-600 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 px-2">{item.desc}</p>
              <p className="text-lg font-semibold text-rose-700 mb-4">
                ${dozensPrice(item.price)} / dozen
              </p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition"
                onClick={() => console.log(`Added ${item.name} (Dozen) to cart`)}
              >
                Add dozen
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 text-rose-400 font-semibold text-lg">
          <h1>NOTE: All prices are in BZD - Belizean Dollars</h1>
        </div>
      </section>

      {/* FOOTER */}
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
  );
}
