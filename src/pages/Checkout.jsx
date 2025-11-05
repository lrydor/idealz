import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "../components/Navbar";
import CheckoutLocal from "../pages/CheckoutLocal";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const { user } = useAuth();

  // 🔹 Obtener el carrito del usuario
  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        "id, quantity, product_id, product:product_id (id, name, price, image_url)"
      )
      .eq("user_id", user.id);

    if (error) {
      console.error("Error al obtener carrito:", error.message);
      setCartItems([]);
    } else {
      setCartItems(data || []);
    }
  };

  // 🔹 Cargar carrito cuando cambia el usuario
  useEffect(() => {
    fetchCart();
  }, [user]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const clearStatus = () => {
    setStatusError(null);
    setStatusMessage(null);
  };

  // 🔹 Crear pedido desde el carrito
  const createOrderFromCart = async () => {
    clearStatus();

    if (!user) {
      setStatusError("Debes iniciar sesión para completar tu pedido.");
      return null;
    }

    if (cartItems.length === 0) {
      setStatusError("No hay productos en el carrito.");
      return null;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (orderError) {
      setStatusError(orderError.message);
      return null;
    }

    const orderId = order.id;

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(
        cartItems.map((item) => ({
          order_id: orderId,
          product_id: item.product_id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }))
      );

    if (itemsError) {
      setStatusError(itemsError.message);
      return null;
    }

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      setStatusError(deleteError.message);
      return null;
    }

    setCartItems([]);
    setStatusMessage("✅ Pedido creado correctamente.");
    return orderId;
  };

  // 🔹 Renderizar botón de PayPal
  useEffect(() => {
    const renderPayPalButton = () => {
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";

      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: total.toFixed(2) },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            setStatusMessage(
              `✅ Pago con PayPal completado por ${details.payer.name.given_name}`
            );
            const orderId = await createOrderFromCart();
            if (!orderId) {
              setStatusError(
                "El pago se procesó pero no se pudo registrar el pedido. Revisa la consola."
              );
            }
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            setStatusError("❌ Hubo un error con PayPal.");
          },
        })
        .render("#paypal-button-container");
    };

    if (window.paypal && cartItems.length > 0) {
      renderPayPalButton();
    }
  }, [cartItems, total]);

  // 🔹 Render principal
  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-br from-[#efebe9] to-[#d7ccc8] py-16 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-[#5d4037] mb-10 drop-shadow">
            Finaliza tu compra 🌴
          </h2>

          {statusMessage && (
            <div className="mb-6 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded relative">
              {statusMessage}
            </div>
          )}
          {statusError && (
            <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {statusError}
            </div>
          )}

          {cartItems.length === 0 ? (
            <p className="text-center text-[#6d4c41] font-medium">
              Tu carrito está vacío.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* 🛒 Carrito */}
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

              {/* 💳 Métodos de pago */}
              <div className="flex flex-col gap-6">
                {/* PayPal */}
                <div className="bg-[#efebe9] p-6 rounded-3xl shadow-xl border border-[#d7ccc8]">
                  <h3 className="text-2xl font-bold text-[#4e342e] mb-4 text-center">
                    💳 Pago con PayPal
                  </h3>
                  <p className="text-center text-[#6d4c41] mb-4">
                    Paga con tarjeta o cuenta PayPal.
                  </p>
                  <div className="text-right text-lg font-bold text-[#3e2723] mb-4">
                    Total: ${total.toFixed(2)}{" "}
                    <span className="text-sm text-[#6d4c41]">(BZD)</span>
                  </div>
                  <div
                    id="paypal-button-container"
                    className="flex justify-center"
                  />
                </div>

                {/* Pago en el lugar */}
                <div className="bg-[#efebe9] p-6 rounded-3xl shadow-xl border border-[#d7ccc8]">
                  <h3 className="text-2xl font-bold text-[#4e342e] mb-2 text-center">
                    💵 Pago en el lugar
                  </h3>
                  <p className="text-center text-[#6d4c41] mb-4">
                    Confirma ahora y pagas al recoger en caja.
                  </p>
                  <div className="text-right text-lg font-bold text-[#3e2723] mb-4">
                    Total: ${total.toFixed(2)}{" "}
                    <span className="text-sm text-[#6d4c41]">(BZD)</span>
                  </div>

                  <CheckoutLocal
                    onSuccess={async (orderId) => {
                      await fetchCart(); // limpiar carrito tras crear orden
                      alert(`✅ Orden creada para pago en sitio.\nID: ${orderId}`);
                    }}
                  />
                  <button
                    onClick={createOrderFromCart}
                    className="mt-4 w-full bg-[#6d4c41] hover:bg-[#4e342e] text-[#efebe9] font-semibold py-3 rounded-full shadow transition"
                  >
                    Registrar Pedido sin PayPal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}