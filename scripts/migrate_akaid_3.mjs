import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const cards = [
    {
      statement: "Ben Kur'an'ın ahlakla ve ibadetle ilgili ayetlerini kabul ediyorum ama miras, ceza hukuku veya tesettür gibi konulardaki ayetlerini günümüze uygun bulmuyor ve reddediyorum.",
      is_true: 0,
      explanation: "Kur'an-ı Kerim'in tek bir ayetini, hatta tek bir harfini bile reddetmek kişiyi İslam'dan çıkarır. İman bir bütündür, parçalara ayrılamaz.",
      proof: "Ayet: Yoksa siz Kitab'ın bir kısmına inanıp bir kısmını inkar mı ediyorsunuz? (Bakara, 85)"
    },
    {
      statement: "Ben sadece Hz. Muhammed'in peygamberliğine inanıyorum; Hristiyanların İsa'sı veya Yahudilerin Musa'sı beni ilgilendirmez, onları peygamber olarak kabul etmiyorum.",
      is_true: 0,
      explanation: "Müslümanlar, Allah'ın gönderdiği tüm peygamberlere hiçbir ayrım yapmadan inanmak zorundadır. Birini reddetmek, tümünü reddetmek gibidir.",
      proof: "Ayet: Peygamber ve müminler... 'Allah'ın peygamberleri arasında hiçbir ayrım yapmayız' dediler. (Bakara, 285)"
    },
    {
      statement: "Melekler de insanlar gibi yiyip içen, evlenen ve iradeleriyle bazen Allah'a isyan edebilen nurani varlıklardır.",
      is_true: 0,
      explanation: "Melekler nurdan yaratılmıştır. Yemezler, içmezler, cinsiyetleri yoktur ve nefisleri olmadığı için Allah'a asla isyan etmezler.",
      proof: "Ayet: Onlar, Allah'ın kendilerine verdiği emirlere isyan etmezler ve kendilerine ne emredilmişse onu yaparlar. (Tahrîm, 6)"
    },
    {
      statement: "Melekler fiziksel ve gerçek varlıklar değildir. Onlar sadece insanın içindeki 'iyilik dürtüsü'nün veya evrendeki 'doğa kanunları'nın mecazi (sembolik) ismidir.",
      is_true: 0,
      explanation: "Melekler sembolik fikirler değil, Allah'ın yarattığı hakiki, şuurlu varlıklardır. Onları inkar eden veya mecazi sayan iman etmiş sayılmaz.",
      proof: "Ayet: Kim Allah'ı, meleklerini, kitaplarını, peygamberlerini ve ahiret gününü inkar ederse, şüphesiz derin bir sapıklığa düşmüştür. (Nisa, 136)"
    },
    {
      statement: "Kader, sadece insanların kendi yaptıklarıdır. Allah insanların ne yapacağını önceden yazmamıştır, olaylar gerçekleştikçe haberdar olur.",
      is_true: 0,
      explanation: "Kader, Allah'ın ezelden ebede kadar olacak her şeyi sonsuz ilmiyle bilmesi ve yazmasıdır. Olan her şey O'nun bilgisi ve takdiri iledir.",
      proof: "Ayet: Yeryüzünde ve kendi nefislerinizde uğradığınız hiçbir musibet yoktur ki, biz onu yaratmadan önce bir kitapta yazılmış olmasın. (Hadid, 22)"
    },
    {
      statement: "Bana isabet eden iyilikler ve başarılar Allah'tandır; ancak başıma gelen musibetler veya kötülükler Allah'tan değil, kendi yarattığım şanssızlıktır.",
      is_true: 0,
      explanation: "İman esaslarından biri 'Hayrın ve şerrin Allah'tan geldiğine' inanmaktır. Şerri yaratan da Allah'tır, ancak insan cüzi iradesiyle seçtiği için mesuldür.",
      proof: "Ayet: Eğer onlara bir iyilik dokunursa 'Bu Allah'tandır' derler. Bir kötülük dokunursa 'Bu sendendir' derler. De ki: 'Hepsi Allah'tandır!' (Nisa, 78)"
    },
    {
      statement: "Hz. Muhammed (sav) en büyük peygamberdir, ancak ondan sonra da kıyamete kadar insanları uyarmak için yeni peygamberler gelebilir.",
      is_true: 0,
      explanation: "Hz. Muhammed (sav) 'Hâtemü'n-Nebiyyîn'dir, yani son peygamberdir. Ondan sonra hiçbir şekilde yeni bir peygamber gelmeyecektir.",
      proof: "Ayet: Muhammed... Allah'ın Resulü ve peygamberlerin sonuncusudur. (Ahzab, 40)"
    },
    {
      statement: "İncil ve Tevrat günümüze kadar ilk indirildikleri orijinalliğiyle bozulmadan gelmiştir, onlar da hala geçerli ve kurtuluşa götüren hak kitaplardır.",
      is_true: 0,
      explanation: "Kur'an dışındaki kutsal kitaplar insanlar tarafından tahrif edilmiş (bozulmuş)tir. Kur'an'ın inmesiyle önceki şeriatların hükmü kalkmıştır.",
      proof: "Ayet: Onlardan bir grup, Kitab'ı işitip anladıktan sonra onu bile bile tahrif ediyorlardı. (Bakara, 75)"
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

  console.log("Akaid Taslak 3 database'e eklendi.");
}

migrate().catch(console.error);
