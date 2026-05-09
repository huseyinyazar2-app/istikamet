# Skill: Kod Modifikasyon ve Token Tasarruf Protokolü

## Amaç
Dosyaların tamamını yeniden yazmak yerine sadece gerekli kısımları değiştirerek token tasarrufu sağlamak, bağlam (context) bütünlüğünü korumak ve mekanik stabiliteyi artırmak.

## Tetikleyiciler (Triggers)
- Bir hata düzeltilmesi istendiğinde.
- Mevcut bir fonksiyona yeni bir özellik eklendiğinde.
- Kod refaktör (düzenleme) taleplerinde.

## Uygulama Kuralları

### 1. "Sadece Değişen Satırlar" Prensibi
- Bir dosyada değişiklik yaparken asla tüm dosyayı baştan oluşturma.
- Sadece değişen fonksiyonu veya satır aralığını çıktı olarak ver.
- Eğer mümkünse "diff" formatını veya "arama-değiştir" (search and replace) bloklarını kullan.

### 2. Mekanik Stabilite ve Minimalizm
- Kodda gereksiz hareketli parça (gereksiz değişkenler, karmaşık iç içe döngüler) bırakma.
- Tasarımı her zaman fonksiyonel ve minimalist tut.
- Bir özellik eklerken mevcut stabil yapıyı bozacak köklü mimari değişikliklerden kaçın, en sade çözümü uygula.

### 3. Token Optimizasyonu
- Çıktı üretirken açıklama kısımlarını kısa tut. 
- "Dosyanın geri kalanı aynı kalıyor..." gibi belirteçler kullanarak sadece ilgili bloğu göster.
- Gereksiz yorum satırları ekleyerek bağlam penceresini (context window) şişirme.

### 4. Bağımlılık Kontrolü
- Yeni bir paket eklemeden önce mevcut kütüphanelerle çözüm üretilip üretilemeyeceğini kontrol et.
- Import listesini sadece yeni bir bağımlılık gerekiyorsa güncelle.

## Çıktı Formatı
Kullanıcı aksini belirtmedikçe kodu şu şekilde sun:
// ... (mevcut kod)
[DEĞİŞTİRİLEN VEYA EKLENEN KOD BLOĞU]
// ... (mevcut kodun devamı)