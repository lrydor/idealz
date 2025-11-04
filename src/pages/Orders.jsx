import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../context/AuthContext";

const STATUS_FLOW = ["pending", "in_progress", "ready", "delivered"];

export const STATUS_LABEL = {
  pending: "Pendiente",
  in_progress: "En preparación",
  ready: "Listo para entregar",
  delivered: "Entregado",
};

const NEXT_STATUS = {
  pending: "in_progress",
  in_progress: "ready",
  ready: "delivered",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("orders")
      .select(
        `
        id,
        status,
        user_id,
        created_at,
        order_items (
          id,
          product_id,
          name,
          price,
          quantity
        )
      `
      )
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setOrders([]);
    } else {
      setOrders(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-board")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupedOrders = useMemo(() => {
    return STATUS_FLOW.reduce((acc, status) => {
      acc[status] = orders.filter((order) => order.status === status);
      return acc;
    }, {});
  }, [orders]);

  const handleAdvance = async (orderId, nextStatus) => {
    if (!nextStatus || !user) return;
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", orderId);

    if (updateError) {
      setError(updateError.message);
    }
  };

  const handleResetError = () => setError(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#efebe9] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#4e342e] drop-shadow">
              Tablero de Pedidos
            </h1>
            <button
              onClick={fetchOrders}
              className="bg-[#6d4c41] hover:bg-[#4e342e] text-[#efebe9] font-semibold px-4 py-2 rounded-full shadow transition"
            >
              Refrescar
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-semibold">Error:</strong> {error}
              <button
                className="ml-4 underline"
                onClick={handleResetError}
              >
                Ocultar
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-center text-[#6d4c41]">Cargando pedidos...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {STATUS_FLOW.map((status) => (
                <div
                  key={status}
                  className="bg-[#f5f0ec] rounded-3xl shadow-lg border border-[#d7ccc8] p-4"
                >
                  <h2 className="text-xl font-bold text-[#4e342e] mb-4 text-center">
                    {STATUS_LABEL[status]}
                  </h2>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {groupedOrders[status]?.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl shadow border border-[#dbcac2] p-4 space-y-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#6d4c41]">
                            Pedido #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-[#8d6e63]">
                            Creado:{" "}
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>

                        <ul className="space-y-2">
                          {order.order_items?.map((item) => (
                            <li
                              key={item.id}
                              className="flex justify-between text-sm text-[#4e342e]"
                            >
                              <span>
                                {item.name ?? `Producto ${item.product_id}`} x{" "}
                                {item.quantity}
                              </span>
                              <span className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {NEXT_STATUS[status] ? (
                          <button
                            onClick={() =>
                              handleAdvance(order.id, NEXT_STATUS[status])
                            }
                            className="w-full bg-[#6d4c41] hover:bg-[#4e342e] text-white font-semibold py-2 rounded-full transition"
                          >
                            Pasar a {STATUS_LABEL[NEXT_STATUS[status]]}
                          </button>
                        ) : (
                          <p className="text-center text-xs text-[#8d6e63]">
                            Pedido finalizado
                          </p>
                        )}
                      </div>
                    ))}

                    {groupedOrders[status]?.length === 0 && (
                      <p className="text-sm text-center text-[#8d6e63]">
                        No hay pedidos en esta etapa.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
