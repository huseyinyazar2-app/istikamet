import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  const ana = [
    { id: 9, r1: "Hadis: 'Kim sabah namazını kılarsa, Allah'ın güvencesi altındadır.' (Müslim)", r2: "Ayet: 'Sabah namazını kıl; çünkü sabah namazında melekler hazır bulunur.' (İsra, 78)" },
    { id: 10, r1: "Hadis: 'Kıyamet gününde kulun hesaba çekileceği ilk ameli namazdır.' (Tirmizi)", r2: "Ayet: 'Namazı dosdoğru kılın, çünkü namaz müminler üzerine vakitleri belli bir farzdır.' (Nisa, 103)" },
    { id: 11, r1: "Hadis: 'İkindi namazını terk eden kimsenin ameli boşa gider.' (Buhari)", r2: "Ayet: 'Namazlara ve orta namaza (ikindiye) devam edin.' (Bakara, 238)" },
    { id: 12, r1: "Hadis: 'Akşam namazı, gündüzün ibadetlerinin mührüdür.' (Tirmizi)", r2: "Ayet: 'Gündüzün iki ucunda ve gecenin gündüze yakın zamanlarında namaz kıl.' (Hud, 114)" },
    { id: 13, r1: "Hadis: 'Münafıklara en ağır gelen namaz, yatsı ve sabah namazlarıdır.' (Buhari)", r2: "Ayet: 'Namaz, insanı hayasızlıktan ve kötülükten alıkoyar.' (Ankebut, 45)" },
    { id: 14, r1: "Hadis: 'Kim haram lokma ile büyürse, ona en layık olan şey ateştir.' (Tirmizi)", r2: "Ayet: 'Ey iman edenler! Size verdiğimiz rızıkların temiz olanlarından yiyin.' (Bakara, 172)" },
    { id: 15, r1: "Ayet: 'Biriniz diğerinizi arkasından çekiştirmesin (gıybet etmesin). Ölü kardeşinizin etini yemekten hoşlanır mısınız?' (Hucurat, 12)", r2: "Hadis: 'Gıybet, kardeşini hoşlanmadığı bir şeyle anmandır.' (Müslim)" },
    { id: 16, r1: "Hadis: 'Yalan, kötülüğe; kötülük de cehenneme götürür.' (Buhari)", r2: "Ayet: 'Yalanı ancak Allah'ın âyetlerine inanmayanlar uydurur.' (Nahl, 105)" },
    { id: 17, r1: "Ayet: 'Onlara Öf bile deme, onları azarlama!' (İsra, 23)", r2: "Hadis: 'Allah'ın rızası anne-babanın rızasında, gazabı da onların gazabındadır.' (Tirmizi)" },
    { id: 18, r1: "Ayet: 'Verdiğiniz sözü yerine getirin. Çünkü verilen söz, sorumluluğu gerektirir.' (İsra, 34)", r2: "Hadis: 'Münafığın alameti üçtür: Konuştuğunda yalan söyler, söz verdiğinde durmaz, kendisine emanet edilene hıyanet eder.' (Buhari)" },
    { id: 19, r1: "Hadis: 'Kalbinde zerre miktarı kibir bulunan kimse cennete giremez.' (Müslim)", r2: "Ayet: 'Yeryüzünde böbürlenerek yürüme!' (İsra, 37)" },
    { id: 20, r1: "Ayet: 'Yoksa onlar, Allah'ın lütfundan insanlara verdiği şeyleri mi kıskanıyorlar?' (Nisa, 54)", r2: "Hadis: 'Hasetten (kıskançlıktan) sakının. Ateşin odunu yediği gibi haset de iyilikleri yer bitirir.' (Ebu Davud)" },
    { id: 21, r1: "Hadis: 'Gösteriş (riya) için amellerini yapanı Allah kıyamet günü rezil eder.' (Müslim)", r2: "Ayet: 'Yazıklar olsun o namaz kılanlara ki, onlar gösteriş yaparlar.' (Maun, 4-6)" },
    { id: 22, r1: "Hadis: 'Kişi ibadet eder ama ameli ucub (kendini beğenme) yüzünden boşa gider.' (İbn Mace)", r2: "Ayet: 'Sana yakîn (ölüm) gelinceye kadar Rabbine ibadet et (fakat övünme).' (Hicr, 99)" },
    { id: 23, r1: "Hadis: 'Zandan sakının. Çünkü zan, sözlerin en yalanıdır.' (Buhari)", r2: "Ayet: 'Ey iman edenler! Zannın çoğundan sakının; çünkü zannın bir kısmı günahtır.' (Hucurat, 12)" },
    { id: 24, r1: "Ayet: 'Sizi bir imtihan olarak kötülük ve iyilikle deneyeceğiz.' (Enbiya, 35)", r2: "Hadis: 'Müminin durumu ne ilginçtir! Sıkıntıya düşer sabreder, bu onun için hayır olur.' (Müslim)" },
    { id: 25, r1: "Ayet: 'Mümin erkeklere söyle, gözlerini haramdan sakınsınlar.' (Nur, 30)", r2: "Hadis: 'Gözlerin zinası harama bakmaktır.' (Buhari)" },
    { id: 26, r1: "Ayet: 'Onlar ki, boş ve yararsız şeylerden (malayaniden) yüz çevirirler.' (Müminun, 3)", r2: "Hadis: 'Kişinin kendisini ilgilendirmeyen şeyleri terk etmesi İslam'ının güzelliğindendir.' (Tirmizi)" },
    { id: 27, r1: "Hadis: 'Gerçek pehlivan öfkelendiğinde nefsine hakim olandır.' (Buhari)", r2: "Ayet: 'Onlar öfkelerini yutanlar ve insanları affedenlerdir.' (Âl-i İmran, 134)" },
    { id: 28, r1: "Ayet: 'Yiyin için, fakat israf etmeyin. Çünkü Allah israf edenleri sevmez.' (A'raf, 31)", r2: "Hadis: 'Yere düşen lokmayı alın, temizleyip yiyin, onu şeytana bırakmayın.' (Müslim)" },
    { id: 29, r1: "Hadis: 'İki nimet vardır ki insanların çoğu bunda aldanmıştır: Sıhhat ve boş vakit.' (Buhari)", r2: "Ayet: 'Kıyamet günü hiçbir kul, ömrünü nerede tükettiğinden sorulmadıkça yerinden ayrılamaz.' (Tirmizi)" },
    { id: 30, r1: "Ayet: 'Saçıp savuranlar, şeytanların kardeşleridir.' (İsra, 27)", r2: "Hadis: 'Kibre düşmeden ve israf etmeden yiyin, için, giyinin ve sadaka verin.' (Buhari)" },
    { id: 31, r1: "Ayet: 'Allah hiçbir nefse gücünün yeteceğinden fazlasını yüklemez.' (Bakara, 286)", r2: "Hadis: 'Müslümana yorgunluk, hastalık, keder dokunursa... Allah bunları onun günahlarına keffaret kılar.' (Buhari)" },
    { id: 32, r1: "Ayet: 'Birbirinizin kusurunu ve mahremiyetini araştırmayın.' (Hucurat, 12)", r2: "Hadis: 'Kim bir Müslümanın ayıbını araştırırsa, Allah da onun ayıbını araştırır.' (Tirmizi)" },
    { id: 33, r1: "Ayet: 'Zinaya yaklaşmayın. Çünkü o, son derece çirkin bir iştir.' (İsra, 32)", r2: "Hadis: 'Hiçbir erkek, yabancı bir kadınla baş başa kalmasın; aksi takdirde üçüncüleri şeytan olur.' (Tirmizi)" },
    { id: 34, r1: "Ayet: 'Faiz yiyenler, ancak şeytanın çarptığı kimsenin kalktığı gibi kalkarlar.' (Bakara, 275)", r2: "Hadis: 'Allah, faizi yiyene, yedirene, şahidlerine ve katibine lanet etsin.' (Müslim)" },
    { id: 35, r1: "Ayet: 'Mallarınızı aranızda haksızlıkla ve yalan yollarla yemeyin.' (Nisa, 29)", r2: "Hadis: 'Zulüm, kıyamet gününde zifiri karanlıklar olacaktır.' (Müslim)" },
    { id: 36, r1: "Ayet: 'Ey iman edenler! Şarap, kumar, dikili taşlar, şans okları şeytan işi birer pisliktir.' (Maide, 90)", r2: "Hadis: 'Sarhoşluk veren her şey şaraptır ve her sarhoşluk veren haramdır.' (Müslim)" },
    { id: 37, r1: "Ayet: 'Sana şarap ve kumar hakkında soru sorarlar. De ki: Her ikisinde de büyük bir günah vardır.' (Bakara, 219)", r2: "Hadis: 'Kim arkadaşına, Gel seninle kumar oynayalım derse sadaka versin.' (Buhari)" },
    { id: 38, r1: "Ayet: 'Kendi ellerinizle kendinizi tehlikeye atmayın.' (Bakara, 195)", r2: "Hadis: 'İslam'da zarar vermek ve zarara zararla karşılık vermek yoktur.' (İbn Mace)" },
    { id: 39, r1: "Ayet: 'Allah'ın yarattığını değiştirmemelerini emredeceğim.' (Nisa, 119)", r2: "Hadis: 'Allah, estetik amaçlı müdahale edip (dövme vs.) yaratılışını değiştirenleri lanetlemiştir.' (Buhari)" },
    { id: 40, r1: "Hadis: 'Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır.' (Tirmizi)", r2: "Ayet: 'Onlarla (eşlerinizle) iyi geçinin.' (Nisa, 19)" },
    { id: 41, r1: "Hadis: 'Merhamet etmeyene merhamet edilmez.' (Buhari)", r2: "Ayet: 'Ey iman edenler! Kendinizi ve ailenizi yakıtı insanlar ve taşlar olan ateşten koruyun.' (Tahrim, 6)" },
    { id: 42, r1: "Hadis: 'Mümin, lanet okuyan, çirkin işler yapan ve edepsiz konuşan kimse değildir.' (Tirmizi)", r2: "Ayet: 'Kullarıma söyle, sözün en güzelini söylesinler.' (İsra, 53)" },
    { id: 43, r1: "Ayet: 'Ey iman edenler! Bir topluluk diğer bir toplulukla alay etmesin.' (Hucurat, 11)", r2: "Hadis: 'Kim bir din kardeşini bir günahı yüzünden ayıplarsa, o günahı işlemeden ölmez.' (Tirmizi)" },
    { id: 44, r1: "Ayet: 'Birbirinize kötü lakaplar takmayın.' (Hucurat, 11)", r2: "Hadis: 'Müslüman, Müslümanın kardeşidir. Ona zulmetmez, onu tahkir etmez (küçük görmez).' (Müslim)" },
    { id: 45, r1: "Hadis: 'Pazartesi ve Perşembe günleri ameller sunulur. Birbiriyle dargın olan iki kişi hariç herkes affedilir.' (Müslim)", r2: "Ayet: 'Kim affeder ve barışı sağlarsa, onun mükafatı Allah'a aittir.' (Şura, 40)" },
    { id: 46, r1: "Ayet: 'Eğer şükrederseniz, size olan nimetimi mutlaka artırırım.' (İbrahim, 7)", r2: "Hadis: 'İnsanlara teşekkür etmeyen, Allah'a da şükretmez.' (Tirmizi)" },
    { id: 47, r1: "Ayet: 'Allah'ın verdiklerinde cimrilik edenler, bunun kendileri için hayırlı olduğunu sanmasınlar.' (Âl-i İmran, 180)", r2: "Hadis: 'Cimrilik ile iman bir kulun kalbinde asla bir arada bulunmaz.' (Nesai)" },
    { id: 48, r1: "Ayet: 'Eğer Allah sana bir zarar dokundurursa, onu yine O’ndan başka giderecek yoktur.' (En'am, 17)", r2: "Hadis: 'Hastalandığım zaman bana şifa veren O'dur.' (Şuara, 80)" },
    { id: 49, r1: "Ayet: 'Yeryüzünde yürüyen her canlının rızkı, yalnızca Allah'ın üzerinedir.' (Hud, 6)", r2: "Hadis: 'Eğer siz Allah'a hakkıyla tevekkül etseydiniz, kuşları rızıklandırdığı gibi sizi de rızıklandırırdı.' (Tirmizi)" },
    { id: 50, r1: "Ayet: 'Sana gelen her iyilik Allah'tandır, sana gelen her kötülük de kendindendir.' (Nisa, 79)", r2: "Hadis: 'Bilin ki, bütün ümmet toplanıp sana fayda vermek istese, Allah'ın yazdığından başkasını veremez.' (Tirmizi)" },
    { id: 51, r1: "Ayet: 'Vay haline o eksik ölçüp tartanların!' (Mutaffifîn, 1)", r2: "Hadis: 'Bizi aldatan bizden değildir.' (Müslim)" },
    { id: 52, r1: "Ayet: 'Ölçüyü ve tartıyı adaletle tam yapın.' (En'am, 152)", r2: "Hadis: 'Müslüman Müslümanın kardeşidir. Ona kusurlu bir malı, kusurunu açıklamadan satması helal olmaz.' (İbn Mace)" },
    { id: 53, r1: "Ayet: 'Ey iman edenler! Akitlerinizi yerine getirin.' (Maide, 1)", r2: "Hadis: 'Zenginin borcunu ertelemesi bir zulümdür.' (Buhari)" },
    { id: 54, r1: "Ayet: 'Allah size, emanetleri mutlaka ehline vermenizi emreder.' (Nisa, 58)", r2: "Hadis: 'Kimin boynunda kardeşinin bir hakkı varsa... altın ve gümüşün geçmeyeceği o gün gelmeden helalleşsin.' (Buhari)" },
    { id: 55, r1: "Ayet: 'Hakkında bilgin olmayan şeyin ardına düşme!' (İsra, 36)", r2: "Hadis: 'Her duyduğunu söylemesi kişiye günah olarak yeter.' (Müslim)" },
    { id: 56, r1: "Ayet: 'İnsan için kendi çalışmasından başka bir şey yoktur.' (Necm, 39)", r2: "Hadis: 'Kişinin yediği en hayırlı yemek, kendi el emeğiyle kazandığıdır.' (Buhari)" },
    { id: 57, r1: "Hadis: 'Allah, sadece kendi rızası gözetilerek yapılan amellerden başkasını kabul etmez.' (Nesai)", r2: "Ayet: 'Mallarını insanlara gösteriş için harcayanları (Allah sevmez).' (Nisa, 38)" },
    { id: 58, r1: "Hadis: 'İnsanlara eziyet veren bir şeyi yoldan kaldırmak sadakadır.' (Buhari)", r2: "Ayet: 'Müminlere haksız yere eziyet edenler, açık bir günah yüklenmişlerdir.' (Ahzab, 58)" },
    { id: 59, r1: "Hadis: 'Bu dilsiz hayvanlar hakkında Allah'tan korkun.' (Ebu Davud)", r2: "Hadis: 'Kim bir canlıya haksız yere eziyet ederse kıyamet günü ondan kısas alınır.' (Buhari)" },
    { id: 60, r1: "Ayet: 'Yakın komşuya, uzak komşuya iyilik edin.' (Nisa, 36)", r2: "Hadis: 'Vallahi iman etmiş olmaz! Kim? Komşusu onun şerrinden emin olmayan kimse.' (Buhari)" }
  ];

  const takva = [
    { id: 5, r1: "Ayet: 'Gecenin bir kısmında uyanıp sana mahsus bir nafile olmak üzere teheccüd kıl.' (İsra, 79)", r2: "Hadis: 'Farzlardan sonra en faziletli namaz teheccüd namazıdır.' (Müslim)" },
    { id: 6, r1: "Ayet: 'Sadakaları gizleyerek fakirlere verirseniz bu sizin için daha hayırlıdır.' (Bakara, 271)", r2: "Hadis: 'Sağ elinin verdiğini sol eli bilmeyecek kadar gizli sadaka veren kimse, kıyamet günü arşın gölgesindedir.' (Buhari)" },
    { id: 7, r1: "Ayet: 'Biz Kur'an'ı, mü'minlere şifa ve rahmet olarak indiriyoruz.' (İsra, 82)", r2: "Hadis: 'Kur'an okuyan mümin, kokusu ve tadı güzel olan turunç gibidir.' (Buhari)" },
    { id: 8, r1: "Ayet: 'Beni anın ki ben de sizi anayım.' (Bakara, 152)", r2: "Hadis: 'Rabbini zikredenle etmeyenin farkı, diriyle ölünün farkı gibidir.' (Buhari)" },
    { id: 9, r1: "Hadis: 'Kardeşine gülümsemen sadakadır.' (Tirmizi)", r2: "Hadis: 'Aranızda selamı yayın ki birbirinizi sevesiniz.' (Müslim)" },
    { id: 10, r1: "Hadis: 'Şüpheli şeyleri terk eden kimse, dinini ve namusunu korumuş olur.' (Buhari)", r2: "Ayet: 'Aranızda günah ve düşmanlıkta yardımlaşmayın.' (Maide, 2)" },
    { id: 11, r1: "Hadis: 'Haklı olduğu halde tartışmayı terk edene cennetin kenarında bir köşk verileceğine kefilim.' (Ebu Davud)", r2: "Ayet: 'Rahmân'ın has kulları... cahiller kendilerine laf attığında Selam der geçerler.' (Furkan, 63)" },
    { id: 12, r1: "Hadis: 'Kim kuşluk namazını kılmaya devam ederse, günahları deniz köpüğü kadar da olsa bağışlanır.' (Tirmizi)", r2: "Hadis: 'Her birinizin her bir eklemi için her gün bir sadaka gerekir... İki rekat kuşluk namazı bunların yerini tutar.' (Müslim)" },
    { id: 13, r1: "Hadis: 'Akşam namazından sonra konuşmadan kılınan altı rekat namaz on iki yıllık ibadete denktir.' (Tirmizi)", r2: "Ayet: 'Onların yanları (gece namazı kılmak için) yataklarından uzaklaşır.' (Secde, 16)" },
    { id: 14, r1: "Hadis: 'Abdestli olarak yatan kimse, o gece sabaha kadar ibadet etmiş gibi sevap kazanır.' (İbn Hibban)", r2: "Ayet: 'Allah çokça tövbe edenleri ve çokça temizlenenleri sever.' (Bakara, 222)" },
    { id: 15, r1: "Hadis: 'Biriniz yediği zaman sağ eliyle yesin, içtiği zaman sağ eliyle içsin.' (Müslim)", r2: "Hadis: 'Besmelesiz başlanan her önemli iş güdüktür (bereketsizdir).' (Ahmed b. Hanbel)" },
    { id: 16, r1: "Hadis: 'Kim sabah namazını cemaatle kılarsa, bütün gece namaz kılmış gibi olur.' (Müslim)", r2: "Ayet: 'Oturdukları yerlerde sabah akşam Allah'ın rızasını dileyerek Rabbine dua edenlerle beraber sabret.' (Kehf, 28)" },
    { id: 17, r1: "Hadis: 'Cemaatle kılınan namaz, tek başına kılınan namazdan yirmi yedi derece daha üstündür.' (Buhari)", r2: "Ayet: 'Namazı dosdoğru kılın, zekatı verin, rükû edenlerle birlikte rükû edin.' (Bakara, 43)" },
    { id: 18, r1: "Hadis: 'Kim iki serinlik (sabah ve ikindi) namazını kılarsa cennete girer.' (Buhari)", r2: "Ayet: 'Gündüzün her iki tarafında ve gecenin saçaklarında namaz kıl.' (Hud, 114)" },
    { id: 19, r1: "Hadis: 'Mescide devam etmeyi adet edinen kişinin gerçek mümin olduğuna şahitlik edin.' (Tirmizi)", r2: "Ayet: 'Allah'ın mescitlerini ancak Allah'a ve ahiret gününe iman edenler imar eder.' (Tevbe, 18)" },
    { id: 20, r1: "Hadis: 'Kim yatsı namazını cemaatle kılarsa gecenin yarısını ibadetle geçirmiş gibi olur.' (Müslim)", r2: "Ayet: 'Yüzlerinizi mescid tarafına çevirin.' (Bakara, 144)" },
    { id: 21, r1: "Hadis: 'Rızkının çoğalmasını ve ömrünün uzamasını isteyen kimse akrabasını gözetsin.' (Buhari)", r2: "Ayet: 'Şüphesiz Allah, adaleti, iyilik yapmayı, yakınlara yardım etmeyi emreder.' (Nahl, 90)" },
    { id: 22, r1: "Hadis: 'Abdest üzerine abdest, nur üzerine nurdur.' (İhya)", r2: "Hadis: 'Temizlik imanın yarısıdır.' (Müslim)" },
    { id: 23, r1: "Hadis: 'Allah rızası için bir gün oruç tutan kimsenin yüzünü, Allah o günün hürmetine cehennemden yetmiş yıl uzaklaştırır.' (Buhari)", r2: "Hadis: 'Oruç bir kalkandır.' (Buhari)" },
    { id: 24, r1: "Hadis: 'Bir topluluk Allah'ın evlerinden birinde toplanıp O'nun kitabını okur ve aralarında müzakere ederlerse, üzerlerine huzur iner.' (Müslim)", r2: "Hadis: 'Kim ilim öğrenmek için yola çıkarsa, Allah ona cennet yolunu kolaylaştırır.' (Tirmizi)" },
    { id: 25, r1: "Hadis: 'Hikmet (faydalı bilgi) müminin yitik malıdır; onu nerede bulursa alır.' (Tirmizi)", r2: "Ayet: 'De ki: Hiç bilenlerle bilmeyenler bir olur mu?' (Zümer, 9)" },
    { id: 26, r1: "Hadis: 'Melekler, ilim talebesinin yaptığı işten hoşlandıkları için ona kanatlarını gererler.' (Ebu Davud)", r2: "Ayet: 'Kulları içinden ancak âlimler, Allah'tan (gereğince) korkar.' (Fatır, 28)" },
    { id: 27, r1: "Hadis: 'Bir kimsenin evinin (veya özelinin) içine izinsiz bakmak helal değildir.' (Tirmizi)", r2: "Ayet: 'Müminlere söyle gözlerini haramdan sakınsınlar.' (Nur, 30)" },
    { id: 28, r1: "Hadis: 'Kim din kardeşinin onurunu savunursa, Allah da kıyamet günü onun yüzünü cehennemden korur.' (Tirmizi)", r2: "Ayet: 'Ey iman edenler! Adaleti titizlikle ayakta tutan, kendiniz aleyhine bile olsa Allah için şahitlik eden kimseler olun.' (Nisa, 135)" },
    { id: 29, r1: "Hadis: 'Bir saat tefekkür, bir yıl (nafile) ibadetten daha hayırlıdır.' (Camiu's-Sağir)", r2: "Ayet: 'Onlar göklerin ve yerin yaratılışı üzerinde düşünürler.' (Âl-i İmran, 191)" }
  ];

  for (const c of ana) {
    await turso.execute({
      sql: "UPDATE cards SET reflection_1 = ?, reflection_2 = ? WHERE id = ?",
      args: [c.r1, c.r2, c.id]
    });
  }

  for (const c of takva) {
    await turso.execute({
      sql: "UPDATE takva_cards SET reflection_1 = ?, reflection_2 = ? WHERE id = ?",
      args: [c.r1, c.r2, c.id]
    });
  }

  console.log("Master update tamamlandı: 77 karta toplam 154 tamamen BENZERSİZ tefekkür atandı.");
}

run().catch(console.error);
