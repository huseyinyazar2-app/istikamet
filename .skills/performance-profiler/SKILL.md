# Skill: Performans ve Karmaşıklık Optimizasyonu (Performance Profiler)

## Amaç
Uygulamanın hızını artırmak, gereksiz işlemci/bellek tüketimini önlemek ve kodun mekanik stabilitesini (minimalist, az hareketli parça) korumak.

## Tetikleyiciler (Triggers)
- Veritabanından liste/koleksiyon çekme işlemleri yazıldığında.
- Arayüzde (Frontend) büyük listeler veya karmaşık state yönetimleri yapıldığında.
- Döngüler (for, while, map) kullanıldığında.

## Uygulama Kuralları

### 1. Veritabanı Optimizasyonu (Anti N+1)
- Veritabanından veri çekerken "N+1 Sorgu Problemi"ne düşme. Döngü içinde veritabanı sorgusu atma; bunun yerine `JOIN` kullanarak veya verileri toplu (batch) çekerek işlemi tek sorguda bitir.
- Sadece ihtiyaç duyulan sütunları çek (`SELECT *` yerine `SELECT id, name`).

### 2. Algoritmik Karmaşıklık (Big O)
- İç içe döngülerden (O(n^2) karmaşıklık) mümkün olduğunca kaçın. Verileri işlerken Hash Map'ler veya daha verimli algoritmalar kullanarak performansı O(n) veya O(1) seviyesinde tutmaya çalış.

### 3. Arayüz (Frontend) Render Optimizasyonu
- Gereksiz re-render işlemlerini engelle. Sadece değişen state'lerin ekrana yansımasını sağlayacak minimal bir yapı kur.
- Uygulamanın bir PWA gibi düşük sürtünmeyle (low-friction) çalışması için, istemciye gönderilen JavaScript bundle boyutunu küçük tut. Ağır ve devasa kütüphaneler eklemek yerine, sistemin kendi (native) yeteneklerini kullan.

### 4. Otonom Revizyon
- Eğer yazılan bir fonksiyon çok fazla iç içe blok içeriyor veya mekanik olarak çok karmaşıksa, onu refaktör et (daha basit alt fonksiyonlara böl).