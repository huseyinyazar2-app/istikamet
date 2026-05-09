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
  const idAna = await getCatId('Ana Kolonlar');

  console.log("Yeni Ana Kartlar Ekleniyor (Taslak 3 ve Kullanıcı Yorumları)...");
  
  const cards = [
    { cat: idAna, text: "Bugün zinaya veya insanı o çirkin yola sürükleyecek flört/yakınlaşmalara bulaştın mı?", weight: -10 },
    { cat: idAna, text: "Bugün faiz (riba) alarak, vererek veya faizli bir işleme bilerek aracılık ederek Allah ve Resulüne savaş açanlardan oldun mu?", weight: -10 },
    { cat: idAna, text: "Bugün başkasının malına, fikrine veya zamanına haksız yere el uzatıp (maddi/manevi hırsızlık yapıp) kul hakkına girdin mi?", weight: -10 },
    
    { cat: idSosyal, text: "Bugün aklını ve iradeni uyuşturan, haram kılınmış içki vb. maddelere yaklaştın mı veya bu tarz ortamlarda bulundun mu?", weight: -10 },
    { cat: idSosyal, text: "Bugün piyango, iddia veya herhangi bir kumar/şans oyunu türüyle rızkını harama bulaştırdın mı?", weight: -10 },
    { cat: idSosyal, text: "Bugün Allah'ın emanet ettiği bedenine zarar veren (sigara vb.) kötü alışkanlıklara teslim oldun mu?", weight: -5 },
    { cat: idSosyal, text: "Bugün Allah'ın sana emanet ettiği bedeninin fıtratını bozacak, kalıcı hasar veren dövme vb. bir işlem yaptırdın veya buna onay verdin mi?", weight: -5 },

    { cat: idSosyal, text: "Bugün eşine (veya aile fertlerine) tahammülsüzlük gösterip, kalp kıracak şekilde sesini yükselttin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün çocuklarına (veya senden küçüklere) şefkatle yaklaşmak yerine haksız yere öfkelenip onları azarladın mı?", weight: -5 },
    { cat: idSosyal, text: "Bugün dilini bozup öfkeyle veya şaka yollu bir başkasına küfür, hakaret veya çirkin söz söyledin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün birinin fiziksel kusuruyla, şivesiyle veya hatasıyla (şaka yollu bile olsa) alay ettin mi?", weight: -5 },
    { cat: idSosyal, text: "Bugün bir Müslüman kardeşine, onun hoşlanmayacağı kötü bir lakapla seslendin mi veya arkasından onu o lakapla andın mı?", weight: -5 },

    { cat: idKalp, text: "Bugün kalbinde sana haksızlık etmiş birine karşı (özür dilese bile) kin tutup, onu affetmemekte ısrar ettin mi?", weight: -10 },
    { cat: idKalp, text: "Bugün sana iyilik yapan bir insana (veya Allah'a) teşekkür etmeyip nankörlük ettin mi?", weight: -10 },
    { cat: idKalp, text: "Bugün yardım veya ikram etme imkanın olduğu halde, sırf malın eksilir korkusuyla cimrilik edip elini sıktın mı?", weight: -10 },
    
    { cat: idKalp, text: "Gizli Şirk: Bugün hastalandığında veya iyileştiğinde, şifayı asıl veren Allah'ı unutup sadece ilaçtan veya doktordan bildin mi?", weight: -10 },
    { cat: idKalp, text: "Gizli Şirk: Bugün kazandığın rızkı ve maaşı sana verenin Allah olduğunu unutup, sadece patronundan veya mesleğinden bildin mi?", weight: -10 },
    { cat: idKalp, text: "Gizli Şirk: Bugün elde ettiğin bir başarıda 'Bunu ben kendi zekam ve gücümle başardım' diyerek Karun gibi Allah'ın yardımını inkar ettin mi?", weight: -10 }
  ];

  for (const c of cards) {
    await turso.execute({
      sql: "INSERT INTO cards (category_id, text, type, weight) VALUES (?, ?, 'random', ?)",
      args: [c.cat, c.text, c.weight]
    });
  }

  console.log("Yeni Rehber Ekleniyor...");
  const rehber = [
    { t: "Aile İçi Zulüm ve Öfke", d: "İnsanın dışarıda kibar olup, evde eşine ve çocuklarına aslan kesilmesidir. Peygamber Efendimiz (sav): 'Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır.' buyurmuştur. Ev, insanın gerçek ahlakının ortaya çıktığı er meydanıdır.", c: "Evin kapısından girerken işin ve sokağın stresini dışarıda bırak. Öfke geldiğinde sus, haklı olsan bile aileni kırmaktan Allah'a sığın." },
    { t: "Cimrilik (Buhl)", d: "Verilmesi gereken yerde malı tutmak, fakirleşme korkusuyla (Şeytanın vaadiyle) Allah'ın rızkına güvenmemektir.", c: "Cimriliğin ilacı, içinden hiç gelmediği anlarda inadına cömertlik yapmaktır. Malın gerçek sahibinin sen olmadığını tefekkür et." },
    { t: "Gizli Şirk (Sebeplere Sarılmak)", d: "İnsanın sebepleri yaratıcı zannetmesidir. İlacı, patronu veya kendi zekasını gücün kaynağı olarak görmektir. Oysa her şeyin dizgini Allah'ın elindedir.", c: "İlacı içerken 'Ya Şafi' de. Başarı kazandığında 'Elhamdülillah, Allah lütfetti' de. Sebeplere tutun ama sonucu sadece Müsebbib-ül Esbab'dan (Allah'tan) bekle." }
  ];
  for (const r of rehber) {
    await turso.execute({ sql: "INSERT INTO rehber (title, description, cure) VALUES (?, ?, ?)", args: [r.t, r.d, r.c] });
  }

  console.log("Yeni Arınma Ekleniyor...");
  const arinma = [
    { t: "Eşin/Çocuğun Kalbini Kırdıktan Sonra", a: "Egonu bir kenara bırakıp eşinden açıkça özür dile, küçük bir hediye veya ikram ile gönlünü al. Çocuğunu azarladıysan, onun seviyesine inip şefkatle saçını okşa ve onunla oyun oynayarak aradaki sevgi bağını tamir et.", h: 1 },
    { t: "Küfür ve Alay Sonrası Dil Temizliği", a: "Dilini temizlemek için o an 33 defa 'Estağfirullah' çek. O gün günahın kefareti olarak insanlara sadece güzel ve iltifat dolu sözler söylemeye, tebessüm etmeye kendini mecbur bırak.", h: 0 },
    { t: "Sigara/Kötü Alışkanlık Sonrası", a: "O gün içtiğin her bir sigara (veya kötü alışkanlık) miktarı kadar, sadaka kutusuna para at. Nefsine mali bir bedel ödet ki bu alışkanlıktan vazgeçmesi kolaylaşsın.", h: 0 }
  ];
  for (const a of arinma) {
    await turso.execute({ sql: "INSERT INTO arinma (title, action, is_heavy) VALUES (?, ?, ?)", args: [a.t, a.a, a.h] });
  }

  console.log("Yeni Takva Kartları Ekleniyor...");
  const takva = [
    { c: "Sevaplar", t: "Bugün kâinata, yaratılışa veya başından geçen bir olaya İslami bir nazarla bakıp Allah'ın azametini tefekkür ettin mi?", w: 1 },
  ];

  for (const t of takva) {
    await turso.execute({ sql: "INSERT INTO takva_cards (category_name, text, weight) VALUES (?, ?, ?)", args: [t.c, t.t, t.w] });
  }

  console.log("3. Aşama Ek İçerikler başarıyla yüklendi!");
}

seed().catch(console.error);
