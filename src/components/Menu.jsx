import ideal1 from "../assets/products/nance.jpeg";
import ideal2 from "../assets/products/corn.jpeg";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Grid() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsOpen(false);
  };
  const [products, setProducts] = useState([]);

  //fetching products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);
  
  // logic to add items to the cart
  const addToCart = async (productId, quantity) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return alert("You must be logged in to add items to the cart.");
    }

    // Check if already in cart
    const { data: existingItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking cart:", fetchError.message);
      return;
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Error updating cart:", updateError.message);
      } else {
        console.log("Cart item updated!");
      }
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert([
        {
          user_id: user.id,
          product_id: productId,
          quantity,
        },
      ]);

      if (insertError) {
        console.error("Error adding to cart:", insertError.message);
      } else {
        console.log("Item added to cart!");
      }
    }
  };

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
                src={item.image_url}
                alt={item.name}
                className="w-full h-60 object-cover rounded-2xl mb-6 shadow-md"
              />
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
              <p className="mt-2 font-semibold text-rose-500">
                ${item.price.toFixed(2)}
              </p>

              {/* Add button (you can add icon later) */}
              <button
                className="absolute bottom-4 right-4 bg-rose-400 hover:bg-rose-500 text-white rounded-full px-3 py-1 shadow-md transition text-sm font-bold"
                onClick={() => openModal(item)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 text-red-400 font-semibold text-lg">
          <h1>NOTE: All prices are in BZD - Belizean Dollars</h1>
        </div>
      </section>
      {isOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
            {/* Cerrar */}
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
              onClick={closeModal}
            >
              ×
            </button>

            {/* Imagen */}
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-24 h-24 mx-auto object-cover rounded-full border-4 border-yellow-200 mb-4"
            />

            {/* Título y descripción */}
            <h2 className="text-xl font-bold text-center">
              {selectedProduct.name}
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              {selectedProduct.description}
            </p>

            {/* Cantidad */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <label className="font-medium">Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-16 border rounded px-2 py-1 text-center"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await addToCart(selectedProduct.id, quantity);
                  closeModal();
                }}
                className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
