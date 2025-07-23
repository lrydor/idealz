import ideal1 from '../assets/products/nance.jpeg'
import ideal2 from '../assets/products/corn.jpeg'
import Navbar from './Navbar'

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
  ]

  return (
    <>
      <Navbar />
      <section className="w-full bg-gradient-to-br from-yellow-50 to-rose-100 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-4 relative"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-28 mx-auto mb-3 object-cover rounded-full border-4 border-yellow-200"
              />
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
              <p className="mt-2 font-semibold text-rose-500">${item.price.toFixed(2)}</p>

              {/* Add button (you can add icon later) */}
              <button
                className="absolute bottom-4 right-4 bg-rose-400 hover:bg-rose-500 text-white rounded-full px-3 py-1 shadow-md transition text-sm font-bold"
                onClick={() => console.log(`Added ${item.name} to cart`)}
              >
                +
              </button>
            </div>
          ))}
        </div>
        <div className='text-center mt-8 text-red-400 font-semibold text-lg'>
          <h1>NOTE: All prices are in BZD - Belizean Dollars</h1>
        </div>
      </section>
      
    </>
  )
}
