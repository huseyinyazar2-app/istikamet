# PROJE ADI: İstikamet (Nefis Muhasebesi ve Dijital Ayna)
**Sürüm:** MVP (Minimum Viable Product) 1.0
**Platform:** PWA (Progressive Web App) / Mobil Uyumlu Web App

## 1. PROJE VİZYONU VE TEMEL FELSEFE (Yapay Zeka İçin Kritik Notlar)
Bu sıradan bir alışkanlık takip (habit tracker) veya puanlı oyunlaştırma uygulaması DEĞİLDİR. Bu bir "Dijital Ayna"dır. 
* **Yargılamaz:** Kullanıcıya "Şu kadar puan aldın, cehennemliksin" demez. Sadece günün yönünü (vektörünü) gösterir.
* **Gizlilik Odaklıdır (Privacy-First):** Kesinlikle merkezi bir veritabanı (Cloud/SQL) kullanılmayacaktır. Kullanıcının mahrem günahları ASLA kalıcı olarak saklanmaz.
* **Stateless Tövbe Mantığı:** Gece muhasebesi bitip "Günü Sıfırla" butonuna basıldığında, o günkü tüm spesifik cevaplar (yalan söyledim, zina yaptım vb.) `LocalStorage` üzerinden "Hard Delete" ile silinir. Geriye sadece o günün "Genel Eğimi/Rengi" kalır.

## 2. TEKNİK MİMARİ VE GEREKSİNİMLER
* **Frontend:** React.js, Vue.js veya Next.js (Minimalist ve akıcı UI için).
* **State Management:** Zustand veya Context API.
* **Veritabanı:** Tarayıcı tabanlı `LocalStorage` veya `IndexedDB`. Backend/API (Node.js vb.) YOKTUR.Gerekirse sonra eklenecek. 
* **Animasyonlar:** Framer Motion (Özellikle Swipe/Kaydırma kartları ve ekran geçişleri için akıcı hissettirmeli).

## 3. KULLANICI DENEYİMİ (UX) VE AKIŞLAR

### 3.1. Onboarding (Karşılama) Ekranları
Uygulama ilk açıldığında 3 kaydırmalı ekran gelir:
1. **"Burası Bir Mahkeme Değil, Bir Ayna."** (Açıklama: Kusursuzluk beklemiyoruz, istikamet arıyoruz. Verilerin sadece cihazında kalır.)
2. **"Görünmez Virüsleri Tespit Et."** (Açıklama: Kibir, riya, haset gibi kalbi hastalıkları senaryolarla fark et.)
3. **"Günde 2 Dakikalık Yüzleşme."** (Buton: Rumuzunu Belirle ve Başla). *Not: Email veya şifre istenmez.*

### 3.2. Ana Ekran (Dashboard)
* **Tasarım:** Sıkıcı menüler yok. Saate göre renk değiştiren ferah, minimalist bir arka plan (gece lacivert, gündüz aydınlık).
* **Ana Buton:** Ekranın ortasında nefes alma efektiyle büyüyüp küçülen "Muhasebeye Başla" butonu.
* **Arka Plan Grafiği:** Ayın ısı haritası (heatmap) veya ufuk çizgisi silik bir şekilde görünür.
* **Bottom Nav (Alt Menü):** Pusula (Ana Ekran) | Rehber | Arınma | Ayarlar.

