import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "./Navbar";

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
      console.error("Error fetching cart:", error);
    } else {
      setCartItems(data);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-4 rounded-lg bg-white shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-lg">
                  ${item.product.price * item.quantity}
                </p>
              </div>
            ))}
            <div className="text-right font-bold text-xl mt-4">
              Total: ${totalPrice}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
