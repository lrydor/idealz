import { useEffect, useMemo, useState } from "react";
import OpenAI from "openai";
import { supabase } from "../../supabaseClient";

const SYSTEM_PROMPT =
  "Eres el asistente de Pasadita. Responde en español con tono cordial y concreto. Brinda ayuda sobre menú, promociones, horarios, ubicación, pedidos para llevar o a domicilio, reservas y métodos de pago. Si algo no está en la información, responde brevemente que puedes confirmarlo con el equipo.";

const initialMessage = {
  role: "assistant",
  content:
    "¡Hola! Soy tu asistente de Pasadita. ¿En qué puedo ayudarte hoy? Puedo responder sobre el menú, horarios, pedidos o reservas.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuContext, setMenuContext] = useState("");

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const client = useMemo(() => {
    if (!apiKey) return null;
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Prototype only; move to backend to keep key secret in prod.
    });
  }, [apiKey]);

  useEffect(() => {
    const loadMenu = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("name, desc, price")
        .limit(12);

      if (error) {
        console.warn("No pude cargar el menú para contexto del chat:", error.message);
        return;
      }

      const summary = (data ?? [])
        .map((item) => {
          const price = typeof item.price === "number" ? `${item.price.toFixed(2)} GTQ` : "precio no disponible";
          const desc = item.desc ? ` - ${item.desc}` : "";
          return `${item.name}: ${price}${desc}`;
        })
        .join(" | ");

      setMenuContext(summary);
    };

    loadMenu();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    if (!client) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Falta la clave de OpenAI (VITE_OPENAI_API_KEY). Añádela en tu .env local, reinicia el dev server y vuelve a intentar.",
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const dynamicSystem = [
        SYSTEM_PROMPT,
        "Contexto del negocio: ubicación Guatemala, moneda Quetzales (GTQ), pagos aceptan PayPal y efectivo.",
        menuContext ? `Menú (ejemplos): ${menuContext}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: dynamicSystem }, ...nextMessages],
        temperature: 0.6,
        max_tokens: 300,
      });

      const reply =
        completion.choices?.[0]?.message?.content?.trim() ??
        "Lo siento, no pude responder en este momento.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hubo un problema al conectar con el asistente. Verifica tu internet, luego intenta de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-[#8b5a2b] px-4 py-3 text-white shadow-lg transition hover:translate-y-[-2px] hover:shadow-xl"
      >
        <span aria-hidden="true">💬</span>
        <span>Asistente Pasadita</span>
      </button>

      {open && (
        <div className="mt-3 w-[340px] rounded-2xl bg-white shadow-2xl ring-1 ring-[#e6d9cf]">
          <header className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#8b5a2b] to-[#5d3a1b] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold leading-tight">Asistente Pasadita</p>
              <p className="text-[11px] opacity-90">Menú · Horarios · Pedidos</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/15 px-2 py-1 text-xs font-semibold hover:bg-white/25"
            >
              ✕
            </button>
          </header>

          <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto px-4 py-3 text-sm text-[#2f1f16]">
            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}-${m.content.slice(0, 10)}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-[#8b5a2b] text-white"
                      : "bg-[#f8f1e8] text-[#2f1f16]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#f8f1e8] px-3 py-2 text-[#2f1f16] shadow-sm">
                  Escribiendo...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-[#f0e6de] px-3 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe tu mensaje..."
              className="h-11 flex-1 rounded-full border border-[#d6c5b8] bg-white px-3 text-sm text-[#2f1f16] outline-none transition focus:border-[#b02a2a] focus:ring-1 focus:ring-[#b02a2a]"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8b5a2b] text-white shadow-md transition hover:bg-[#5d3a1b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "…" : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
