import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const VISIBLE = ["PENDIENTE", "EN_PREPARACION", "LISTO"];

export default function DisplayQueue() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, total, created_at, table_number, payment_method, order_items(name, quantity)")
      .in("status", VISIBLE)
      .order("created_at", { ascending: true });
    if (!error) setOrders(data ?? []);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("orders-queue")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async (payload) => {
          const row = payload.new ?? payload.old;
          const visible = VISIBLE.includes(row.status);

          // Si es un UPDATE, recargar los datos completos de la orden para obtener order_items y asegurar sincronización
          if (payload.eventType === "UPDATE") {
            // Verificar si la orden es visible antes o después del cambio
            const wasVisible = VISIBLE.includes(payload.old?.status);
            const isVisible = visible;
            
            // Si cambió la visibilidad o es visible, recargar datos completos
            if (isVisible || wasVisible) {
              const { data: fullOrder } = await supabase
                .from("orders")
                .select("id, status, total, created_at, table_number, payment_method, order_items(name, quantity)")
                .eq("id", row.id)
                .single();

              if (fullOrder) {
                const shouldBeVisible = VISIBLE.includes(fullOrder.status);

                setOrders((prev) => {
                  let next = [...prev];
                  const i = next.findIndex((o) => o.id === fullOrder.id);
                  if (i >= 0) {
                    // Solo actualizar si el estado recibido es válido y visible
                    if (shouldBeVisible) {
                      next[i] = fullOrder;
                    } else {
                      // Si el estado ya no es visible, remover la orden
                      next.splice(i, 1);
                    }
                  } else if (shouldBeVisible) {
                    // Agregar la orden si no existe y es visible
                    next = [...next, fullOrder];
                  }
                  next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                  return next;
                });
                return;
              }
            }
          }

          setOrders((prev) => {
            let next = [...prev];
            if (payload.eventType === "INSERT") {
              if (visible) next = [...prev, row].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
            } else if (payload.eventType === "UPDATE") {
              const i = next.findIndex(o => o.id === row.id);
              if (i >= 0) {
                if (visible) {
                  // Actualizar completamente la orden para mantener el estado
                  next[i] = { ...next[i], ...row };
                  // Reordenar por fecha
                  next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                } else {
                  next.splice(i, 1);
                }
              } else if (visible) {
                next = [...next, row];
                next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
              }
            } else if (payload.eventType === "DELETE") {
              next = next.filter(o => o.id !== row.id);
            }
            return next;
          });
        }
      )
      .subscribe();

    const t = setInterval(load, 15000);
    return () => { supabase.removeChannel(channel); clearInterval(t); };
  }, []);

  return (
    <div className="min-h-screen bg-[#efebe9] p-6">
      <h1 className="text-4xl font-extrabold text-[#5d4037] mb-6">Órdenes</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {VISIBLE.map((state) => (
          <section key={state} className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-bold text-[#4e342e] mb-3">{state.replace("_"," ")}</h2>
            <ul className="space-y-3">
              {orders.filter(o => o.status === state).map(o => (
                <li key={o.id} className="rounded-xl border p-3">
                  <div className="flex justify-between items-center">
                    {o.table_number && (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#d7ccc8] text-[#3e2723]">
                        Mesa {o.table_number}
                      </span>
                    )}
                    {!o.table_number && <div></div>}
                    <span className="text-xs px-2 py-1 rounded-full bg-[#efebe9] border">
                      {o.payment_method === "PAGO_LOCAL" ? " Local" : "💳 PayPal"}
                    </span>
                  </div>
                  <ul className="text-[#3e2723] mt-1">
                    {(o.order_items ?? []).map((it, i) => (
                      <li key={i}>{it.quantity}× {it.name}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
