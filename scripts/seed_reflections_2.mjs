import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
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

  const anaMesajlar = [
    "Ayet: 'Ey iman edenler! Mallarınızı aranızda haksızlıkla ve yalan yollarla yemeyin.' (Nisa, 29)",
    "Ayet: 'Yazıklar olsun o namaz kılanlara ki, onlar kıldıkları namazdan gafildirler.' (Maun, 4-5)",
    "Hadis: 'Kıyamet gününde kulun hesaba çekileceği ilk ameli namazdır.' (Tirmizi)",
    "Hadis: 'Kim haram lokma ile büyürse, ona en layık olan şey ateştir.' (Tirmizi)",
    "Hadis: 'Öyle bir zaman gelecek ki kişi malını helalden mi haramdan mı kazandığına hiç aldırış etmeyecek.' (Buhari)"
  ];

  const sosyalMesajlar = [
    "Ayet: 'Zulmedenler, hangi akıbete uğrayacaklarını yakında göreceklerdir.' (Şuara, 227)",
    "Ayet: 'Vay haline o eksik ölçüp tartanların!' (Mutaffifîn, 1-3)",
    "Hadis: 'Zulümden sakının. Çünkü zulüm, kıyamet gününde zifiri karanlıklar olacaktır.' (Müslim)",
    "Hadis: 'Bizi aldatan bizden değildir.' (Müslim)",
    "Hadis: 'Müflis kimdir bilir misiniz? ... şuna sövmüş, buna iftira etmiş, şunun malını yemiş... Bütün sevapları alacaklılara dağıtılır.' (Müslim)"
  ];

  const kalpMesajlari = [
    "Ayet: 'Şüphesiz Allah, kibirlenen ve övünen kimseleri sevmez.' (Nisa, 36)",
    "Ayet: 'Allah'ın verdiklerinde cimrilik edenler, bunun kendileri için hayırlı olduğunu sanmasınlar. Aksine bu onlar için çok büyük bir şerdir.' (Âl-i İmran, 180)",
    "Ayet: 'Nefsinin bencil tutkularından (cimriliğinden) korunanlar, işte onlar kurtuluşa erenlerdir.' (Haşr, 9)",
    "Hadis: 'Kıskançlıktan sakının. Çünkü ateşin odunu yediği (gibi) kıskançlık da iyi amelleri yer bitirir.' (Ebu Davud)",
    "Hadis: 'Gösteriş (riya) için amellerini yapanı Allah kıyamet günü rezil eder.' (Müslim)"
  ];

  const sizintiMesajlari = [
    "Ayet: 'Onlar ki, boş ve yararsız şeylerden (malayaniden) yüz çevirirler.' (Müminun, 3)",
    "Hadis: 'Merhamet etmeyene merhamet edilmez.' (Buhari)",
    "Hadis: 'Allah'ın en çok nefret ettiği erkek, (haksız yere) şiddetli düşmanlık eden ve öfkelenen kimsedir.' (Buhari)",
    "Hadis: 'Herhangi biriniz öfkelendiğinde ayaktaysa otursun. Öfkesi geçerse ne ala, geçmezse uzansın.' (Ebu Davud)",
    "Hadis: 'Mümin, ırz ve namuslara dil uzatan, lanet okuyan, çirkin işler yapan ve edepsiz konuşan kimse değildir.' (Tirmizi)"
  ];

  await insertReflection(idAna, anaMesajlar);
  await insertReflection(idSosyal, sosyalMesajlar);
  await insertReflection(idKalp, kalpMesajlari);
  await insertReflection(idSizinti, sizintiMesajlari);

  console.log("2. Grup Yeni Tefekkür mesajları eklendi!");
}

seed().catch(console.error);
