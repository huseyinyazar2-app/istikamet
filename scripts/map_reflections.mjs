import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function mapReflections() {
  const res = await turso.execute("SELECT id, text FROM cards");
  const cards = res.rows;

  const mappings = [
    {
      keywords: ["namaz"],
      r1: "Ayet: 'Yazıklar olsun o namaz kılanlara ki, onlar kıldıkları namazdan gafildirler.' (Maun, 4-5)",
      r2: "Hadis: 'Kıyamet gününde kulun hesaba çekileceği ilk ameli namazdır.' (Tirmizi)"
    },
    {
      keywords: ["faiz", "haram", "ticaret", "mesai", "emek"],
      r1: "Ayet: 'Ey iman edenler! Mallarınızı aranızda haksızlıkla ve yalan yollarla yemeyin.' (Nisa, 29)",
      r2: "Hadis: 'Kim haram lokma ile büyürse, ona en layık olan şey ateştir.' (Tirmizi)"
    },
    {
      keywords: ["yalan", "iftira", "gıybet", "linç", "alay"],
      r1: "Hadis: 'Bizi aldatan bizden değildir.' (Müslim)",
      r2: "Hadis: 'Müflis kimdir bilir misiniz? ... şuna sövmüş, buna iftira etmiş, şunun malını yemiş... Bütün sevapları alacaklılara dağıtılır.' (Müslim)"
    },
    {
      keywords: ["kibir", "gösteriş", "riya", "üstün"],
      r1: "Ayet: 'Şüphesiz Allah, kibirlenen ve övünen kimseleri sevmez.' (Nisa, 36)",
      r2: "Hadis: 'Gösteriş (riya) için amellerini yapanı Allah kıyamet günü rezil eder.' (Müslim)"
    },
    {
      keywords: ["cimri", "borç", "zekat"],
      r1: "Ayet: 'Allah'ın verdiklerinde cimrilik edenler, bunun kendileri için hayırlı olduğunu sanmasınlar.' (Âl-i İmran, 180)",
      r2: "Ayet: 'Nefsinin bencil tutkularından (cimriliğinden) korunanlar, işte onlar kurtuluşa erenlerdir.' (Haşr, 9)"
    },
    {
      keywords: ["vakit", "zaman", "israf", "ekran"],
      r1: "Ayet: 'Onlar ki, boş ve yararsız şeylerden (malayaniden) yüz çevirirler.' (Müminun, 3)",
      r2: "Hadis: 'İki nimet vardır ki insanların çoğu bunda aldanmıştır: Sıhhat ve boş vakit.' (Buhari)"
    },
    {
      keywords: ["öfke", "bağırmak", "şiddet", "kalp kırmak"],
      r1: "Hadis: 'Allah'ın en çok nefret ettiği erkek, (haksız yere) şiddetli düşmanlık eden ve öfkelenen kimsedir.' (Buhari)",
      r2: "Hadis: 'Herhangi biriniz öfkelendiğinde ayaktaysa otursun. Öfkesi geçerse ne ala, geçmezse uzansın.' (Ebu Davud)"
    },
    {
      keywords: ["hayvan", "komşu", "çevre", "çöp"],
      r1: "Hadis: 'Merhamet etmeyene merhamet edilmez.' (Buhari)",
      r2: "Hadis: 'Allah, insanlara merhamet etmeyene merhamet etmez.' (Buhari)"
    },
    {
      keywords: ["oruç"],
      r1: "Hadis: 'Kim yalan konuşmayı ve yalanla iş yapmayı terk etmezse, Allah'ın onun yemesini içmesini bırakmasına ihtiyacı yoktur.' (Buhari)",
      r2: "Hadis: 'Oruç bir kalkandır. Oruçlu kimse saygısızlık yapmasın, kötü söz söylemesin.' (Buhari)"
    },
    {
      keywords: ["zina", "göz"],
      r1: "Ayet: 'Mümin erkeklere söyle, gözlerini haramdan sakınsınlar ve ırzlarını korusunlar.' (Nur, 30)",
      r2: "Ayet: 'Zinaya yaklaşmayın. Çünkü o, son derece çirkin bir iştir ve çok kötü bir yoldur.' (İsra, 32)"
    }
  ];

  let mappedCount = 0;
  for (const card of cards) {
    const lowerText = card.text.toLowerCase();
    const match = mappings.find(m => m.keywords.some(k => lowerText.includes(k)));
    if (match) {
      await turso.execute({
        sql: "UPDATE cards SET reflection_1 = ?, reflection_2 = ? WHERE id = ?",
        args: [match.r1, match.r2, card.id]
      });
      mappedCount++;
      console.log(`Eşleşti: ${card.text.substring(0,30)}... -> ${match.keywords[0]}`);
    }
  }

  console.log(`Eşleştirme bitti. Toplam ${mappedCount} karta tefekkür eklendi.`);
}

mapReflections().catch(console.error);
