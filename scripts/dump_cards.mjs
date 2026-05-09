import { createClient } from "@libsql/client";
import fs from "fs";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function dump() {
  const cards = await turso.execute("SELECT id, text FROM cards");
  const takva = await turso.execute("SELECT id, text FROM takva_cards");
  
  fs.writeFileSync("all_cards_dump.json", JSON.stringify({
    cards: cards.rows,
    takva: takva.rows
  }, null, 2));
  console.log("Dumped to all_cards_dump.json");
}

dump().catch(console.error);
