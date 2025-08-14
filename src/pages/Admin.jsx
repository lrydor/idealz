import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    uniqueUsers: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          "id, quantity, user_id, created_at, product:product_id(name, price)"
        );

      if (error) {
        console.error("Error fetching cart_items:", error.message);
        return;
      }

      setOrders(data);

      // Stats calculation
      const totalOrders = data.length;
      const totalRevenue = data.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      );
      const uniqueUsers = new Set(data.map((item) => item.user_id)).size;

      setStats({ totalOrders, totalRevenue, uniqueUsers });
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

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
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
                Ingresos Totales
              </h3>
              <p className="text-3xl font-bold text-[#4e342e]">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-[#d7ccc8] p-6 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold text-[#3e2723] mb-2">
                Usuarios Activos
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
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center px-6 py-4 hover:bg-[#f5f2f0] transition"
              >
                <div>
                  <p className="font-bold flex text-[#5d4037]">
                    {order.product.name}
                  </p>
                  <p className="text-sm text-[#6d4c41]">
                    Cantidad: {order.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#3e2723] text-lg">
                    ${(order.quantity * order.product.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-[#8d6e63]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

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
