import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Kullanıcılar (users) tablosu oluşturuluyor...");
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT UNIQUE NOT NULL
    );
  `);

  console.log("Kullanıcıya özel Takva Kartları (user_takva_cards) tablosu oluşturuluyor...");
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS user_takva_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT NOT NULL,
      category_name TEXT NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY(nickname) REFERENCES users(nickname) ON DELETE CASCADE
    );
  `);

  console.log("Migrasyon başarıyla tamamlandı.");
}

migrate().catch(console.error);
