'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import BottomNav from '@/components/BottomNav';
import '@/components/components.css';

export default function Ayarlar() {
  const { settings, updateSettings, resetAll } = useStore();
  const [nickname, setNickname] = useState(settings.nickname);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [myTakvaCards, setMyTakvaCards] = useState([]);
  const [newTakva, setNewTakva] = useState({ text: '', categoryName: 'Sevaplar' });

  const fetchMyTakvaCards = async () => {
    if (!settings.nickname) return;
    const res = await fetch(`/api/users/takva?nickname=${settings.nickname}`);
    if (res.ok) {
      const data = await res.json();
      setMyTakvaCards(data.data || []);
    }
  };

  useEffect(() => {
    if (settings.takvaMode) {
      fetchMyTakvaCards();
    }
  }, [settings.takvaMode, settings.nickname]);

  const handleSaveNickname = async () => {
    if (nickname === settings.nickname) {
      alert("Rumuz zaten aynı.");
      return;
    }
    if (nickname.trim()) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: nickname.trim() })
        });
        if (res.ok) {
          updateSettings({ nickname: nickname.trim() });
          alert("Rumuz başarıyla güncellendi.");
        } else {
          const data = await res.json();
          alert(data.error || "Rumuz alınamadı.");
        }
      } catch (e) {
        alert("Bağlantı hatası.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    if (confirm("Tüm geçmişini ve ayarlarını silmek istediğine emin misin? Bu işlem geri alınamaz.")) {
      resetAll();
      alert("Tüm veriler silindi.");
      window.location.href = '/';
    }
  };

  const handleAddMyTakva = async () => {
    if (!newTakva.text) return;
    const res = await fetch('/api/users/takva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTakva, nickname: settings.nickname })
    });
    if (res.ok) {
      fetchMyTakvaCards();
      setNewTakva({ ...newTakva, text: '' });
    }
  };

  const handleDeleteMyTakva = async (id: number) => {
    if(confirm("Silmek istediğine emin misin?")) {
      await fetch(`/api/users/takva?id=${id}&nickname=${settings.nickname}`, { method: 'DELETE' });
      fetchMyTakvaCards();
    }
  };

  return (
    <>
      <div className="container" style={{ paddingBottom: '100px', paddingTop: '40px' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '40px' }}>Ayarlar</h1>
        
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Rumuz</h3>
          <input 
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-primary)',
              color: 'white', fontSize: '16px', marginBottom: '16px'
            }}
          />
          <button className="button button-primary" onClick={handleSaveNickname} disabled={isSubmitting}>
            {isSubmitting ? 'Kontrol Ediliyor...' : 'Kaydet'}
          </button>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Takva Modu</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Teheccüd, sadaka gibi ekstra hassasiyetleri ve kendi özel virdlerini aktif eder.</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: settings.takvaMode ? '20px' : '0' }}>
            <input 
              type="checkbox" 
              checked={settings.takvaMode} 
              onChange={(e) => updateSettings({ takvaMode: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)' }}
            />
            Takva Modunu Aç
          </label>

          {settings.takvaMode && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
              <h4 style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}>Kişisel Takva Kartlarım</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Günlük özel olarak hatırlatılmasını istediğin vird, tesbihat veya hassasiyetlerini buraya ekleyebilirsin.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <select 
                  value={newTakva.categoryName} 
                  onChange={e => setNewTakva({...newTakva, categoryName: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-primary)', color: 'white' }}
                >
                  <option value="Sevaplar">Sevaplar (Örn: Salavat çektin mi?)</option>
                  <option value="Günahlar">Günahlar (Örn: Şüpheli şeyden kaçındın mı?)</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Sorun... (Örn: Bugün Yasin okudun mu?)" 
                  value={newTakva.text} 
                  onChange={e => setNewTakva({...newTakva, text: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-primary)', color: 'white' }}
                />
                <button className="button button-primary" onClick={handleAddMyTakva}>Ekle</button>
              </div>

              {myTakvaCards.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {myTakvaCards.map((t: any) => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'white' }}>
                        <span style={{ color: t.weight > 0 ? 'var(--accent-green)' : 'var(--accent-danger)', marginRight: 8 }}>{t.weight > 0 ? '(+1)' : '(-1)'}</span>
                        {t.text}
                      </span>
                      <button onClick={() => handleDeleteMyTakva(t.id)} style={{ color: 'var(--accent-danger)', background: 'none', border: 'none', cursor: 'pointer' }}>Sil</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card" style={{ borderColor: 'var(--accent-danger)' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--accent-danger)' }}>Tehlikeli Bölge</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Bu işlem cihazındaki tüm kayıtları ve vektör verilerini siler.</p>
          <button 
            className="button" 
            style={{ backgroundColor: '#2d1b2e', color: '#ff8a8a' }} 
            onClick={handleReset}
          >
            Tüm Verileri Sil (Factory Reset)
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
