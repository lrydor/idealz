import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "../components/Navbar";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });

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
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy validation
    if (
      !cardData.name ||
      !cardData.number ||
      !cardData.expiry ||
      !cardData.cvc
    ) {
      alert("Please fill in all card fields.");
      return;
    }

    // Dummy alert
    alert(`✅ Payment Successful!\nThank you for your purchase.`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white border rounded-lg p-4 shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-right font-bold text-rose-500">
                    ${item.product.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name on card"
                  value={cardData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Card number"
                  value={cardData.number}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={handleInputChange}
                    className="w-1/2 border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    name="cvc"
                    placeholder="CVC"
                    value={cardData.cvc}
                    onChange={handleInputChange}
                    className="w-1/2 border rounded px-3 py-2"
                  />
                </div>

                <div className="text-right text-lg font-bold mt-2">
                  Total: ${total.toFixed(2)}
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-full"
                >
                  Pay Now
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}