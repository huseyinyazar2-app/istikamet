import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  try {
    await turso.execute("ALTER TABLE cards ADD COLUMN reflection_1 TEXT");
    console.log("cards.reflection_1 eklendi.");
  } catch(e) { console.log("cards.reflection_1:", e.message); }
  
  try {
    await turso.execute("ALTER TABLE cards ADD COLUMN reflection_2 TEXT");
    console.log("cards.reflection_2 eklendi.");
  } catch(e) { console.log("cards.reflection_2:", e.message); }

  try {
    await turso.execute("ALTER TABLE takva_cards ADD COLUMN reflection_1 TEXT");
    console.log("takva_cards.reflection_1 eklendi.");
  } catch(e) { console.log("takva_cards.reflection_1:", e.message); }
  
  try {
    await turso.execute("ALTER TABLE takva_cards ADD COLUMN reflection_2 TEXT");
    console.log("takva_cards.reflection_2 eklendi.");
  } catch(e) { console.log("takva_cards.reflection_2:", e.message); }

  console.log("Migration tamamlandı.");
}

migrate().catch(console.error);
