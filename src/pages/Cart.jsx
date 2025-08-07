import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("cart_items")
      .select("id, quantity, product:product_id (name, price, image_url)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error.message);
    } else {
      setCartItems(data);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", itemId);

    if (!error) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        )
      );
    } else {
      console.error("Error al actualizar cantidad:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-pink-600 drop-shadow-md">
          Tu Carrito
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-rose-100"
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-2xl border-2 border-yellow-200 shadow-md"
                />
                <div className="flex-1">
                  <h2 className="flex text-lg font-bold text-rose-700">
                    {item.product.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right font-bold text-amber-700 text-lg">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="text-right text-xl font-bold mt-6 text-pink-600 drop-shadow-sm">
              Total: ${total.toFixed(2)}
            </div>

            <div className="text-center mt-6">
              <a
                href="/checkout"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300"
              >
                Proceder al Pago →
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
