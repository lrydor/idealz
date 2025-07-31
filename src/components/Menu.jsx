import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import logo from "../assets/ddelogo.jpeg";
import { supabase } from "../../supabaseClient";

export default function Grid() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsOpen(false);
  };

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

  const addToCart = async (productId, quantity) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return alert("You must be logged in to add items to the cart.");
    }

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
          <h1 className="text-4xl font-extrabold text-rose-600 mb-4 drop-shadow">
            Order By Unit
          </h1>
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
              <h3 className="text-2xl font-bold text-rose-600 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 px-2">{item.desc}</p>
              <p className="text-lg font-semibold text-amber-700 mb-4">
                ${item.price.toFixed(2)} / each
              </p>
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition"
                onClick={() => openModal(item)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 text-rose-400 font-semibold text-lg">
          <h1>NOTE: All prices are in BZD - Belizean Dollars</h1>
        </div>
      </section>

      {/* Modal */}
      {isOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
              onClick={closeModal}
            >
              ×
            </button>
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-24 h-24 mx-auto object-cover rounded-full border-4 border-yellow-200 mb-4"
            />
            <h2 className="text-xl font-bold text-center">
              {selectedProduct.name}
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              {selectedProduct.description}
            </p>
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

      {/* FOOTER */}
      <footer className="w-full bg-pink-100 text-center text-sm text-rose-700 pt-10 pb-6 px-4 border-t border-rose-200">
        <div className="flex flex-col items-center gap-3 mb-4">
          <img src={logo} alt="D&D Logo" className="h-14" />
          <p className="font-bold text-pink-600">D&D CREATION</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-xs font-medium">
          <a href="#" className="hover:underline">
            Terms of Use
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
        </div>
        <div className="mb-3">
          <p className="text-xs">Contact us:</p>
          <p className="text-xs">
            📧{" "}
            <a
              href="mailto:dorran.solis@unadeca.net"
              className="hover:underline"
            >
              dorran.solis@unadeca.net
            </a>{" "}
            |{" "}
            <a href="mailto:d.ruiz@unadeca.net" className="hover:underline">
              d.ruiz@unadeca.net
            </a>
          </p>
        </div>
        <p className="text-xs max-w-xl mx-auto text-rose-500">
          D&D CREATION is a creative project made for learning and fun.
        </p>
        <p className="mt-4 text-xs text-rose-400">
          &copy; 2025 D&D. All rights reserved.
        </p>
      </footer>
    </>
  );
}
