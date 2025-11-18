import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const VISIBLE = ["PENDIENTE", "EN_PREPARACION", "LISTO"];

export default function DisplayKitchen() {
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState({});

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, status, total, created_at, table_number, payment_method, order_items(name, quantity)"
      )
      .in("status", VISIBLE)
      .eq("payment_method", "PAGO_LOCAL")
      .not("table_number", "is", null)
      .order("created_at", { ascending: true });

    if (!error) setOrders(data ?? []);
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel("orders-kitchen")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const row = payload.new ?? payload.old;
          const visible =
            VISIBLE.includes(row.status) &&
            row.payment_method === "PAGO_LOCAL" &&
            row.table_number !== null;

          setOrders((prev) => {
            let next = [...prev];
            if (payload.eventType === "INSERT") {
              if (visible)
                next = [...prev, row].sort(
                  (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
            } else if (payload.eventType === "UPDATE") {
              const i = next.findIndex((o) => o.id === row.id);
              if (i >= 0) {
                if (visible) next[i] = { ...next[i], ...row };
                else next.splice(i, 1);
              } else if (visible) next = [...next, row];
            } else if (payload.eventType === "DELETE") {
              next = next.filter((o) => o.id !== row.id);
            }
            return next;
          });
        }
      )
      .subscribe();

    const t = setInterval(load, 15000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(t);
    };
  }, []);

  // Función para obtener el siguiente estado
  const getNextStatus = (current) => {
    const idx = VISIBLE.indexOf(current);
    if (idx < 0) return current;
    if (idx < VISIBLE.length - 1) return VISIBLE[idx + 1];
    return VISIBLE[idx]; // se queda en LISTO

    // 🔸 OPCIONAL: si quieres que después de LISTO pase a ENTREGADO
    // return idx === VISIBLE.length - 1 ? "ENTREGADO" : VISIBLE[idx + 1];
  };

  // Función para cambiar el estado del pedido
  const advanceStatus = async (order) => {
    const next = getNextStatus(order.status);
    if (next === order.status) return;

    setBusy((b) => ({ ...b, [order.id]: true }));

    // UI optimista
    const prevOrders = orders;
    setOrders((curr) =>
      curr.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: next })
      .eq("id", order.id);

    if (error) {
      setOrders(prevOrders); // revertir
      alert("No se pudo actualizar el estado. Intenta de nuevo.");
      console.error(error.message);
    }

    setBusy((b) => ({ ...b, [order.id]: false }));
  };

  const labelForNext = (s) => {
    const idx = VISIBLE.indexOf(s);
    if (idx < VISIBLE.length - 1) return `→ ${VISIBLE[idx + 1].replace("_", " ")}`;
    return "✓ LISTO";
  };

  const buttonStyleFor = (s) => {
    if (s === "PENDIENTE") return "bg-[#d7ccc8] hover:bg-[#bcaaa4] text-[#3e2723]";
    if (s === "EN_PREPARACION")
      return "bg-[#6d4c41] hover:bg-[#5d4037] text-white";
    return "bg-[#4e342e] hover:bg-[#3e2723] text-white";
  };

  return (
    <div className="min-h-screen bg-[#efebe9] p-6">
      <h1 className="text-4xl font-extrabold text-[#5d4037] mb-6">
        Sección · Trabajadores
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {VISIBLE.map((state) => (
          <section key={state} className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-bold text-[#4e342e] mb-3">
              {state.replace("_", " ")}
            </h2>
            <ul className="space-y-3">
              {orders
                .filter((o) => o.status === state)
                .map((o) => (
                  <li key={o.id} className="rounded-xl border p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-[#6d4c41]">
                        #{o.id.slice(0, 8)} · {Number(o.total).toFixed(2)} GTQ
                      </div>
                      <span className="text-xs px-4 py-2 rounded-full bg-[#d7ccc8] text-[#3e2723]">
                        Mesa {o.table_number}
                      </span>
                    </div>

                    <ul className="text-[#3e2723] mt-2">
                      {(o.order_items ?? []).map((it, i) => (
                        <li key={i}>
                          {it.quantity}× {it.name}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => advanceStatus(o)}
                        disabled={busy[o.id]}
                        className={`text-sm px-4 py-2 rounded-lg transition ${buttonStyleFor(
                          state
                        )} disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {busy[o.id]
                          ? "Actualizando..."
                          : labelForNext(state)}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
