# Skill: Otonom Kalite ve Test Akışı (Optimal Testing Flow)

## Amaç
Kod yazımı sonrası hataları en hızlı, en ucuz (minimum token) ve en güvenilir şekilde doğrulamak.

## Tetikleyiciler (Triggers)
- Yeni bir fonksiyon veya modül eklendiğinde.
- Mevcut kodda mantıksal bir değişiklik yapıldığında.
- Kullanıcı "kontrol et", "test et" veya "hataları bul" dediğinde.

## Test Hiyerarşisi (Sırasıyla Uygula)

### 1. Kademe: Statik Analiz (Hız: Çok Hızlı | Maliyet: 0)
Tarayıcıyı veya test kütüphanelerini çalıştırmadan önce terminalde şunları çalıştır:
- `npm run lint` (veya `eslint .`)
- `npx tsc --noEmit` (TypeScript kullanılıyorsa)
**Kural:** Burada hata varsa düzeltmeden 2. kademeye geçme.

### 2. Kademe: Birim (Unit) Testler (Hız: Hızlı | Maliyet: Düşük)
Sadece etkilenen dosyalar için testleri çalıştır:
- Komut: `npm test -- [dosya_adi]`
**Kural:** Mantıksal hataları burada yakala. Başarısız olursa loglara veya tarayıcıya gitme, kodu onar.

### 3. Kademe: Sunucu ve Log Denetimi (Hız: Orta | Maliyet: Düşük)
Eğer 1. ve 2. kademe temizse ancak özellik çalışmıyorsa:
- Terminalden sunucu loglarını (`tail`, `docker logs` vb.) oku.
- Ağ (Network) veya veritabanı hatalarını tespit et.

### 4. Kademe: Canlı Tarayıcı Kontrolü (Hız: Yavaş | Maliyet: Yüksek)
Yalnızca yukarıdaki adımlar başarılıysa ve görsel/etkileşimli bir doğrulama gerekiyorsa:
- Playwright/Puppeteer/Browser aracını aç.
- **Token Tasarrufu:** Sadece ilgili sayfa bölümüne odaklan, tüm DOM'u okuma. Ekran görüntüsünü sadece hata varsa analiz et.

## Genel Kurallar
- Her aşamada hata bulunursa döngüyü kır, hatayı düzelt ve 1. kademeden tekrar başla.
- Kullanıcı aksini belirtmedikçe doğrudan 4. kademeden başlama.
- Kod modifikasyonu yaparken sadece ilgili satırları değiştir, dosyanın tamamını baştan yazarak token israfı yapma.