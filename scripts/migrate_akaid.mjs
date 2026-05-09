import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS akaid_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      statement TEXT NOT NULL,
      is_true INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      proof TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const countRes = await turso.execute("SELECT COUNT(*) as count FROM akaid_cards");
  if (countRes.rows[0].count > 0) {
    console.log("Tablo zaten dolu.");
    return;
  }

  const cards = [
    {
      statement: "Allah evreni ve insanları yaratmıştır, ancak yarattıktan sonra dünya işlerine, kurallara ve insanların yaşantısına müdahale etmez.",
      is_true: 0,
      explanation: "Bu, Deizm safsatasıdır. Allah (c.c) her an yaratma halindedir, kullarının hayatına kanunlarıyla müdahil olur ve her şeyi hakkıyla idare eder.",
      proof: "Ayet: O, her an yeni bir ilahi tasarruftadır. (Rahman, 29) / Yaratmak da emretmek de yalnız O'na aittir. (A'raf, 54)"
    },
    {
      statement: "Faiz, içki veya tesettür gibi dini hükümler geçmiş yüzyıllarda kalmıştır. Günümüz modern çağında bu haramlar esnetilebilir veya helal sayılabilir.",
      is_true: 0,
      explanation: "Haramı helal, helali haram saymak (istihlal) kişiyi dinden çıkarır (küfre düşürür). Dinin hükümleri kıyamete kadar geçerlidir.",
      proof: "Ayet: Dillerinizin uydurduğu yalana dayanarak 'Bu helâldir, şu haramdır' demeyin, çünkü Allah'a karşı yalan uydurmuş olursunuz. (Nahl, 116)"
    },
    {
      statement: "Dini yaşamak için sadece Kur'an-ı Kerim yeterlidir. Peygamberimizin hadislerine (Sünnet'e) ihtiyaç yoktur.",
      is_true: 0,
      explanation: "Kur'an'ı açıklayan ve dinin pratik uygulamasını gösteren Sünnet'tir. Sünneti devreden çıkarmak, dinin yarısını yıkmak demektir.",
      proof: "Ayet: Peygamber size ne verdiyse onu alın, neyi de size yasak ettiyse ondan vazgeçin. (Haşr, 7)"
    },
    {
      statement: "İnsan, kendi kaderini ve yaptığı fiilleri (hareketleri) tamamen kendisi yaratır. Allah önceden ne olacağını bilemez.",
      is_true: 0,
      explanation: "İnsan sadece cüzi iradesiyle seçer (kesb eder), o fiili yaratan (halk eden) yalnızca Allah'tır. Mutezile sapkınlığıdır.",
      proof: "Ayet: Sizi de, yapmakta olduklarınızı da Allah yaratmıştır. (Saffat, 96)"
    },
    {
      statement: "Kıyamet gününde peygamberlerin, şehitlerin veya salih kulların Allah'ın izniyle günahkarlara şefaat etmesi haktır.",
      is_true: 1,
      explanation: "Ehli Sünnet itikadına göre Şefaat haktır. Allah'ın izin verdiği kullar, yine Allah'ın razı olduğu kimseler için şefaatte bulunacaktır.",
      proof: "Hadis: Benim şefaatim, ümmetimden büyük günah işleyenler içindir. (Ebu Davud)"
    },
    {
      statement: "Kişi öldükten sonra kıyamet kopana kadar kabirde herhangi bir azap veya nimet görmez, kabir hayatı (Berzah) diye bir şey yoktur.",
      is_true: 0,
      explanation: "Ehli Sünnet itikadına göre kabir azabı ve kabir nimeti haktır. Kişi öldükten hemen sonra melekler tarafından hesaba çekilir.",
      proof: "Hadis: Kabir, ya cennet bahçelerinden bir bahçe veya cehennem çukurlarından bir çukurdur. (Tirmizi)"
    },
    {
      statement: "Peygamberlerin gösterdiği mucizeler haktır, Allah dilediği zaman doğa kanunlarını aşabilir.",
      is_true: 1,
      explanation: "Doğa kanunlarını yaratan Allah'tır ve dilediği zaman peygamberleri aracılığıyla bu kanunları kırabilir.",
      proof: "Ayet: Ey ateş! İbrahim’e karşı serin ve zararsız ol, dedik. (Enbiya, 69)"
    },
    {
      statement: "Doktorların verdiği ilaçlar kendi başına şifa yaratır, bu yüzden iyileştiğimizde doktora ve ilaca minnettar olmak yeterlidir.",
      is_true: 0,
      explanation: "İlaç ve doktor sadece birer sebeptir. Şifayı bizzat yaratan ve veren (Eş-Şâfi) yalnız Allah'tır. Sebepleri yaratıcı yerine koymak gizli şirktir.",
      proof: "Ayet: Hastalandığım zaman bana şifa veren O'dur. (Şuara, 80)"
    },
    {
      statement: "Peygamberler 'İsmet' sıfatına sahiptir. Allah onları şirkten, büyük günahlardan ve bilerek yalan söylemekten korumuştur.",
      is_true: 1,
      explanation: "Peygamberler sıradan insanlar değildir, günahsızdırlar (İsmet). Sadece zelle adı verilen ufak hataları olabilir.",
      proof: "Ayet: Andolsun ki, Resûlullah'ta sizin için... güzel bir örnek vardır. (Ahzab, 21)"
    },
    {
      statement: "Bir insan inandığı halde namaz kılmaz, oruç tutmaz ve günah işlerse dinden çıkar ve kafir olur.",
      is_true: 0,
      explanation: "Ehli Sünnet'te amel, imandan bir parça değildir. Günah işleyen dinden çıkmaz, günahkar (fasık) olur. Tekfircilik sapkınlıktır.",
      proof: "Ayet: Eğer müminlerden iki grup birbiriyle savaşırlarsa aralarını düzeltin. (Hucurat, 9) (Büyük günah işleyenlere mümin denmiştir)."
    }
  ];

  for (const c of cards) {
    await turso.execute({
      sql: "INSERT INTO akaid_cards (statement, is_true, explanation, proof) VALUES (?, ?, ?, ?)",
      args: [c.statement, c.is_true, c.explanation, c.proof]
    });
  }

  console.log("Akaid table created and seeded.");
}

migrate().catch(console.error);
