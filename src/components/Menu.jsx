import ideal1 from '../assets/products/nance.jpeg'
import ideal2 from '../assets/products/corn.jpeg'

// pages imported section
import Navbar from './Navbar'

export default function Grid() {
  const paletas = ['Nance', 'Corn', 'Coco', 'Limón', 'Chocolate', 'Piña']
  const images = [ideal1, ideal2]

  return (
   <>
    <Navbar />
    <section className="w-full bg-white py-12">
      
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-6">
        {paletas.map((flavor, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-white to-yellow-50 rounded-xl shadow hover:shadow-md transition p-6 text-center"
          >
            <img
              src={images[idx % images.length]}
              alt={flavor}
              className="h-24 w-24 mx-auto mb-4 object-contain"
            />
            <h3 className="font-bold text-xl text-gray-800 mb-2">{flavor}</h3>
            <p className="text-gray-500">Delicious and refreshing!</p>
          </div>
        ))}
      </div>
    </section>
       </>
  )
}
