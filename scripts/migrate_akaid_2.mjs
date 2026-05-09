import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const cards = [
    {
      statement: "Evren (madde ve zaman) ezelidir; yani bir başlangıcı yoktur, hep vardı ve kendi kendine dönüşerek bugünkü halini almıştır.",
      is_true: 0,
      explanation: "Bu maddeci/ateist bir görüştür. Kelam ilmindeki 'Hudûs Delili'ne göre, sonradan var olan (değişen) her şeyin bir yaratıcısı olmak zorundadır. Evreni yoktan var eden tek yaratıcı Allah'tır.",
      proof: "Ayet: O, gökleri ve yeri yoktan yaratandır... (En'âm, 101)"
    },
    {
      statement: "İnsan vücudundaki muazzam sistemler veya gezegenlerin yörüngesindeki hassas denge, milyarlarca yıllık kör tesadüflerin bir sonucudur.",
      is_true: 0,
      explanation: "Kör tesadüf nizam (düzen) kuramaz. Kâinattaki bu muazzam sanat, sonsuz ilim ve kudret sahibi bir Yaratıcının eseridir.",
      proof: "Ayet: O, yedi göğü tabaka tabaka yaratandır. Rahmân'ın yaratışında hiçbir uyumsuzluk göremezsin... (Mülk, 3)"
    },
    {
      statement: "Evrendeki iyilikleri bir tanrı, kötülükleri veya felaketleri başka bir tanrı yaratmış olabilir. Ya da Allah dünyayı yönetmeyi meleklere devretmiştir.",
      is_true: 0,
      explanation: "Allah Tektir (Vahdaniyet). Evrende birden fazla kural koyucu olsaydı, evrenin düzeni anında yok olurdu.",
      proof: "Ayet: Eğer yerde ve gökte Allah'tan başka ilâhlar olsaydı, yerin ve göğün düzeni kesinlikle bozulup gitmişti. (Enbiyâ, 22)"
    },
    {
      statement: "Allah, zamanın belli bir noktasında veya evrenin yaratılışından hemen önce var olmuştur.",
      is_true: 0,
      explanation: "Allah'ın varlığının bir başlangıcı yoktur (Kıdem sıfatı). O, zamanı ve mekanı yaratandır; zamana tabi değildir.",
      proof: "Ayet: O, Evvel'dir (başlangıcı olmayandır), Âhir'dir (sonu olmayandır)... (Hadîd, 3)"
    },
    {
      statement: "Kıyamet koptuğunda ve evren tamamen yok olduğunda, Allah'ın da varlığı sona erebilir.",
      is_true: 0,
      explanation: "Her canlı ve yaratılmış olan şey ölümlüdür. Ancak Allah'ın varlığının bir sonu yoktur (Beka sıfatı). O, ebedîdir.",
      proof: "Ayet: Yeryüzünde bulunan her canlı fânidir (yok olacaktır). Ancak azamet ve ikram sahibi Rabbinin Zât'ı bâkî kalacaktır. (Rahmân, 26-27)"
    },
    {
      statement: "Allah'ın da insanlar gibi eli, yüzü ve fiziksel bir bedeni vardır. O, gökyüzünde bir tahtın (arşın) üzerinde fiziksel olarak oturmaktadır.",
      is_true: 0,
      explanation: "Allah, yarattığı hiçbir şeye benzemez. Kur'an'da geçen 'Allah'ın eli' gibi ifadeler mecazdır. O'na fiziksel mekan atfetmek Müşebbihe sapkınlığıdır.",
      proof: "Ayet: O'nun (Allah'ın) benzeri hiçbir şey yoktur. O, hakkıyla işitendir, hakkıyla görendir. (Şûrâ, 11)"
    },
    {
      statement: "Allah, evreni yaratırken meleklerin yardımına, doğa kanunlarına veya fiziksel bir enerjiye ihtiyaç duymuştur.",
      is_true: 0,
      explanation: "Allah var olmak veya yaratmak için hiçbir şeye muhtaç değildir (Kıyâm bi-Nefsihî). Evren O'na muhtaçtır.",
      proof: "Ayet: Ey insanlar! Siz Allah'a muhtaçsınız. Allah ise her bakımdan zengindir. (Fâtır, 15)"
    },
    {
      statement: "Allah sadece evrensel ve genel olayları bilir. İnsanların içinden geçen anlık düşünceleri veya düşen küçücük bir yaprağı tek tek bilmez.",
      is_true: 0,
      explanation: "Allah'ın ilmi sonsuzdur. Gizli veya açık, büyük veya küçük her zerre O'nun ilmi dahilindedir.",
      proof: "Ayet: O'nun ilmi dışında bir yaprak dahi düşmez. (En'âm, 59)"
    },
    {
      statement: "Dünyada gerçekleşen savaşlar, hastalıklar ve kötülükler Allah'ın iradesi (isteği ve izni) dışında, O'na rağmen gerçekleşmektedir.",
      is_true: 0,
      explanation: "Evrende Allah'ın iradesi ve izni olmadan bir toz zerresi bile hareket edemez. Kötülüklerin yaratılması da (imtihan sırrıyla) O'nun iradesiyledir.",
      proof: "Ayet: Allah dileseydi, birbirlerini öldürmezlerdi. Fakat Allah dilediğini yapar. (Bakara, 253)"
    },
    {
      statement: "Kur'an-ı Kerim, kelime kelime Allah'ın sözü değildir; sadece anlamı Allah'tan gelmiş, lafızları (Arapça kelimeleri) Peygamberimiz kendisi oluşturmuştur.",
      is_true: 0,
      explanation: "Ehli Sünnet itikadına göre Kur'an-ı Kerim, harfiyle, kelimesiyle ve manasıyla bizzat Allah'ın 'Kelâm'ıdır (Sözüdür).",
      proof: "Ayet: Eğer müşriklerden biri senden sığınma hakkı isterse ona sığınma hakkı ver ki, Allah'ın kelâmını (sözünü) dinlesin. (Tevbe, 6)"
    }
  ];

  for (const c of cards) {
    // Aynı iddia varsa eklemeyelim
    const check = await turso.execute({
      sql: "SELECT id FROM akaid_cards WHERE statement = ?",
      args: [c.statement]
    });

    if (check.rows.length === 0) {
      await turso.execute({
        sql: "INSERT INTO akaid_cards (statement, is_true, explanation, proof) VALUES (?, ?, ?, ?)",
        args: [c.statement, c.is_true, c.explanation, c.proof]
      });
    }
  }

  console.log("Akaid Taslak 2 database'e eklendi.");
}

migrate().catch(console.error);
