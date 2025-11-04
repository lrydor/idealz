import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function CheckoutLocal({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  const handleCreateOrder = async () => {
    if (!tableNumber || Number.isNaN(parseInt(tableNumber))) {
      alert("Ingresa un número de mesa válido.");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert("Debes iniciar sesión para ordenar."); return; }

      const mesa = parseInt(tableNumber);
      const { data, error } = await supabase.rpc("create_local_order", { p_table_number: mesa });
      if (error) throw error;

      if (onSuccess) onSuccess(data);
    } catch (e) {
      console.error(e);
      alert(e.message || "No se pudo crear la orden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-[#3e2723]">
        Número de mesa
        <input
          type="number"
          min="1"
          max="200"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Ej. 12"
        />
      </label>

      <button
        disabled={loading}
        onClick={handleCreateOrder}
        className="w-full bg-[#6d4c41] hover:bg-[#4e342e] text-[#efebe9] py-3 rounded-full font-semibold shadow"
      >
        {loading ? "Creando orden..." : "Confirmar pedido y pagar en caja"}
      </button>
    </div>
  );
}