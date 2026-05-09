import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log("Mevcut tefekkürler siliniyor...");
  await turso.execute("DELETE FROM reflections");

  const getCardsByCat = async (catName) => {
    const res = await turso.execute({
      sql: "SELECT cards.id FROM cards JOIN categories ON cards.category_id = categories.id WHERE categories.name = ?",
      args: [catName]
    });
    return res.rows.map(r => r.id);
  };

  const idAna = await getCardsByCat('Ana Kolonlar');
  const idSosyal = await getCardsByCat('Sosyal Hasar');
  const idKalp = await getCardsByCat('Kalp Hastalıkları');
  const idSizinti = await getCardsByCat('Sızıntılar');

  const insertReflection = async (cardIds, texts) => {
    for (const cid of cardIds) {
      const text = texts[Math.floor(Math.random() * texts.length)];
      await turso.execute({
        sql: "INSERT INTO reflections (card_id, text) VALUES (?, ?)",
        args: [cid, text]
      });
    }
  };

  const sosyalMesajlar = [
    "Ayet: 'Ölü kardeşinizin etini yemek hoşunuza mı gitti? İşte bundan tiksindiniz.' (Hucurat, 12)",
    "Hadis: 'Kim bana iki çenesi arası ile iki bacağı arasını koruma sözü verirse, ben de ona cennet sözü veririm.' (Buhari)",
    "Hadis: 'Müslüman, dilinden ve elinden diğer Müslümanların güvende olduğu kimsedir.' (Müslim)",
    "Ayet: 'O takva sahipleri ki, öfkelerini yutarlar ve insanları affederler.' (Âl-i İmrân, 134)",
    "Hadis: 'Yiğit, güreşte rakibini yenen değil, öfke anında kendine hakim olandır.' (Buhari)",
    "Hadis: 'Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır.' (Tirmizi)",
    "Tefekkür: Senin kalbini kırandan hakkını soracak olan, senin kırdığın kalbin de sahibidir."
  ];

  const kalpMesajlari = [
    "Ayet: 'Yeryüzünde böbürlenerek yürüme. Çünkü sen ne yeri yaratabilirsin ne de dağlara boyca ulaşabilirsin.' (İsra, 37)",
    "Hadis: 'Kalbinde zerre miktar kibir olan cennete giremez.' (Müslim)",
    "Hadis: 'Ateşin odunu yakıp kül ettiği gibi, haset de iyilikleri yer bitirir.' (Ebu Davud)",
    "Tefekkür: Topraktan geldin ve yine toprağa döneceksin. Bu gurur niye?"
  ];

  const sizintiMesajlari = [
    "Ayet: 'Mümin erkeklere söyle, gözlerini haramdan sakınsınlar...' (Nur, 30)",
    "Hadis: 'İki nimet vardır ki insanların çoğu onda aldanmıştır: Sağlık ve boş vakit.' (Buhari)",
    "Hadis: 'Kıyamet günü hiçbir kul, ömrünü nerede tükettiği sorulmadan bir yere kıpırdayamaz.' (Tirmizi)",
    "Tefekkür: Akıp giden sadece zaman değil, senin ömründür."
  ];

  const anaMesajlar = [
    "Ayet: 'Sizi şu yakıcı ateşe sokan nedir? Derler ki: Biz namaz kılanlardan değildik...' (Müddessir, 42-43)",
    "Hadis: 'Kişi ile şirk ve küfür arasındaki fark namazı terk etmektir.' (Müslim)",
    "Tefekkür: Namazda Allah ile konuşmaya vaktin yoksa, kiminle konuşuyorsun?"
  ];

  await insertReflection(idSosyal, sosyalMesajlar);
  await insertReflection(idKalp, kalpMesajlari);
  await insertReflection(idSizinti, sizintiMesajlari);
  await insertReflection(idAna, anaMesajlar);

  console.log("Tefekkür mesajları başarıyla eşleştirildi ve eklendi!");
}

seed().catch(console.error);
