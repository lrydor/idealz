import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusError, setStatusError] = useState(null);

  const fetchCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        "id, quantity, product_id, product:product_id (id, name, price, image_url)"
      )
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

  const clearStatus = () => {
    setStatusError(null);
    setStatusMessage(null);
  };

  const createOrderFromCart = async () => {
    clearStatus();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setStatusError("Debes iniciar sesión para confirmar tu pedido.");
      return;
    }

    if (cartItems.length === 0) {
      setStatusError("Tu carrito está vacío.");
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (orderError) {
      setStatusError(orderError.message);
      return;
    }

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(
        cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }))
      );

    if (itemsError) {
      setStatusError(itemsError.message);
      return;
    }

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      setStatusError(deleteError.message);
      return;
    }

    setStatusMessage("Pedido confirmado correctamente.");
    setCartItems([]);
  };

  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-br from-[#efebe9] to-[#d7ccc8] py-16 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-[#5d4037] drop-shadow">
            Tu Carrito
          </h1>

          {statusMessage && (
            <p className="text-center text-green-600 font-medium mb-4">
              {statusMessage}
            </p>
          )}
          {statusError && (
            <p className="text-center text-red-500 font-medium mb-4">
              {statusError}
            </p>
          )}

          {cartItems.length === 0 ? (
            <p className="text-center text-[#6d4c41] font-medium">
              Tu carrito está vacío.
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[#efebe9] rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 p-4 border border-[#d7ccc8]"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-2xl border-2 border-[#d7ccc8] shadow-md"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#4e342e]">
                      {item.product.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 bg-[#d7ccc8] text-[#4e342e] rounded hover:bg-[#bcaaa4] transition"
                      >
                        -
                      </button>
                      <span className="font-medium text-[#3e2723]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-[#d7ccc8] text-[#4e342e] rounded hover:bg-[#bcaaa4] transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-bold text-[#5d4037] text-lg">
                    {(item.product.price * item.quantity).toFixed(2)} GTQ
                  </div>
                </div>
              ))}

              <div className="text-right text-xl font-bold mt-6 text-[#4e342e] drop-shadow">
                Total: {total.toFixed(2)} GTQ
              </div>

              <div className="text-center mt-6">
                <a
                  href="/checkout"
                  className="inline-block bg-[#6d4c41] hover:bg-[#4e342e] text-[#efebe9] font-semibold px-8 py-3 rounded-full shadow-lg transition"
                >
                  Proceder al Pago →
                </a>
                <button
                  onClick={createOrderFromCart}
                  className="ml-3 inline-block bg-[#4e342e] hover:bg-[#3e2723] text-[#efebe9] font-semibold px-8 py-3 rounded-full shadow-lg transition"
                >
                  Confirmar Pedido sin Pago
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
