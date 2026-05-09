# Skill: Tam Otonom Orkestratör ve Hafıza Döngüsü (Auto-Loop)

## Amaç
Kullanıcı müdahalesi olmadan projeyi uçtan uca yönetmek, bağlam penceresi (context window) taşmalarını önlemek, testleri otonom yapmak ve görevleri eksiksiz tamamlamak.

## Çalışma Prensibi: Otonom Döngü (The Loop)
Sisteme bir proje veya büyük bir görev verildiğinde ŞU SIRAYI KESİNTİSİZ İZLE:

### Adım 1: Mikro Planlama ve Hafıza Kaydı (Çok Önemli)
- İşi asla tek bir büyük parça olarak düşünme. Görevi, `TODO.md` dosyasına en küçük, test edilebilir mantıksal adımlara (mikro-görevlere) bölerek yaz.
- Her adımın yanına bir checkbox `[ ]` koy.

### Adım 2: İzolasyon (Bağlamı Korumak İçin)
- `TODO.md` dosyasındaki sadece sıradaki İLK işlenmemiş göreve odaklan.
- Gelecekteki adımları düşünerek hafızayı şişirme. Sadece o anki görevin gerektirdiği dosyaları oku.

### Adım 3: Kusursuz İcra (Anti-Tembellik Kuralı)
- Kodu yazarken 'Kod Modifikasyon Protokolü'ne uy (sadece ilgili kısımları değiştir).
- **KESİN KURAL:** Değiştirdiğin veya yazdığın bir bloğun içinde ASLA `// kodun devamı...`, `// burayı sen tamamla` gibi tembellikler (lazy coding) yapma. İlgili fonksiyonu/bloğu başından sonuna kadar eksiksiz yaz.

### Adım 4: Otonom Doğrulama (Self-Correction)
- Kodu yazdıktan sonra kullanıcıya "Test edeyim mi?" diye SORMA.
- Doğrudan `optimal-testing` yeteneğini tetikle. (Linter -> Unit Test -> Log).
- Eğer hata varsa: Kullanıcıya bilgi VERME. Hata logunu oku, kodu düzelt, testi tekrar çalıştır. Test yeşil (başarılı) olana kadar bu iç döngüde kal.

### Adım 5: İşaretleme ve İlerleme (Kesintisiz Devam)
- Test başarıyla geçtiğinde: `TODO.md` dosyasını aç, tamamlanan görevin yanına `[x]` at.
- Kullanıcıya "Bitti, devam edeyim mi?" diye SORMA.
- Derhal `TODO.md` listesindeki bir sonraki işlenmemiş `[ ]` göreve geç ve Adım 2'den itibaren döngüyü tekrarla.

## Durma Koşulları (Sadece Bu Durumlarda Kullanıcıya Dön)
1. `TODO.md` dosyasındaki tüm görevler `[x]` olduğunda.
2. Üst üste 5 kez aynı hatayı düzeltmeye çalışıp başarısız olduğunda (sonsuz döngüyü kırmak için).
3. Kullanıcının manuel olarak sisteme bir API anahtarı veya şifre girmesi gerektiğinde.