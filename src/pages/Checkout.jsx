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
      // Evita duplicados eliminando el contenido previo
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
            // Redirigir, limpiar, etc.
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
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-extrabold text-center text-rose-600 mb-10 drop-shadow">
          Finaliza tu compra 🌴
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Carrito */}
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold text-pink-600 mb-6">
                🛒 Tu Carrito
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-yellow-50 border border-rose-200 rounded-xl p-4 shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-14 w-14 rounded object-cover border-2 border-pink-200"
                      />
                      <div>
                        <p className="flex font-semibold text-rose-700">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-amber-700 font-bold">
                      ${item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PayPal only */}
            <div className="bg-white/80 backdrop-blur-2xl p-6 rounded-3xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-pink-600 mb-6 text-center">
                  💳 Pago con PayPal
                </h3>
                <p className="text-center text-gray-600 mb-4">
                  Paga con tarjeta o cuenta PayPal fácilmente.
                </p>
                <div className="text-right text-lg font-bold text-rose-500 mb-6">
                  Total: ${total.toFixed(2)}{" "}
                  <span className="text-sm text-gray-400">(BZD)</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div
                  id="paypal-button-container"
                  className="flex justify-center"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
