export default function Grid() {
  const paletas = ['Picafresa', 'Mango', 'Coco', 'Limón', 'Chocolate', 'Piña']

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-6">
        {paletas.map((flavor, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-white to-yellow-50 rounded-xl shadow hover:shadow-md transition p-6 text-center"
          >
            <h3 className="font-bold text-xl text-gray-800 mb-2">{flavor}</h3>
            <p className="text-gray-500">Delicious and refreshing!</p>
          </div>
        ))}
      </div>
    </section>
  )
}