### 3.3. Muhasebe Akışı (Swipe Kart Sistemi)
* "Başla" butonuna basınca %20 ihtimalle araya **"Günün Tefekkürü"** ekranı girer. (Örn: Kısa bir Mevlana veya İbnü'l-Arabi sözü). 3 saniye sonra kartlara geçer.
* **Kart Mantığı:** Tinder benzeri sağa/sola kaydırmalı veya "Evet/Hayır" butonlu tekli kartlar.
* **Dinamik Havuz Oluşturma Algoritması:** Her gece sistem kullanıcıya ortalama 10-15 kart sunar.
  * *Sabitler:* 5 vakit namaz, haram lokma vb. her gün gelir.
  * *Rastgeleler (Randomizer):* Kalp hastalıkları (kibir, haset vb.) veritabanındaki 50 farklı senaryodan rastgele 3-4 tane seçilerek getirilir. 
  * *Özel Havuz:* Kullanıcının ayarlardan eklediği kişisel hedefler.
* **Değişken Geri Bildirim (Variable Reward):** Kullanıcı bir karta cevap verdiğinde, her zaman olmamak şartıyla (%15 ihtimal), o soruyla ilgili sarsıcı bir tefekkür cümlesi (toast message/popup) ekranda belirir.

### 3.4. Kapanış Ekranı (İstikamet Raporu)
* **Görsel:** Ekranda puan YOKTUR. Ortada bir "Ufuk Çizgisi" vardır. Gün kötü geçmişse çizgi aşağı eğimli ve arka plan karanlık pusludur. İyi geçmişse çizgi yukarı doğru ve ferah bir renktedir.
* **Metin:** Algoritma günün ağırlığına göre yapay zeka tarzı şefkatli ama uyarıcı tek bir cümle basar. (Örn: "Kalbindeki haset bugün rotanı bulandırdı, temizlenme vakti.")
* **Wipe Data (Tövbe) Butonu:** Ekranın altında "Günü Temizle ve Sıfırla" butonu bulunur. Kullanıcı buna 3 saniye basılı tutar. 
* **Tetiklenen Fonksiyon:** Butona basılınca animasyonla ekran aydınlanır. Kod tarafında, o günkü kartlara verilen spesifik cevaplar `LocalStorage`'dan silinir. Sadece vektör değeri (Örn: -0.5 veya #8B0000 renk kodu) takvime kaydedilir.

## 4. VERİ YAPISI VE KATEGORİZASYON (JSON / Object Modeli)
Kartlar sistemde şu ağırlık ve kategorilere göre ayrılmalıdır:

* **Kat 1: Ana Kolonlar (Ağır Etki):** 5 vakit namaz, zina, faiz, haram lokma. (Vektörü çok sert etkiler).
* **Kat 2: Sosyal Hasar (Kul Hakkı):** Gıybet, iftira, kalp kırma. (Helallik alma uyarısı tetikler).
* **Kat 3: İşletim Sistemi Virüsleri (Kalp Hastalıkları):** Kibir, Riya, Haset. (Senaryolaştırılmış sorular. Örn: "Kibirli miydin?" değil -> "Bugün birini içinden küçümsedin mi?"). Vektörü içten çürütür.
* **Kat 4: Sızıntılar:** Göz zinası, kaba söz, boş vakit harcama.
* **Takva/İhsan Modu (Opsiyonel):** Ayarlardan açılır. Teheccüd, sadaka, öfke kontrolü gibi ekstra hassasiyet kartları içerir.

## 5. ALT MENÜ İÇERİKLERİ
* **Rehber:** Fıkıh kitabı değildir. Hastalıkların (Kibir, Riya) neden tehlikeli olduğunu anlatan kısa "Ayet/Hadis" ve psikolojik açıklama kütüphanesi.
* **Arınma:** Hatalara özel spesifik reçeteler. (Örn: Gıybet mi yaptın? -> Okunacak zikir ve atılacak adım rehberi).
* **Ayarlar:** Rumuz değişimi, Tema (Aydınlık/Karanlık), "Takva Modu" şalteri, "Kendi Özel Kartını Ekle" alanı ve "Tüm Geçmişimi Sil (Factory Reset)" butonu.

## 6. UI/UX TASARIM DİLİ
* **Renk Paleti:** Yumuşak, dingin ve spiritüel. Pastel tonlar, koyu lacivertler, sakinleştirici yeşiller. Asla parlak, neon, oyun tarzı cırtlak renkler (kırmızı hatalar vb.) kullanılmayacak.
* **Tipografi:** Okunabilirliği yüksek, zarif, modern sans-serif fontlar (Örn: Inter, Roboto, veya daha karakteristik bir serif font manşetler için).
* **Vibe:** Kullanıcı uygulamayı açtığında kendini bir meditasyon veya sessiz bir kütüphane ortamında gibi hissetmeli.

7- Veritabanı olarak turso kullanılacak. yukarıda veritabanı yok derken kullanıcı verileri için yok, program verileri için veritabanına ihtiyaç var, o yüzden tursoDB kullanılacak. Gereksinimler sen çalışma planı hazırladığında sana verilecek. 

8- Kartların ne olacağı neler yazacağı, ayetler, hadisler, tefekkür cümleleri vs herşey veritabanında kayıtlı olacak ve oradan gösterilecek. 

