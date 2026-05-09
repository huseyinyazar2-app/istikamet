import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log("Eski deneme verileri temizleniyor...");
  await turso.execute("DELETE FROM reflections");
  await turso.execute("DELETE FROM cards");
  await turso.execute("DELETE FROM rehber");
  await turso.execute("DELETE FROM arinma");
  await turso.execute("DELETE FROM takva_cards");

  const cats = ['Ana Kolonlar', 'Sosyal Hasar', 'Kalp Hastalıkları', 'Sızıntılar'];
  for (const c of cats) {
    await turso.execute({ sql: "INSERT OR IGNORE INTO categories (name) VALUES (?)", args: [c] });
  }

  const getCatId = async (name) => {
    const res = await turso.execute({ sql: "SELECT id FROM categories WHERE name = ?", args: [name] });
    return res.rows[0].id;
  };

  const idAna = await getCatId('Ana Kolonlar');
  const idSosyal = await getCatId('Sosyal Hasar');
  const idKalp = await getCatId('Kalp Hastalıkları');
  const idSizinti = await getCatId('Sızıntılar');

  console.log("Ana Kartlar ekleniyor...");
  const cards = [
    { cat: idAna, text: "Bugün Sabah namazını vaktinde eda ettin mi?", weight: 5 },
    { cat: idAna, text: "Bugün Öğle namazını vaktinde eda ettin mi?", weight: 5 },
    { cat: idAna, text: "Bugün İkindi namazını vaktinde eda ettin mi?", weight: 5 },
    { cat: idAna, text: "Bugün Akşam namazını vaktinde eda ettin mi?", weight: 5 },
    { cat: idAna, text: "Bugün Yatsı namazını vaktinde eda ettin mi?", weight: 5 },
    { cat: idAna, text: "Bugün midene haram veya şüpheli bir lokma girmesinden korundun mu?", weight: 5 },
    
    { cat: idSosyal, text: "Bugün birinin gıybetini yaptın mı veya yapılan gıybeti onaylayarak dinledin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün şaka yollu veya menfaat icabı da olsa yalan söyledin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün anne-babanın kalbini kıracak veya eşine/çevrene zulmedecek bir söz söyledin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün verdiğin bir sözden caydın mı veya emanete hıyanet ettin mi?", weight: -5 },

    { cat: idKalp, text: "Bugün kendini başkalarından üstün, haklı veya daha dindar görüp içinden insanları küçümsedin mi?", weight: -10 },
    { cat: idKalp, text: "Bugün başkasının sahip olduğu bir nimeti içinden kıskanıp, 'Neden bende yok?' diye düşündün mü?", weight: -10 },
    { cat: idKalp, text: "Bugün yaptığın bir ibadeti veya iyiliği başkaları görsün, beğensin diye yaptın mı?", weight: -10 },
    { cat: idKalp, text: "Bugün kıldığın namaza veya yaptığın hayra güvenip 'Ben iyi biriyim' diyerek nefsini beğendin mi?", weight: -10 },
    { cat: idKalp, text: "Bugün bir Müslüman kardeşi hakkında kesin bir delil olmadan kötü bir zanda bulundun mu?", weight: -10 },
    { cat: idKalp, text: "Bugün karşılaştığın bir dert karşısında Allah'ın rahmetinden ümidini kesip isyana yaklaştın mı?", weight: -10 },

    { cat: idSizinti, text: "Bugün namahreme bakmaktan (göz zinasından) kendini koruyabildin mi?", weight: 5 },
    { cat: idSizinti, text: "Bugün ahiretine veya dünyana faydası olmayan boş işlerle vaktini israf ettin mi?", weight: -5 },
    { cat: idSizinti, text: "Bugün haksız yere öfkelenip sesini yükselttin mi?", weight: -5 },
  ];

  for (const c of cards) {
    await turso.execute({
      sql: "INSERT INTO cards (category_id, text, type, weight) VALUES (?, ?, 'random', ?)",
      args: [c.cat, c.text, c.weight]
    });
  }

  console.log("Rehber ekleniyor...");
  const rehber = [
    { t: "Kibir (Büyüklük Taslamak)", d: "Kişinin hakkı kabul etmemesi ve insanları hakir görmesidir. Özünde derin bir özgüven eksikliğinden, hiçliğini inkar etmekten ve Allah'ın nimetlerini kendinden bilmekten (Firavunlaşmaktan) beslenir. Hadis-i Şerif: 'Kalbinde hardal tanesi kadar kibir olan cennete giremez.'", c: "Tevazu çalışmaları yap. Fakir ve yoksullarla aynı sofraya otur, tanımadığın insanlara selam ver. Allah'ın büyüklüğü (El-Mütekebbir) karşısında kendi acziyetini derin derin tefekkür et." },
    { t: "Riya (Gösteriş ve Gizli Şirk)", d: "İbadetleri ve iyilikleri Yaratıcının rızası için değil, yaratılanların övgüsü için yapmaktır. İnsanın onaylanma psikolojisinden doğar. Amellerin sevabını kökünden yok eder.", c: "Nafile ibadetlerini (namaz, sadaka) evinin gizli odalarında, kimsenin haberi olmadan yap. Sosyal medyada dini kimliğini öne çıkaracak paylaşımlardan uzak dur." },
    { t: "Haset (Kıskançlık)", d: "Başkasına verilen nimetin ondan alınıp sana verilmesini istemektir. 'Ateşin odunu yakıp bitirdiği gibi, haset de iyilikleri yer bitirir.' (Hadis). İlahi taksime (Allah'ın kime ne vereceğine) itiraz etmektir.", c: "Haset ettiğin kişi için gıyabında (arkasından) hayır dua et. Ona hediye al ve nimetleri verenin Allah olduğunu, herkesin imtihanının farklı olduğunu anla." },
    { t: "Ucub (Kendi Amelini Beğenmek)", d: "Kişinin kendi ibadetlerine ve ahlakına güvenmesidir. Kibir başkalarına karşı yapılır, ucub ise kişinin kendi içindedir. Amelleri zehirler.", c: "Kıldığın namazın veya yaptığın iyiliğin gücünü sana verenin Allah (Tevfik) olduğunu hatırla. 'La havle vela kuvvete illa billah' zikrini artır." }
  ];
  for (const r of rehber) {
    await turso.execute({ sql: "INSERT INTO rehber (title, description, cure) VALUES (?, ?, ?)", args: [r.t, r.d, r.c] });
  }

  console.log("Arınma ekleniyor...");
  const arinma = [
    { t: "Gıybet ve Kul Hakkı Sonrası Arınma", a: "Hakkına girdiğin kişi hayattaysa ondan helallik iste. Eğer helallik istersen fitne çıkacaksa veya kişi ölmüşse, onun adına sadaka ver ve şöyle dua et: 'Allah'ım, beni ve gıybetini yaptığım kardeşimi bağışla.'", h: 1 },
    { t: "Öfke Kontrolü Kaybı Sonrası", a: "Hemen 'Euzü billahi mineşşeytanirracim' de. Ayaktaysan otur, oturuyorsan uzan. Öfke ateşini söndürmek için soğuk su ile abdest al ve 'Ya Halim' esmasını zikret.", h: 0 },
    { t: "Göz Zinası (Harama Bakma) Sonrası", a: "O ortamı veya o uygulamayı derhal terk et. Göz nurunu geri kazanmak için Kuran-ı Kerim tilaveti yap. Tövbe olarak o gün fazladan sadaka ver (Çünkü sadaka belayı ve günahı temizler).", h: 0 },
    { t: "Kalp Katılığı ve Gaflet Hali", a: "Dünyaya fazla dalmaktan kalbin katılaştıysa; mezarlık ziyareti yap (Rabıta-i Mevt). Bir yetimin başını okşa veya bir hayvanı doyur. Sabah ve akşam Seyyidül İstiğfar duasını okumayı alışkanlık edin.", h: 0 }
  ];
  for (const a of arinma) {
    await turso.execute({ sql: "INSERT INTO arinma (title, action, is_heavy) VALUES (?, ?, ?)", args: [a.t, a.a, a.h] });
  }

  console.log("Takva Kartları ekleniyor...");
  const takva = [
    { c: "Sevaplar", t: "Bugün Teheccüd namazına (veya gecenin bir vakti duaya) kalkabildin mi?", w: 1 },
    { c: "Sevaplar", t: "Bugün sağ elin verdiğini sol el görmeyecek gizlilikte bir sadaka verdin mi?", w: 1 },
    { c: "Sevaplar", t: "Bugün Kuran-ı Kerim'den en az bir sayfa okuyup, bir ayetin manasını derinlemesine tefekkür ettin mi?", w: 1 },
    { c: "Sevaplar", t: "Bugün sabah ve akşam zikirlerini (virdlerini/tesbihatını) eksiksiz yaptın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün hiç tanımadığın birine tebessüm edip selam verdin mi?", w: 1 },
    { c: "Günahlar", t: "Bugün şüpheli (haram olma ihtimali olan) bir ortama veya eyleme yaklaştın mı?", w: -1 },
    { c: "Günahlar", t: "Bugün tartışma anında haklı bile olsan, nefsine yenik düşüp tartışmayı uzattın mı?", w: -1 }
  ];

  for (const t of takva) {
    await turso.execute({ sql: "INSERT INTO takva_cards (category_name, text, weight) VALUES (?, ?, ?)", args: [t.c, t.t, t.w] });
  }

  console.log("Tüm içerikler başarıyla yüklendi!");
}

seed().catch(console.error);
