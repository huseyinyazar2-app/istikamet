import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function findMissing() {
  const cards = await turso.execute("SELECT id, text FROM cards WHERE reflection_1 = '' OR reflection_1 IS NULL");
  const takva = await turso.execute("SELECT id, text FROM takva_cards WHERE reflection_1 = '' OR reflection_1 IS NULL");
  
  console.log("=== Eksik Ana Kartlar ===");
  cards.rows.forEach(r => console.log(`[C-${r.id}] ${r.text.substring(0, 50)}...`));
  
  console.log("\n=== Eksik Takva Kartları ===");
  takva.rows.forEach(r => console.log(`[T-${r.id}] ${r.text.substring(0, 50)}...`));
}

findMissing().catch(console.error);
