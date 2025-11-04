import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../../supabaseClient";
import { STATUS_LABEL } from "./Orders";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(value);

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    uniqueUsers: 0,
    deliveredOrders: 0,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
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
            name,
            price,
            quantity
          )
        `
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setOrders(data ?? []);
      const totalOrders = data?.length ?? 0;
      const deliveredOrders =
        data?.filter((order) => order.status === "delivered").length ?? 0;
      const totalRevenue =
        data?.reduce((sum, order) => {
          const orderTotal = order.order_items?.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );
          return sum + (orderTotal ?? 0);
        }, 0) ?? 0;
      const uniqueUsers = new Set(
        (data ?? []).map((order) => order.user_id)
      ).size;

      setStats({
        totalOrders,
        totalRevenue,
        uniqueUsers,
        deliveredOrders,
      });
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#efebe9] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#4e342e] mb-10 text-center drop-shadow">
            Panel Administrativo
          </h1>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#d7ccc8] p-6 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold text-[#3e2723] mb-2">
                Total de Órdenes
              </h3>
              <p className="text-3xl font-bold text-[#4e342e]">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-[#d7ccc8] p-6 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold text-[#3e2723] mb-2">
                Órdenes Entregadas
              </h3>
              <p className="text-3xl font-bold text-[#4e342e]">
                {stats.deliveredOrders}
              </p>
            </div>
            <div className="bg-[#d7ccc8] p-6 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold text-[#3e2723] mb-2">
                Ingresos Totales
              </h3>
              <p className="text-3xl font-bold text-[#4e342e]">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="bg-[#d7ccc8] p-6 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold text-[#3e2723] mb-2">
                Clientes Únicos
              </h3>
              <p className="text-3xl font-bold text-[#4e342e]">
                {stats.uniqueUsers}
              </p>
            </div>
          </div>

          {/* Orders */}
          <h2 className="text-2xl font-bold text-[#4e342e] mb-6 border-b pb-2 border-[#6d4c41]">
            Órdenes Recientes
          </h2>
          <div className="bg-white rounded-2xl shadow overflow-hidden divide-y divide-[#e0d6d0]">
            {orders.map((order) => {
              const orderTotal =
                order.order_items?.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                ) ?? 0;

              return (
                <div
                  key={order.id}
                  className="px-6 py-4 hover:bg-[#f5f2f0] transition space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold flex text-[#5d4037]">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[#8d6e63]">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#3e2723] text-lg">
                        {formatCurrency(orderTotal)}
                      </p>
                      <p className="text-sm text-[#6d4c41] font-semibold">
                        Estado:{" "}
                        {STATUS_LABEL?.[order.status] ?? order.status ?? "N/A"}
                      </p>
                    </div>
                  </div>
                  {order.order_items?.length ? (
                    <ul className="text-sm text-[#4e342e] bg-[#f9f4f2] rounded-xl p-3 space-y-1">
                      {order.order_items.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center"
                        >
                          <span>
                            {item.name ?? `Producto ${item.product_id}`} x{" "}
                            {item.quantity}
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#8d6e63]">
                      Sin productos registrados.
                    </p>
                  )}
                </div>
              );
            })}

            {orders.length === 0 && (
              <p className="p-6 text-center text-[#6d4c41]">
                No hay órdenes registradas aún.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
