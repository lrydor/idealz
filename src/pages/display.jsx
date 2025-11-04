import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const VISIBLE = ['PENDIENTE','EN_PREPARACION','LISTO'];

export default function Display() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id, status, total, created_at, order_items(name, quantity)')
      .in('status', VISIBLE)
      .order('created_at', { ascending: true });
    if (!error) setOrders(data ?? []);
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((prev) => {
            const row = payload.new ?? payload.old;
            const visible = VISIBLE.includes(row.status);
            let next = [...prev];

            if (payload.eventType === 'INSERT') {
              if (visible) next = [...prev, row].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
            } else if (payload.eventType === 'UPDATE') {
              const i = next.findIndex(o => o.id === row.id);
              if (i >= 0) {
                if (visible) next[i] = { ...next[i], ...row };
                else next.splice(i,1);
              } else if (visible) {
                next = [...next, row];
              }
            } else if (payload.eventType === 'DELETE') {
              next = next.filter(o => o.id !== row.id);
            }
            return next;
          });
        }
      )
      .subscribe();

    // Polling de respaldo por si se cae el socket
    const t = setInterval(load, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(t);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#efebe9] p-6">
      <h1 className="text-4xl font-extrabold text-[#5d4037] mb-6">Órdenes</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {VISIBLE.map((state) => (
          <section key={state} className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-bold text-[#4e342e] mb-3">{state}</h2>
            <ul className="space-y-3">
              {orders.filter(o => o.status === state).map(o => (
                <li key={o.id} className="rounded-xl border p-3">
                  <div className="text-sm text-[#6d4c41]">#{o.id.slice(0,8)} · ₿ {Number(o.total).toFixed(2)}</div>
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