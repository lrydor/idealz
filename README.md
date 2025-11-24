# Pasadita web (React + Vite)

Branch: this is your working branch (dorran_main). Changes here won’t affect `comedor_main` until you merge/push them.

## Chatbot (OpenAI)
- A floating "Asistente Pasadita" widget now lives on every page (bottom-right). It uses the OpenAI SDK in-browser to keep the prototype simple.
- Env var needed: `VITE_OPENAI_API_KEY=sk-...` (only for local testing). Don’t commit/share the real key; for production, proxy the request through your backend instead of exposing the key to the browser.
- Model: `gpt-4o-mini`, prompt tuned for Pasadita (menú, horarios, pedidos, reservas, pagos). Temperature 0.6, short replies.

## Running locally
```bash
npm install
npm run dev
```
Add your Supabase env vars as you already have, and include `VITE_OPENAI_API_KEY` before testing the chat.

## Resetting to match comedor_main later
If you ever need to realign this branch with `origin/comedor_main`, checkout this branch and run:
```bash
git fetch origin
git reset --hard origin/comedor_main
```
Then rebuild your changes on top.
