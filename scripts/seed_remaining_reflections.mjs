import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  const anaUpdates = [
    {
      id: 18,
      r1: "Ayet: 'Verdiğiniz sözü yerine getirin. Çünkü verilen söz, sorumluluğu gerektirir.' (İsra, 34)",
      r2: "Hadis: 'Münafığın alameti üçtür: Konuştuğunda yalan söyler, söz verdiğinde durmaz, kendisine bir şey emanet edildiğinde ihanet eder.' (Buhari)"
    },
    {
      id: 20,
      r1: "Ayet: 'Yoksa onlar, Allah'ın lütfundan insanlara verdiği şeyleri mi kıskanıyorlar?' (Nisa, 54)",
      r2: "Hadis: 'Hasetten (kıskançlıktan) sakının. Çünkü ateşin odunu yiyip bitirdiği gibi haset de iyilikleri yer bitirir.' (Ebu Davud)"
    },
    {
      id: 21,
      r1: "Ayet: 'Yazıklar olsun o namaz kılanlara ki, onlar gösteriş yaparlar.' (Maun, 4-6)",
      r2: "Hadis: 'Şüphesiz benim sizin için en çok korktuğum şey, küçük şirktir. Sahabeler: Küçük şirk nedir? diye sordular. Peygamberimiz: Riyadır (gösteriştir) dedi.' (Ahmed b. Hanbel)"
    },
    {
      id: 23,
      r1: "Ayet: 'Ey iman edenler! Zannın çoğundan sakının; çünkü zannın bir kısmı günahtır.' (Hucurat, 12)",
      r2: "Hadis: 'Zandan sakının. Çünkü zan, sözlerin en yalanıdır.' (Buhari)"
    },
    {
      id: 24,
      r1: "Ayet: 'Sizi bir imtihan olarak kötülük ve iyilikle deneyeceğiz.' (Enbiya, 35)",
      r2: "Hadis: 'Müminin durumu ne ilginçtir! Her hali kendisi için hayırlıdır... Sıkıntıya düşer, sabreder; bu onun için hayır olur.' (Müslim)"
    },
    {
      id: 31,
      r1: "Ayet: 'Allah hiçbir nefse gücünün yeteceğinden fazlasını yüklemez.' (Bakara, 286)",
      r2: "Hadis: 'Müslümana yorgunluk, hastalık, keder, üzüntü ve eziyet dokunursa, ayağına batan dikene varıncaya kadar, Allah bunları onun günahlarına keffaret kılar.' (Buhari)"
    },
    {
      id: 32,
      r1: "Ayet: 'Birbirinizin kusurunu ve mahremiyetini araştırmayın (tecessüs etmeyin).' (Hucurat, 12)",
      r2: "Hadis: 'Kim bir Müslümanın ayıbını örterse, Allah da kıyamet gününde onun ayıbını örter.' (Buhari)"
    },
    {
      id: 38,
      r1: "Ayet: 'Kendi ellerinizle kendinizi tehlikeye atmayın.' (Bakara, 195)",
      r2: "Hadis: 'İslam'da zarar vermek ve zarara zararla karşılık vermek yoktur.' (İbn Mace)"
    },
    {
      id: 39,
      r1: "Ayet: 'Allah'ın yarattığını değiştirmemelerini emredeceğim.' (Nisa, 119)",
      r2: "Hadis: 'Allah, estetik amaçlı müdahale edip (dövme vs.) yaratılışını değiştirenleri lanetlemiştir.' (Buhari)"
    },
    {
      id: 40,
      r1: "Ayet: 'Onlarla (eşlerinizle) iyi geçinin.' (Nisa, 19)",
      r2: "Hadis: 'Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır.' (Tirmizi)"
    },
    {
      id: 44,
      r1: "Ayet: 'Birbirinizi ayıplamayın ve birbirinizi kötü lakaplarla çağırmayın.' (Hucurat, 11)",
      r2: "Hadis: 'Kardeşinle tartışma, onunla (kırıcı şekilde) şakalaşma ve ona yerine getiremeyeceğin bir söz verme.' (Tirmizi)"
    },
    {
      id: 46,
      r1: "Ayet: 'Eğer şükrederseniz, size olan nimetimi mutlaka artırırım; nankörlük ederseniz hiç şüphesiz azabım çok çetindir.' (İbrahim, 7)",
      r2: "Hadis: 'İnsanlara teşekkür etmeyen, Allah'a da şükretmez.' (Tirmizi)"
    },
    {
      id: 48,
      r1: "Ayet: 'Eğer Allah sana bir zarar dokundurursa, onu yine O’ndan başka giderecek yoktur.' (En'am, 17)",
      r2: "Hadis: 'Hastalandığım zaman bana şifa veren O'dur.' (Şuara, 80)"
    },
    {
      id: 49,
      r1: "Ayet: 'Yeryüzünde yürüyen her canlının rızkı, yalnızca Allah'ın üzerinedir.' (Hud, 6)",
      r2: "Hadis: 'Hiç kimse, rızkını tamamlamadan ölmez. O halde rızkınızı ararken güzel yollar (helal) arayın.' (İbn Mace)"
    },
    {
      id: 50,
      r1: "Ayet: 'Sana gelen her iyilik Allah'tandır, sana gelen her kötülük de kendindendir.' (Nisa, 79)",
      r2: "Hadis: 'Bilin ki, bütün ümmet toplanıp sana fayda vermek istese, Allah'ın yazdığından başkasını veremez.' (Tirmizi)"
    },
    {
      id: 53,
      r1: "Ayet: 'Ey iman edenler! Akitlerinizi (sözleşme ve borçlarınızı) yerine getirin.' (Maide, 1)",
      r2: "Hadis: 'Zenginin borcunu ertelemesi bir zulümdür.' (Buhari)"
    },
    {
      id: 54,
      r1: "Ayet: 'Allah size, emanetleri mutlaka ehline vermenizi emreder.' (Nisa, 58)",
      r2: "Hadis: 'Kimin boynunda kardeşinin bir hakkı varsa... altın ve gümüşün geçmeyeceği kıyamet günü gelmeden helalleşsin.' (Buhari)"
    },
    {
      id: 56,
      r1: "Ayet: 'İnsan için kendi çalışmasından başka bir şey yoktur.' (Necm, 39)",
      r2: "Hadis: 'Kişinin yediği en hayırlı yemek, kendi el emeğiyle kazandığıdır.' (Buhari)"
    }
  ];

  const takvaUpdates = [
    { id: 5, r1: "Ayet: 'Gecenin bir kısmında da uyanıp sana mahsus bir nafile olmak üzere teheccüd kıl.' (İsra, 79)", r2: "Hadis: 'Farzlardan sonra en faziletli namaz, gece kalkıp kılınan teheccüd namazıdır.' (Müslim)" },
    { id: 6, r1: "Ayet: 'Mallarını Allah yolunda harcayanların durumu, yedi başak bitiren tohum gibidir.' (Bakara, 261)", r2: "Hadis: 'Yarım hurma ile de olsa kendinizi ateşten koruyun.' (Buhari)" },
    { id: 7, r1: "Ayet: 'Biz Kur'an'dan, mü'minler için şifa ve rahmet olan şeyler indiriyoruz.' (İsra, 82)", r2: "Hadis: 'Sizin en hayırlınız, Kur'an'ı öğrenen ve öğretendir.' (Buhari)" },
    { id: 8, r1: "Ayet: 'Öyleyse beni (ibadetle) anın ki ben de sizi anayım.' (Bakara, 152)", r2: "Hadis: 'Rabbini zikredenle etmeyenin farkı, diriyle ölünün farkı gibidir.' (Buhari)" },
    { id: 9, r1: "Hadis: 'Din kardeşinin yüzüne gülümsemen senin için bir sadakadır.' (Tirmizi)", r2: "Hadis: 'İman etmedikçe cennete giremezsiniz... Size bir sır vereyim mi? Aranızda selamı yayın.' (Müslim)" },
    { id: 10, r1: "Hadis: 'Şüpheli şeylerden sakınan, dinini ve ırzını (namusunu/şerefini) korumuş olur.' (Buhari)", r2: "Ayet: 'Aranızda günah işlemekte ve düşmanlık yapmakta yardımlaşmayın.' (Maide, 2)" },
    { id: 11, r1: "Hadis: 'Haklı olduğu halde tartışmayı terk eden kimseye cennetin kenarında bir köşk verileceğine kefilim.' (Ebu Davud)", r2: "Ayet: 'Boş söz işittikleri zaman ondan yüz çevirirler.' (Kasas, 55)" },
    { id: 12, r1: "Hadis: 'Herkesin her bir eklemi için her gün bir sadaka gerekir... İki rekat kuşluk (duha) namazı bunların yerini tutar.' (Müslim)", r2: "Hadis: 'Kim kuşluk namazını kılmaya devam ederse, günahları deniz köpüğü kadar da olsa bağışlanır.' (Tirmizi)" },
    { id: 13, r1: "Hadis: 'Kim akşam namazından sonra kötü bir şey konuşmadan altı rekat (Evvabin) namaz kılarsa, bu onun için on iki yıllık ibadete denk sayılır.' (Tirmizi)", r2: "Ayet: 'Onların yanları (gece namazı kılmak için) yataklarından uzaklaşır.' (Secde, 16)" },
    { id: 14, r1: "Hadis: 'Abdestli olarak yatan kimse, o gece ibadet etmiş gibi sevap kazanır.' (İbn Hibban)", r2: "Ayet: 'Gündüzün ve gecenin anlarında (Rabbini) tesbih et ki rızaya eresin.' (Taha, 130)" },
    { id: 15, r1: "Hadis: 'Biriniz yemek yiyeceği zaman Bismillâh desin.' (Ebu Davud)", r2: "Hadis: 'Sağ elinizle yiyin, sağ elinizle için, sağ elinizle alın, sağ elinizle verin.' (İbn Mace)" },
    { id: 16, r1: "Hadis: 'Kim sabah namazını cemaatle kılarsa gecenin tamamını ihya etmiş gibi olur.' (Müslim)", r2: "Ayet: 'Sabah namazını kıl; çünkü sabah namazında melekleri hazır bulunur.' (İsra, 78)" },
    { id: 17, r1: "Hadis: 'Cemaatle kılınan namaz, tek başına kılınan namazdan yirmi yedi derece daha faziletlidir.' (Buhari)", r2: "Ayet: 'Namazı dosdoğru kılın, rükû edenlerle beraber rükû edin.' (Bakara, 43)" },
    { id: 18, r1: "Hadis: 'İki serinlik namazını (sabah ve ikindi) kılan kimse cennete girer.' (Buhari)", r2: "Ayet: 'Namazlara ve orta namaza (ikindiye) devam edin.' (Bakara, 238)" },
    { id: 19, r1: "Hadis: 'Cemaatle kılınan namaz, tek başına kılınan namazdan yirmi yedi derece daha faziletlidir.' (Buhari)", r2: "Ayet: 'Namazı kılın, zekatı verin, rükû edenlerle beraber rükû edin.' (Bakara, 43)" },
    { id: 20, r1: "Hadis: 'Kim yatsı namazını cemaatle kılarsa gecenin yarısını ihya etmiş gibi olur.' (Müslim)", r2: "Ayet: 'Namazı dosdoğru kılın, rükû edenlerle beraber rükû edin.' (Bakara, 43)" },
    { id: 21, r1: "Hadis: 'Rızkının çoğalmasını isteyen kimse, sıla-i rahim yapsın.' (Buhari)", r2: "Ayet: 'Akrabaya, yoksula, yolda kalmışa hakkını ver.' (İsra, 26)" },
    { id: 22, r1: "Hadis: 'Temizlik imanın yarısıdır.' (Müslim)", r2: "Hadis: 'Abdest bozduktan sonra abdest alıp şükreden, sabreden oruçlu gibidir.' (Tirmizi)" },
    { id: 23, r1: "Hadis: 'Allah yolunda bir gün oruç tutan kimsenin yüzünü Allah yetmiş yıllık mesafeye cehennemden uzaklaştırır.' (Buhari)", r2: "Hadis: 'Oruç bir kalkandır.' (Buhari)" },
    { id: 24, r1: "Hadis: 'Allah'ın kitabını okur ve aralarında müzakere ederlerse, üzerlerine sekînet iner.' (Müslim)", r2: "Hadis: 'İlim öğrenmek için yola çıkan kimse, dönünceye kadar Allah yolundadır.' (Tirmizi)" },
    { id: 25, r1: "Hadis: 'Kim ilim tahsil etmek için bir yola girerse, Allah o kişiye cennetin yolunu kolaylaştırır.' (Müslim)", r2: "Ayet: 'De ki: Hiç bilenlerle bilmeyenler bir olur mu?' (Zümer, 9)" },
    { id: 26, r1: "Hadis: 'Hikmet (faydalı bilgi) müminin yitik malıdır.' (Tirmizi)", r2: "Ayet: 'Kulları içinden ancak âlimler, Allah'tan (gereğince) korkar.' (Fatır, 28)" },
    { id: 27, r1: "Ayet: 'Mümin erkeklere söyle, gözlerini haramdan sakınsınlar.' (Nur, 30)", r2: "Hadis: 'Kim bir Müslümanın ayıbını örterse, Allah da kıyamet gününde onun ayıbını örter.' (Buhari)" },
    { id: 28, r1: "Hadis: 'Kim din kardeşinin onurunu savunursa, Allah da kıyamet günü onun yüzünü cehennem ateşinden korur.' (Tirmizi)", r2: "Ayet: 'Ey iman edenler! Allah için hakkı titizlikle ayakta tutan, adalet ile şahitlik eden kimseler olun.' (Maide, 8)" },
    { id: 29, r1: "Ayet: 'Göklerin ve yerin yaratılışı üzerinde düşünürler.' (Âl-i İmran, 191)", r2: "Hadis: 'Bir saat tefekkür, bir yıl (nafile) ibadetten daha hayırlıdır.' (Camiu's-Sağir)" }
  ];

  for (const up of anaUpdates) {
    await turso.execute({
      sql: "UPDATE cards SET reflection_1 = ?, reflection_2 = ? WHERE id = ?",
      args: [up.r1, up.r2, up.id]
    });
  }

  for (const up of takvaUpdates) {
    await turso.execute({
      sql: "UPDATE takva_cards SET reflection_1 = ?, reflection_2 = ? WHERE id = ?",
      args: [up.r1, up.r2, up.id]
    });
  }

  console.log("Kalan tüm kartlar için tefekkürler başarıyla veritabanına işlendi!");
}

seed().catch(console.error);
