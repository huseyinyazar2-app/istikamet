import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  // Update the Kabir Proof first
  await turso.execute({
    sql: "UPDATE akaid_cards SET proof = ?, explanation = ? WHERE statement LIKE ?",
    args: [
      "Ayet: (Firavun ve adamları) Sabah akşam ateşe sunulurlar. Kıyamet koptuğu gün de: 'Firavun ailesini azabın en çetinine sokun!' denilir. (Mü'min, 46)", 
      "Ehli Sünnet itikadına göre kabir azabı ve nimet haktır. Mü'min Suresi 46. ayet ahiretten önceki kabir azabına en büyük delildir.",
      "%kabirde herhangi bir azap veya nimet görmez%"
    ]
  });

  const cards = [
    {
      statement: "Eğer bir ayet veya mütevatir bir hadis benim bugünkü aklıma, mantığıma veya modern bilime uymuyorsa, onu reddederim veya kendi aklıma göre değiştirerek yorumlarım.",
      is_true: 0,
      explanation: "Akıl vahyi anlamak için bir araçtır, vahyi yargılayacak bir hakim değildir. Nakil her zaman aklın önündedir. Aklına uymadığı için mütevatir nassı reddetmek Mutezile sapkınlığıdır.",
      proof: "Ayet: Aralarında hüküm vermesi için Allah'a ve Resulüne çağrıldıkları zaman müminlerin sözü ancak 'İşittik ve itaat ettik' demeleridir. (Nûr, 51)"
    },
    {
      statement: "İslam tek hak din değildir. Hz. Muhammed'i ve Kur'an'ı kabul etmese bile, iyi bir insan olan Yahudi veya Hristiyanlar da kendi dinleriyle cennete gidebilir.",
      is_true: 0,
      explanation: "İslam geldikten sonra diğer tüm dinlerin hükmü kalkmıştır. Peygamber Efendimiz'i (sav) duyduğu halde iman etmeyen hiç kimse cennete giremez. 'İbrahimi dinler' adı altında dinleri eşit görmek İslam itikadını bozar.",
      proof: "Ayet: Kim İslâm'dan başka bir din ararsa, ondan kabul edilmeyecek ve o, ahirette hüsrana uğrayanlardan olacaktır. (Âl-i İmrân, 85)"
    },
    {
      statement: "Peygamberimizin İsra ve Miraç olayı (göklere yükselmesi) bedensel ve fiziksel olarak yaşanmamıştır. Bu sadece ruhsal bir uykuydu veya rüyadan ibaretti.",
      is_true: 0,
      explanation: "Ehl-i Sünnet alimlerinin ittifakıyla İsra ve Miraç olayı peygamberimiz uyanıkken, hem ruhu hem de mübarek bedeniyle fiziksel olarak gerçekleşmiş büyük bir mucizedir.",
      proof: "Ayet: Kendisine âyetlerimizden bir kısmını gösterelim diye kulunu bir gece Mescid-i Haram'dan... Mescid-i Aksa'ya götüren Allah'ın şanı yücedir. (İsrâ, 1)"
    },
    {
      statement: "Kur'an-ı Kerim Allah'ın zatından ayrıdır ve sonradan yaratılmış (mahluk) bir nesnedir.",
      is_true: 0,
      explanation: "Ehl-i Sünnet'e göre Kur'an-ı Kerim, Allah'ın kelâmıdır ve yaratılmamıştır (mahluk değildir). 'Kur'an yaratılmıştır' demek, Allah'ın sıfatlarını inkara götüren Mutezile görüşüdür.",
      proof: "Açıklama: Kur'an, Allah'ın 'Kelâm' sıfatının tecellisidir, Allah'ın sıfatları ise mahluk (yaratılmış) olamaz."
    },
    {
      statement: "İnsanın hiçbir seçme hakkı (cüz-i iradesi) yoktur. Bizler tıpkı rüzgarın önünde savrulan bir yaprak gibiyiz. O yüzden işlediğimiz günahlardan aslında biz sorumlu değiliz.",
      is_true: 0,
      explanation: "Bu görüş 'Cebriyye' sapkınlığıdır. Allah her şeyi bilir ve yaratır, ancak insana iyi ile kötüyü seçebileceği bir 'cüz-i irade' (seçme özgürlüğü) vermiştir. İnsan eylemlerinden sorumludur.",
      proof: "Ayet: Şüphesiz biz ona (doğru) yolu gösterdik. İster şükredici olsun ister nankör. (İnsan, 3)"
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

  console.log("Akaid Taslak 5 database'e eklendi ve guncellendi.");
}

migrate().catch(console.error);
