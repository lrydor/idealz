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
        async (payload) => {
          const row = payload.new ?? payload.old;
          const visible =
            VISIBLE.includes(row.status) &&
            row.payment_method === "PAGO_LOCAL" &&
            row.table_number !== null;

          // Si es un UPDATE, recargar los datos completos de la orden para obtener order_items y asegurar sincronización
          if (payload.eventType === "UPDATE") {
            // Verificar si la orden es visible antes o después del cambio
            const wasVisible = VISIBLE.includes(payload.old?.status) && 
                              payload.old?.payment_method === "PAGO_LOCAL" && 
                              payload.old?.table_number !== null;
            const isVisible = visible;
            
            // Si cambió la visibilidad o es visible, recargar datos completos
            if (isVisible || wasVisible) {
              const { data: fullOrder } = await supabase
                .from("orders")
                .select(
                  "id, status, total, created_at, table_number, payment_method, order_items(name, quantity)"
                )
                .eq("id", row.id)
                .single();

              if (fullOrder) {
                const shouldBeVisible = VISIBLE.includes(fullOrder.status) &&
                                       fullOrder.payment_method === "PAGO_LOCAL" &&
                                       fullOrder.table_number !== null;

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
              if (visible)
                next = [...prev, row].sort(
                  (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
            } else if (payload.eventType === "UPDATE") {
              const i = next.findIndex((o) => o.id === row.id);
              if (i >= 0) {
                if (visible) {
                  next[i] = { ...next[i], ...row };
                  next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                } else next.splice(i, 1);
              } else if (visible) {
                next = [...next, row];
                next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
              }
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
    return VISIBLE[idx]; 

  };

  // Función para cambiar el estado del pedido
  const advanceStatus = async (order) => {
    const next = getNextStatus(order.status);
    if (next === order.status) return;

    setBusy((b) => ({ ...b, [order.id]: true }));

    // Actualización optimista inmediata para mejor UX
    setOrders((curr) =>
      curr.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );
    
    // Si la orden va a pasar a LISTO, verificar si ya hay 4 órdenes en LISTO
    if (next === "LISTO") {
      const readyOrders = orders.filter((o) => o.status === "LISTO");
      if (readyOrders.length >= 4) {
        // Encontrar la orden más antigua en LISTO y cambiarla a ENTREGADO
        const oldestReady = readyOrders.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )[0];
        
        // Actualizar la orden más antigua a ENTREGADO
        await supabase
          .from("orders")
          .update({ status: "ENTREGADO" })
          .eq("id", oldestReady.id);
      }
    }

    // Actualizar en la base de datos
    console.log("Actualizando orden:", { id: order.id, from: order.status, to: next });
    
    // Intentar primero con función RPC si existe, sino usar update directo
    let updateError = null;
    
    // Intentar con función RPC (si existe)
    const { error: rpcError } = await supabase.rpc("update_order_status", {
      p_order_id: order.id,
      p_new_status: next
    });

    if (rpcError) {
      // Si la función RPC no existe o falla, intentar update directo
      console.log("Función RPC no disponible, usando update directo:", rpcError.message);
      const { error } = await supabase
        .from("orders")
        .update({ status: next })
        .eq("id", order.id);

      updateError = error;
    } else {
      console.log("Actualización exitosa usando función RPC");
    }

    if (updateError) {
      // Revertir la actualización optimista en caso de error
      setOrders((curr) =>
        curr.map((o) => (o.id === order.id ? { ...o, status: order.status } : o))
      );
      alert("No se pudo actualizar el estado. Intenta de nuevo.");
      console.error("Error actualizando estado:", updateError);
      setBusy((b) => ({ ...b, [order.id]: false }));
      return;
    }

    setTimeout(async () => {
      const { data: verifyOrder, error: verifyError } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", order.id)
        .single();
      
      if (verifyError) {
        console.error("Error al verificar el estado:", verifyError);
        setBusy((b) => ({ ...b, [order.id]: false }));
        return;
      }

      if (verifyOrder) {
        console.log("Estado verificado en BD:", verifyOrder.status, "Esperado:", next);
        if (verifyOrder.status !== next) {
          console.error(" El estado NO se guardó correctamente! Esperado:", next, "Actual:", verifyOrder.status);
          // Revertir si no coincide - esto indica que la actualización no funcionó
          setOrders((curr) =>
            curr.map((o) => (o.id === order.id ? { ...o, status: verifyOrder.status } : o))
          );
          alert("El estado no se pudo guardar. Por favor, crea la función RPC 'update_order_status' en Supabase o ajusta las políticas RLS.");
        } 
      }
      setBusy((b) => ({ ...b, [order.id]: false }));
    }, 1000);
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

  // Función para limpiar la pantalla de órdenes LISTO
  const clearReadyScreen = async () => {
    const readyOrders = orders.filter((o) => o.status === "LISTO");
    
    if (readyOrders.length === 0) {
      return;
    }

    // Actualizar todas las órdenes LISTO a ENTREGADO
    const orderIds = readyOrders.map((o) => o.id);
    
    for (const orderId of orderIds) {
      // Intentar con función RPC si existe
      const { error: rpcError } = await supabase.rpc("update_order_status", {
        p_order_id: orderId,
        p_new_status: "ENTREGADO"
      });

      if (rpcError) {
        // Si la función RPC no existe, usar update directo
        await supabase
          .from("orders")
          .update({ status: "ENTREGADO" })
          .eq("id", orderId);
      }
    }

    // Recargar los datos
    await load();
  };

  return (
    <div className="min-h-screen bg-[#efebe9] p-6">
      <h1 className="text-4xl font-extrabold text-[#5d4037] mb-6">
        Sección · Trabajadores
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {VISIBLE.map((state) => {
          const stateOrders = orders.filter((o) => o.status === state);
          const showClearButton = state === "LISTO" && stateOrders.length > 0;
          
          return (
          <section key={state} className="bg-white rounded-2xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-[#4e342e]">
                {state.replace("_", " ")}
              </h2>
              {showClearButton && (
                <button
                  onClick={clearReadyScreen}
                  className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
                  title="Limpiar pantalla - Mover todas las órdenes a ENTREGADO"
                >
                   Limpiar
                </button>
              )}
            </div>
            <ul className="space-y-3">
              {orders
                .filter((o) => o.status === state)
                .slice(0, state === "LISTO" ? 4 : undefined)
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
          );
        })}
      </div>
    </div>
  );
}
