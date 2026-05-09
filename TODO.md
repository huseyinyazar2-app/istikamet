# İstikamet - Proje Geliştirme Planı ve TODO

## Faz 1: Proje Kurulumu ve Altyapı Hazırlıkları
- [x] Vercel ve Github uyumlu Next.js projesi oluşturulması (Tailwind KULLANILMAYACAK, Vanilla CSS kullanılacak).
- [x] PWA (Progressive Web App) yapılandırmasının yapılması (`manifest.json`, `service-worker.js`, ikonlar).
- [x] Tema ve Renk Paletinin ayarlanması (İslami esintili ama modern, pastel tonlar, lacivert, ferah yeşiller).
- [x] Turso DB bağlantı altyapısının kurulması (`@libsql/client` kurulumu).

## Faz 2: Veritabanı ve API Entegrasyonu (Turso)
- [x] Turso veritabanı şemasının tasarlanması (Kartlar, Kategoriler, Ayet/Hadis, Tefekkürler).
- [x] Başlangıç verilerinin (seed) Turso veritabanına eklenmesi.
- [x] Next.js API route'larının (`/api/cards` vb.) oluşturulup Turso'dan verilerin çekilmesi.

## Faz 3: State Management ve Lokal Veri Yönetimi
- [x] Zustand ile uygulamanın State yönetimi altyapısının kurulması.
- [x] LocalStorage entegrasyonu (Kullanıcının cevaplarının gizliliği ve güvenli yönetimi).
- [x] "Takva Modu", rumuz vb. ayarların State içerisinde tanımlanması.

## Faz 4: Karşılama ve Ana Ekran (UI/UX)
- [x] Onboarding (Karşılama) ekranlarının tasarlanması (Framer Motion ile akıcı ekranlar).
- [x] Dashboard (Ana Ekran) tasarımı: Ferah arka plan, nefes alma animasyonlu "Muhasebeye Başla" butonu.
- [x] Alt Menü (Bottom Nav) bileşeninin oluşturulması (Pusula, Rehber, Arınma, Ayarlar).

## Faz 5: Çekirdek Özellik - Muhasebe Akışı (Swipe Kart Sistemi)
- [x] Framer Motion kullanılarak kaydırılabilir Kart bileşeninin (Swipe Card) yapılması.
- [x] Günlük kart havuzu oluşturma algoritmasının yazılması (Sabit + Rastgele kalbi hastalıklar + Özel kartlar).
- [x] Kartlara cevap verildikçe belirecek "%15 İhtimalle Tefekkür" (Değişken Geri Bildirim) pop-up'larının eklenmesi.

## Faz 6: Kapanış Ekranı, İstikamet Raporu ve Tövbe Mekanizması
- [x] İstikamet Raporu ekranının tasarlanması (Vektöre göre şekillenen ufuk çizgisi ve tefekkür cümlesi).
- [x] "Günü Temizle ve Sıfırla" (Tövbe) butonunun animasyonu (3 saniye basılı tutma efekti).
- [x] Tövbe algoritması: LocalStorage'dan detaylı cevapların Hard Delete ile silinmesi, sadece günün genel eğilim (vektör) değerinin takvimsel olarak saklanması.

## Faz 7: Rehber, Arınma ve Ayarlar
- [x] "Rehber" sayfası (Hastalıklar ve psikolojik açıklamalar kütüphanesi).
- [x] "Arınma" sayfası (Hatalara özel spesifik reçeteler, çözüm yolları).
- [x] "Ayarlar" sayfası (Rumuz değişimi, Tema seçimi, Takva Modu şalteri, Özel Kart Ekleme, Tüm Verileri Sil/Factory Reset).

## Faz 8: Test, Optimizasyon ve Canlıya Alma
- [x] PWA özellikleri ve LocalStorage süreçlerinin test edilmesi.
- [x] Vanilla CSS yapısı ile UI animasyonlarının akıcılığının (Framer Motion) performans profillemesi (`performance-profiler` skill).
- [x] Hata ayıklama (`optimal-testing` skill) ve Vercel üzerinden tam sürüm yayına alınması.

## Faz 9: Yönetim (Admin) Paneli
- [x] Admin giriş ekranı ve doğrulama (basit şifreli/yetkilendirmeli).
- [x] Kartların, soruların ve kategorilerin yönetileceği CRUD arayüzü.
- [x] Tefekkür, ayet ve hadis içeriklerinin yönetimi.
- [x] Uygulama genel ayarlarının yönetimi (Zamanlama vb.).
