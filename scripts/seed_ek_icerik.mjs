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
  
  const idSizinti = await getCatId('Sızıntılar');

  console.log("Yeni Ana Kartlar Ekleniyor (İsraf Bölünmüş Halde)...");
  const cards = [
    { cat: idSizinti, text: "Bugün yemeği veya suyu gereksiz yere çöpe atıp israf ettin mi?", weight: -5 },
    { cat: idSizinti, text: "Bugün vaktini sosyal medyada veya faydasız işlerde öldürüp zaman israfı yaptın mı?", weight: -5 },
    { cat: idSizinti, text: "Bugün hiç ihtiyacın olmadığı halde sırf nefsin istediği için gereksiz alışveriş (mal israfı) yaptın mı?", weight: -5 },
    { cat: idSizinti, text: "Bugün karşılaştığın zorluklar karşısında 'Neden hep benim başıma geliyor' diyerek Allah'ın takdirine isyan ettin mi?", weight: -5 },
    { cat: idSizinti, text: "Bugün başkasının özel hayatını, ayıplarını veya sırlarını gizlice merak edip araştırdın mı (Tecessüs)?", weight: -5 },
  ];

  for (const c of cards) {
    await turso.execute({
      sql: "INSERT INTO cards (category_id, text, type, weight) VALUES (?, ?, 'random', ?)",
      args: [c.cat, c.text, c.weight]
    });
  }

  console.log("Yeni Rehber Ekleniyor...");
  const rehber = [
    { t: "Tecessüs (Gizliyi Araştırmak)", d: "İnsanların görünmeyen ayıplarını, sırlarını veya günahlarını merak edip deşmektir. Hucurat Suresi 12. ayette kesin olarak yasaklanmıştır. Toplumun güven duygusunu yok eder.", c: "Kendi kusurlarınla o kadar meşgul ol ki, başkalarının ayıplarını görmeye vaktin kalmasın. İnsanların dışarıya yansıttığı haliyle yetin, niyet okuyuculuğu yapma." },
    { t: "İsraf (Nimete Körleşmek)", d: "İhtiyacından fazlasını tüketmek, gösteriş için eşya almak veya zamanı boş yere harcamaktır. 'Yiyiniz içiniz fakat israf etmeyiniz' ayetine muhalefettir.", c: "Satın almadan önce 'Buna gerçekten ihtiyacım var mı, yoksa nefsim mi istiyor?' diye kendine sor. Artan yemeği sokak hayvanlarıyla paylaş, kullanmadığın eşyaları infak et." }
  ];
  for (const r of rehber) {
    await turso.execute({ sql: "INSERT INTO rehber (title, description, cure) VALUES (?, ?, ?)", args: [r.t, r.d, r.c] });
  }

  console.log("Yeni Arınma Ekleniyor...");
  const arinma = [
    { t: "Tecessüs ve Sırrı İfşa Sonrası", a: "Araştırdığın veya yaydığın sırrın sahibinden -eğer fitne çıkmayacaksa- özür dile. Fitne çıkacaksa o kişinin itibarını zedelediğin ortamlarda onu bolca öv ve onun için sadaka ver.", h: 1 },
    { t: "İsraf ve Şükürsüzlük Sonrası", a: "O gün kendine ceza (nefis terbiyesi) olarak çok sevdiğin bir yiyeceği yemekten vazgeç ve parasını bir ihtiyaç sahibine ver. Sahip olduğun 3 nimet için sesli olarak şükret.", h: 0 }
  ];
  for (const a of arinma) {
    await turso.execute({ sql: "INSERT INTO arinma (title, action, is_heavy) VALUES (?, ?, ?)", args: [a.t, a.a, a.h] });
  }

  console.log("Yeni Takva Kartları Ekleniyor...");
  const takva = [
    { c: "Sevaplar", t: "Bugün güneş doğduktan sonra Duha (Kuşluk) veya İşrak namazı kıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün Akşam ile Yatsı namazı arasında Evvabin namazı kıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Dün gece uyumadan önce abdest alıp, dualarını okuyarak sünnete uygun uyudun mu?", w: 1 },
    { c: "Sevaplar", t: "Bugün yemeğe Besmele ile başlayıp, sağ elinle yiyip sonunda Elhamdülillah diyerek sünneti ihya ettin mi?", w: 1 },
    { c: "Sevaplar", t: "Bugün Sabah namazını camide cemaatle kıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün Öğle namazını camide cemaatle kıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün İkindi namazını camide cemaatle kıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün Akşam namazını camide cemaatle kıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün Yatsı namazını camide cemaatle kıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün anne-babanı, akrabanı veya eski bir dostunu sırf Allah rızası için arayıp halini sordun mu?", w: 1 },
    { c: "Sevaplar", t: "Bugün genel olarak evden çıkarken abdestli bulunmaya özen gösterdin mi?", w: 1 },
    { c: "Sevaplar", t: "Bugün nafile oruç tuttun mu?", w: 1 },
    { c: "Sevaplar", t: "Bugün dini bir sohbete (ilim meclisine) katıldın mı?", w: 1 },
    { c: "Sevaplar", t: "Bugün dini bir program veya sohbet izledin/dinledin mi?", w: 1 },
    { c: "Sevaplar", t: "Bugün dini bir kitap (Kur'an tefsiri, hadis, fıkıh, ilmihal vb.) okudun mu?", w: 1 },
    { c: "Günahlar", t: "Bugün göz ucuyla da olsa başkasının telefon ekranına, özel mesajına veya evinin içine izinsiz baktın mı?", w: -1 },
    { c: "Günahlar", t: "Bugün bulunduğun bir ortamda, haksız yere eleştirilen bir kardeşi savunma imkanın varken sessiz kaldın mı?", w: -1 }
  ];

  for (const t of takva) {
    await turso.execute({ sql: "INSERT INTO takva_cards (category_name, text, weight) VALUES (?, ?, ?)", args: [t.c, t.t, t.w] });
  }

  console.log("Tüm yeni eklemeler başarıyla yüklendi!");
}

seed().catch(console.error);
