# Skill: Güvenlik ve Zafiyet Kalkanı (Security Audit Protocol)

## Amaç
Uygulama genelinde veri sızıntılarını, yetkisiz erişimleri ve yaygın siber güvenlik açıklarını (OWASP) kod yazım aşamasında engellemek.

## Tetikleyiciler (Triggers)
- Kullanıcıdan veri alınan formlar veya inputlar yazıldığında.
- Veritabanına (Turso/SQLite vb.) kayıt ekleme/güncelleme/silme sorguları oluşturulduğunda.
- Kimlik doğrulama (Auth, Magic Link vb.) ve oturum yönetimi kodlandığında.

## Uygulama Kuralları

### 1. Veri Temizleme (Sanitization) ve Enjeksiyon Koruması
- Kullanıcıdan gelen hiçbir veriyi doğrudan veritabanı sorgusuna sokma. Her zaman parametrik sorgular (prepared statements) kullan. SQL Injection riskini sıfıra indir.
- XSS (Cross-Site Scripting) saldırılarını önlemek için HTML içinde render edilen kullanıcı girdilerini mutlaka encode et/temizle.

### 2. Sırların Korunması (No Hardcoded Secrets)
- API anahtarlarını, veritabanı URL'lerini veya JWT secret'larını ASLA kodun içine düz metin olarak yazma.
- Bu tür değişkenleri her zaman `.env` dosyasından çağır (`process.env.VAR_NAME`).

### 3. Kimlik Doğrulama Güvenliği
- Magic Link veya token tabanlı sistemler kurarken, token'ların mutlaka bir son kullanma süresi (expiration) olmasını sağla.
- Hassas rotalara (route) erişmeden önce kullanıcının yetkisini (authorization) kontrol eden ara yazılımlar (middleware) kullan.

### 4. Otonom Müdahale
- Eğer ajan olarak yukarıdaki kuralları ihlal eden bir kod yazarsan veya kullanıcıdan riskli bir kod talebi gelirse, işlemi DURDUR. Gerekçeyi açıkla ve güvenli alternatifi yaz.