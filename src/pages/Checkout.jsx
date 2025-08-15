import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "../components/Navbar";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("cart_items")
        .select("id, quantity, product:product_id (name, price, image_url)")
        .eq("user_id", user.id);

      if (!error) setCartItems(data);
    };

    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  useEffect(() => {
    const renderPayPalButton = () => {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";
      }

      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: total.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            alert(
              `✅ Pago con PayPal completado por ${details.payer.name.given_name}`
            );
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            alert("❌ Hubo un error con PayPal.");
          },
        })
        .render("#paypal-button-container");
    };

    if (window.paypal && cartItems.length > 0) {
      renderPayPalButton();
    }
  }, [cartItems]);

  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-br from-[#efebe9] to-[#d7ccc8] py-16 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-[#5d4037] mb-10 drop-shadow">
            Finaliza tu compra 🌴
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-center text-[#6d4c41] font-medium">
              Tu carrito está vacío.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Carrito */}
              <div className="bg-[#efebe9] p-6 rounded-3xl shadow-xl border border-[#d7ccc8]">
                <h3 className="text-2xl font-bold text-[#4e342e] mb-6">
                  🛒 Tu Carrito
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#d7ccc8] border border-[#bcaaa4] rounded-xl p-4 shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-14 w-14 rounded object-cover border-2 border-[#bcaaa4]"
                        />
                        <div>
                          <p className="flex font-semibold text-[#3e2723]">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-[#5d4037]">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-[#5d4037] font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)} BZD
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PayPal only */}
              <div className="bg-[#efebe9] p-6 rounded-3xl shadow-xl border border-[#d7ccc8] flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#4e342e] mb-6 text-center">
                    💳 Pago con PayPal
                  </h3>
                  <p className="text-center text-[#6d4c41] mb-4">
                    Paga con tarjeta o cuenta PayPal fácilmente.
                  </p>
                  <div className="text-right text-lg font-bold text-[#3e2723] mb-6">
                    Total: ${total.toFixed(2)}{" "}
                    <span className="text-sm text-[#6d4c41]">(BZD)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d7ccc8]">
                  <div
                    id="paypal-button-container"
                    className="flex justify-center"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
