import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  try {
    console.log("Kartlara ağırlık (weight) kolonu ekleniyor...");
    await turso.execute("ALTER TABLE cards ADD COLUMN weight INTEGER DEFAULT 1;");
  } catch (e) {
    console.log("Kolon zaten mevcut olabilir: ", e.message);
  }

  // Mevcut kartların ağırlıklarını düzelt
  await turso.execute("UPDATE cards SET weight = 1 WHERE text LIKE '%eda ettin mi%' OR text LIKE '%koruyabildin mi%'");
  await turso.execute("UPDATE cards SET weight = -1 WHERE text LIKE '%küçümsedin%' OR text LIKE '%kıskandın%' OR text LIKE '%gıybetini%' OR text LIKE '%haram bir lokma%'");

  console.log("Rehber tablosu oluşturuluyor...");
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS rehber (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      cure TEXT
    );
  `);

  console.log("Arınma tablosu oluşturuluyor...");
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS arinma (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      action TEXT NOT NULL,
      is_heavy BOOLEAN DEFAULT 0
    );
  `);

  // Seed rehber
  const rRes = await turso.execute("SELECT COUNT(*) as count FROM rehber");
  if (rRes.rows[0].count === 0) {
    await turso.execute("INSERT INTO rehber (title, description, cure) VALUES ('Kibir', 'Kendini başkalarından üstün görme hali. Özünde derin bir özgüven eksikliğinden ve gerçeği inkar etmekten beslenir.', 'Tevazu ve başkalarının iyi yönlerini takdir etme pratiği.')");
    await turso.execute("INSERT INTO rehber (title, description, cure) VALUES ('Riya', 'İbadetleri veya iyilikleri başkalarına gösteriş olsun diye yapma. Kalbin yönünü yaratandan yaratılana çevirme hastalığıdır.', 'Gizli sadaka vermek ve iyilikleri saklamak.')");
    await turso.execute("INSERT INTO rehber (title, description, cure) VALUES ('Haset', 'Başkasında olan nimetin onda olmamasını istemek. Sahip olunanlara şükretmemekten kaynaklanır.', 'Kıskanılan kişi için gizlice dua etmek.')");
  }

  // Seed arinma
  const aRes = await turso.execute("SELECT COUNT(*) as count FROM arinma");
  if (aRes.rows[0].count === 0) {
    await turso.execute("INSERT INTO arinma (title, action, is_heavy) VALUES ('Gıybet Sonrası Arınma', 'Hakkına girdiğin kişi için mağfiret dile. \"Allahım, beni ve gıybetini yaptığım kardeşimi bağışla.\" de.', 1)");
    await turso.execute("INSERT INTO arinma (title, action, is_heavy) VALUES ('Öfke Kontrolü Kaybı', 'Abdest al veya pozisyonunu değiştir. Ayaktaysan otur, oturuyorsan uzan.', 0)");
    await turso.execute("INSERT INTO arinma (title, action, is_heavy) VALUES ('Kalp Katılığı', 'Bir yetimin başını okşa veya yoksulu doyur. Sessizce bir süre tefekkür et.', 0)");
  }

  console.log("Migrasyon başarıyla tamamlandı.");
}

migrate().catch(console.error);
