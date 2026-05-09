import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Takva kartları tablosu oluşturuluyor...");
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS takva_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT NOT NULL,
      text TEXT NOT NULL,
      description TEXT,
      weight INTEGER DEFAULT 1
    );
  `);

  const res = await turso.execute("SELECT COUNT(*) as count FROM takva_cards");
  if (res.rows[0].count === 0) {
    await turso.execute("INSERT INTO takva_cards (category_name, text, description, weight) VALUES ('Sevaplar', 'Bugün teheccüd namazına kalktın mı?', 'Gecenin son üçte birinde uyanıp Rabbine yönelmek çok kıymetlidir.', 3)");
    await turso.execute("INSERT INTO takva_cards (category_name, text, description, weight) VALUES ('Sevaplar', 'Bugün gizlice bir sadaka verdin mi?', 'Sağ elin verdiğini sol elin görmemesi makbuldür.', 2)");
    await turso.execute("INSERT INTO takva_cards (category_name, text, description, weight) VALUES ('Günahlar', 'Bugün boş ve malayani işlerle çok vakit kaybettin mi?', 'Zaman ahirette hesabı sorulacak en büyük nimetlerden biridir.', -1)");
  }

  console.log("Takva migrasyonu tamamlandı.");
}
migrate().catch(console.error);
