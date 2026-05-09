import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const cards = [
    {
      statement: "Cennetteki insanlar, Allah'ı hiçbir şekilde göremeyeceklerdir. Çünkü Allah fiziksel bir varlık değildir ve O'nun görülmesi imkansızdır.",
      is_true: 0,
      explanation: "Ehli Sünnet itikadına göre 'Rü'yetullah' (Allah'ın görülmesi) haktır. Müminler cennette Allah'ı mekandan münezzeh bir şekilde göreceklerdir.",
      proof: "Ayet: O gün birtakım yüzler aydındır (parlayacaktır), Rablerine bakacaklardır. (Kıyâmet, 22-23)"
    },
    {
      statement: "Yıldız haritalarına (Astroloji), burçlara, tarot fallarına veya medyumlara bakarak insanların gelecekte yaşayacağı olaylar önceden bilinebilir.",
      is_true: 0,
      explanation: "Geleceği ve gaybı (görünmeyeni) Allah'tan başka hiç kimse bilemez. Yıldızlara veya fallara inanarak gaybı bilme iddiası şirktir.",
      proof: "Ayet: De ki: Göklerde ve yerde gaybı Allah'tan başka kimse bilmez. (Neml, 65)"
    },
    {
      statement: "İnsanlar öldükten sonra, günahlarından arınması veya tekamül etmesi için bu dünyaya başka bir insan veya canlı bedeninde geri dönerler (Reenkarnasyon).",
      is_true: 0,
      explanation: "İslam dininde reenkarnasyon yoktur. İnsan bir kere doğar ve ölür. Ruhlar Berzah alemine geçer ve kıyameti bekler.",
      proof: "Ayet: Onlardan birine ölüm gelince: Rabbim! Beni dünyaya geri döndür... der. Hayır! Bu sadece onun söylediği boş bir sözdür. (Mü'minûn, 99-100)"
    },
    {
      statement: "Sadece espri yapmak veya ortamda gülmek amacıyla namazla, başörtüsüyle veya cennet/cehennemle dalga geçmek imanı bozmaz, sadece günahkar yapar.",
      is_true: 0,
      explanation: "Allah'ın diniyle veya şeriatıyla alay etmek kesinlikle küfürdür ve kişiyi dinden çıkarır. Acilen tecdid-i iman gerekir.",
      proof: "Ayet: De ki: Allah ile, O'nun âyetleriyle ve peygamberiyle mi alay ediyorsunuz? Özür dilemeyin, inandıktan sonra kafir oldunuz. (Tevbe, 65-66)"
    },
    {
      statement: "Cehennemdeki azap geçicidir. Milyarlarca yıl sürse bile eninde sonunda cehennem yok olacak veya içindeki herkes bir gün cennete girecektir.",
      is_true: 0,
      explanation: "Cennet ve Cehennem ebedidir. Kalbinde zerre iman olanlar cezasını çektikten sonra cennete girer, ancak inkar edenler ebediyen cehennemde kalır.",
      proof: "Ayet: Allah onları ateşten çıkaracak değildir. Onlar için ebedî (sürekli) bir azap vardır. (Mâide, 37)"
    },
    {
      statement: "Hz. Ebubekir, Hz. Ömer, Hz. Osman veya Hz. Ayşe gibi bazı büyük sahabeler peygamberimizin vefatından sonra dinden çıkmış veya hata etmişlerdir, onlara lanet okumakta sakınca yoktur.",
      is_true: 0,
      explanation: "Sahabelerin tamamı adildir ve cennetliktir. Peygamberimizin yol arkadaşlarına dil uzatmak veya lanet okumak büyük bir sapkınlıktır.",
      proof: "Ayet: İslam'ı ilk önce kabul eden muhacirler ve ensar ile onlara uyanlar var ya, Allah onlardan razı olmuş; onlar da O'ndan razı olmuşlardır. (Tevbe, 100)"
    },
    {
      statement: "Ahirette amellerin tartılacağı Mizan (terazi) ve üzerinden geçilecek olan Sırat köprüsü fiziksel olarak gerçek değildir, bunlar sadece ilahi adaleti anlatan mecazlardır.",
      is_true: 0,
      explanation: "Mizan (amelleri tartan hakiki bir terazi) ve Sırat (cehennemin üzerine kurulan gerçek bir köprü) haktır ve bizzat vardır.",
      proof: "Ayet: Kıyamet günü için adalet terazileri kurarız. Hiç kimseye haksızlık edilmez. (Enbiyâ, 47)"
    },
    {
      statement: "Cinler ve şeytanlar sadece eski insanların psikolojik hastalıklara veya kötü düşüncelere verdikleri isimlerdir; kendi başlarına gerçek, görünmez varlıklar değillerdir.",
      is_true: 0,
      explanation: "Kur'an'da adı geçen cinler, ateşten yaratılmış, irade sahibi gerçek varlıklardır. Onları inkar etmek, ayetleri yalanlamak anlamına gelir.",
      proof: "Ayet: Ben cinleri ve insanları, ancak bana kulluk etsinler diye yarattım. (Zâriyât, 56)"
    },
    {
      statement: "Türbelerdeki ölülerden veya evliyalardan doğrudan, bizzat onların gücüyle bize çocuk vermesini, şifa vermesini veya zengin etmesini istemek şirktir.",
      is_true: 1,
      explanation: "Tevessül (Allah dostlarını vesile kılmak) haktır, ancak bizzat kabirdeki kişiden gücü kendindenmiş gibi bir şey istemek açık bir şirktir.",
      proof: "Ayet: Allah'ı bırakıp da sana ne fayda ne de zarar verebilecek olan şeylere yalvarma. Eğer böyle yaparsan, şüphesiz zalimlerden (müşriklerden) olursun. (Yunus, 106)"
    },
    {
      statement: "Kıyamete yakın bir zamanda Deccal'in çıkması, Yecüc ve Mecüc'ün belirmesi ve Hz. İsa'nın yeryüzüne geri dönmesi gibi olaylar sadece uydurma efsanelerdir.",
      is_true: 0,
      explanation: "Hz. İsa'nın yeryüzüne ineceği (Nüzul-ü İsa), Deccal'in ve Yecüc-Mecüc'ün çıkacağı gibi konular mütevatir hadislerle sabittir ve Ehli Sünnet itikadıdır.",
      proof: "Ayet: Şüphesiz O (İsa), kıyamet için bir bilgidir (alamettir). Artık o saat hakkında hiçbir şüpheniz olmasın... (Zuhruf, 61)"
    }
  ];

  for (const c of cards) {
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

  console.log("Akaid Taslak 4 database'e eklendi.");
}

migrate().catch(console.error);
