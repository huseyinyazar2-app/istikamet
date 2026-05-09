'use client';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import BottomNav from '@/components/BottomNav';
import '@/components/components.css';

export default function Hakkinda() {
  const { settings } = useStore();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: settings.nickname || 'Anonim', message: message.trim() })
      });
      if (res.ok) {
        alert("Mesajın başarıyla iletildi. Teşekkür ederiz!");
        setMessage('');
      } else {
        alert("Mesaj gönderilemedi.");
      }
    } catch (e) {
      alert("Bağlantı hatası.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container" style={{ paddingBottom: '100px', paddingTop: '40px' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Hakkında</h1>
        
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}>İstikamet Nedir?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
            İstikamet, modern dünyanın karmaşasında kaybolan kalpleri yeniden fıtrat çizgisine çekmek için tasarlanmış <b>dijital bir aynadır.</b> Ehli Sünnet (Ayet, Hadis ve Fıkıh) kaynaklarına dayalı olarak hazırlanan içerikleriyle, kullanıcının gün sonunda kendi kendine <i>Nefis Muhasebesi</i> yapmasını sağlar.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Hiçbir kişisel veri toplanmaz, cevaplar sunucuya gitmez (Tövbe edince cihazdan da silinir). Sistem tamamen şeffaf, gizli ve kişisel takvanızı güçlendirmeye yöneliktir.
          </p>
        </div>

        <div className="card">
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Görüş ve Önerileriniz</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Eksik gördüğün yerler, eklenmesini istediğin özellikler veya tespit ettiğin hatalar varsa lütfen bizimle paylaş. (Mesajlar isimsiz/rumuz ile iletilir).
          </p>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajını buraya yaz..."
            style={{
              width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-primary)',
              color: 'white', fontSize: '15px', marginBottom: '16px', resize: 'vertical'
            }}
          />
          <button 
            className="button button-primary" 
            onClick={handleSubmit} 
            disabled={!message.trim() || isSubmitting}
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
