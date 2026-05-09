import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  const getCatId = async (name) => {
    const res = await turso.execute({ sql: "SELECT id FROM categories WHERE name = ?", args: [name] });
    return res.rows[0].id;
  };
  
  const idSosyal = await getCatId('Sosyal Hasar');
  const idKalp = await getCatId('Kalp Hastalıkları');
  const idSizinti = await getCatId('Sızıntılar');

  console.log("5. Taslak Kartları Ekleniyor (İş, Dijital, Çevre)...");
  
  const cards = [
    // İş ve Ticaret (Sosyal Hasar)
    { cat: idSosyal, text: "Bugün işteyken (veya dersteyken) sana emanet edilen mesai saatini, şahsi keyfin veya sosyal medyan için israf edip kul hakkına girdin mi?", weight: -10 },
    { cat: idSosyal, text: "Bugün yaptığın işte veya ticarette, karşı tarafı eksik, kusurlu veya hatalı bir işlemle bilerek aldattın mı?", weight: -10 },
    { cat: idSosyal, text: "Bugün elinde ödeme imkânı olduğu halde, sırf kendi rahatın için bir borcunu (kul hakkını) erteleyip alacaklıyı mağdur ettin mi?", weight: -10 },
    { cat: idSosyal, text: "Bugün liyakat (hak etme) esasına dayanmayan bir şekilde, haksız bir iltimas (torpil) ile başkasının önüne geçtin mi veya aracılık ettin mi?", weight: -10 },

    // Dijital Ahlak
    { cat: idSosyal, text: "Bugün sosyal medyada doğruluğundan emin olmadığın bir haberi (iftirayı) paylaştın mı veya klavye başında birini linç eden kalabalığa katıldın mı?", weight: -5 },
    { cat: idSosyal, text: "Bugün emeğe saygı göstermeyerek; korsan yazılım, kaçak dizi/film veya telif hakkı ihlali içeren bir içeriği tüketip kul hakkına girdin mi?", weight: -5 },
    { cat: idKalp, text: "Bugün yediğin bir yemeği, gittiğin mekanı veya yaptığın bir ibadeti sırf 'bakın ben ne kadar iyiyim/zenginim' diyerek (Riya) sosyal medyada paylaştın mı?", weight: -10 },

    // Toplumsal / Çevre (Sızıntı / Sosyal Hasar)
    { cat: idSosyal, text: "Bugün yere çöp atarak, sıraya kaynak yaparak veya trafikte kuralları ezip bencilce davranarak diğer insanların ortak hakkına tecavüz ettin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün Allah'ın dilsiz kulları olan sokak hayvanlarına eziyet ettin mi veya kapısındaki aç/susuz bir hayvanı görmezden geldin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün gürültü yaparak, çöpünü özensiz bırakarak veya herhangi bir bencil eyleminle komşuna rahatsızlık verip onun hakkına girdin mi?", weight: -5 }
  ];

  for (const c of cards) {
    await turso.execute({
      sql: "INSERT INTO cards (category_id, text, type, weight) VALUES (?, ?, 'random', ?)",
      args: [c.cat, c.text, c.weight]
    });
  }

  console.log("Yeni Rehber Ekleniyor...");
  const rehber = [
    { t: "Kamu ve Dijital Kul Hakkı", d: "Bir kişinin hakkını yediğinde ondan helallik alabilirsin. Ancak trafikte yaptığın kural ihlali, sosyal medyada yaydığın bir yalan haber veya mesai saatinden çalman, binlerce insanın hakkına (Kamu Hakkı) girmektir.", c: "Kamu hakkına girdiysen, bunu ancak o kamuya fayda sağlayacak devasa iyiliklerle (vakıflara bağış, kamu hizmeti) temizlemeye çalışabilirsin." }
  ];
  for (const r of rehber) {
    await turso.execute({ sql: "INSERT INTO rehber (title, description, cure) VALUES (?, ?, ?)", args: [r.t, r.d, r.c] });
  }

  console.log("Yeni Arınma Ekleniyor...");
  const arinma = [
    { t: "Dijital Korsan ve Mesai Sonrası Arınma", a: "Korsan kullandığın içerikleri sil ve o içeriğin ederini (veya mesai saatinde çaldığın zamanın maddi karşılığını) tespit edip, derhal sadaka olarak yoksullara veya kamu yararına dağıt. Tövbeye niyet et.", h: 1 }
  ];
  for (const a of arinma) {
    await turso.execute({ sql: "INSERT INTO arinma (title, action, is_heavy) VALUES (?, ?, ?)", args: [a.t, a.a, a.h] });
  }

  console.log("5. Aşama İçerikler başarıyla yüklendi!");
}

seed().catch(console.error);
