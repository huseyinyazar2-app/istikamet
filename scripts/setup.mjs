import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function setup() {
  console.log("Tablolar oluşturuluyor...");

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      text TEXT NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS reflections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER,
      text TEXT NOT NULL,
      source TEXT,
      FOREIGN KEY (card_id) REFERENCES cards(id)
    );
  `);

  console.log("Tablolar başarıyla oluşturuldu. Başlangıç verileri ekleniyor...");

  // Seed Categories
  const categories = [
    { name: 'Ana Kolonlar', type: 'Ağır Etki', desc: '5 vakit namaz, haram lokma vb.' },
    { name: 'Sosyal Hasar', type: 'Kul Hakkı', desc: 'Gıybet, kalp kırma vb.' },
    { name: 'Kalp Hastalıkları', type: 'İçsel', desc: 'Kibir, Riya, Haset' },
    { name: 'Sızıntılar', type: 'Günlük', desc: 'Göz zinası, boş vakit vb.' }
  ];

  for (const cat of categories) {
    const existing = await turso.execute({
      sql: "SELECT id FROM categories WHERE name = ?",
      args: [cat.name]
    });
    if (existing.rows.length === 0) {
      await turso.execute({
        sql: "INSERT INTO categories (name, type, description) VALUES (?, ?, ?)",
        args: [cat.name, cat.type, cat.desc]
      });
    }
  }

  // Fetch Category IDs
  const catRows = await turso.execute("SELECT id, name FROM categories");
  const catMap = {};
  catRows.rows.forEach(row => {
    catMap[row.name] = row.id;
  });

  // Seed Cards
  const cards = [
    { cat: 'Ana Kolonlar', text: 'Bugün 5 vakit namazını eda ettin mi?', type: 'fixed' },
    { cat: 'Ana Kolonlar', text: 'Bugün haram bir lokma yedin mi?', type: 'fixed' },
    { cat: 'Sızıntılar', text: 'Bugün bakışlarını haramdan koruyabildin mi?', type: 'fixed' },
    { cat: 'Kalp Hastalıkları', text: 'Bugün birini içinden küçümsedin mi?', type: 'random' },
    { cat: 'Kalp Hastalıkları', text: 'Bugün başkasının sahip olduğu bir nimeti içinden kıskandın mı?', type: 'random' },
    { cat: 'Sosyal Hasar', text: 'Bugün birinin gıybetini yaptın mı veya dinledin mi?', type: 'random' }
  ];

  for (const card of cards) {
    const catId = catMap[card.cat];
    const existing = await turso.execute({
      sql: "SELECT id FROM cards WHERE text = ?",
      args: [card.text]
    });
    if (existing.rows.length === 0) {
      await turso.execute({
        sql: "INSERT INTO cards (category_id, text, type) VALUES (?, ?, ?)",
        args: [catId, card.text, card.type]
      });
    }
  }

  // Seed Reflections
  const cardRows = await turso.execute("SELECT id, text FROM cards");
  const kibirCardId = cardRows.rows.find(r => r.text && r.text.includes("küçümsedin"))?.id;
  const hasetCardId = cardRows.rows.find(r => r.text && r.text.includes("kıskandın"))?.id;

  if (kibirCardId) {
    await turso.execute({
      sql: "INSERT INTO reflections (card_id, text, source) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM reflections WHERE card_id = ?)",
      args: [kibirCardId, "Kalbinde zerre miktar kibir bulunan kimse cennete giremez.", "Müslim, Îmân 147", kibirCardId]
    });
  }

  if (hasetCardId) {
    await turso.execute({
      sql: "INSERT INTO reflections (card_id, text, source) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM reflections WHERE card_id = ?)",
      args: [hasetCardId, "Ateşin odunu yakıp bitirdiği gibi, haset de iyilikleri yer bitirir.", "Ebu Davud, Edeb 44", hasetCardId]
    });
  }

  console.log("Başlangıç verileri başarıyla eklendi.");
}

setup().catch(console.error);
