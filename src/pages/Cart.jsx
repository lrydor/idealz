import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-rose-500">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl shadow p-4">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg border border-yellow-200"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800">{item.product.name}</h2>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right font-semibold text-rose-500 text-lg">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="text-right text-xl font-bold mt-6 text-rose-600">
              Total: ${total.toFixed(2)}
            </div>

            <div className="text-center mt-6">
              <a
                href="/checkout"
                className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-full transition"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
