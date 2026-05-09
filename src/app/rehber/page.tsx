'use client';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import '@/components/components.css';

export default function Rehber() {
  const [hastaliklar, setHastaliklar] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetch('/api/rehber').then(r => r.json()).then(data => {
      setHastaliklar(data.data || []);
      if (data.data?.length > 0) setSelectedItem(data.data[0]);
    });
  }, []);

  return (
    <>
      <div className="container" style={{ paddingBottom: '100px', paddingTop: '40px', maxWidth: '800px' }}>
        <h1 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>Rehber Kütüphanesi</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Kalbi hastalıkları tanımak, tedavinin ilk adımıdır.</p>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }} className="rehber-layout">
          {/* Sidebar */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hastaliklar.map((h: any) => (
              <button 
                key={h.id} 
                onClick={() => setSelectedItem(h)}
                style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  background: selectedItem?.id === h.id ? 'var(--bg-secondary)' : 'transparent',
                  border: selectedItem?.id === h.id ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: selectedItem?.id === h.id ? 'var(--accent-gold)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {h.title}
              </button>
            ))}
            {hastaliklar.length === 0 && <p style={{ color: 'gray' }}>Yükleniyor...</p>}
          </div>

          {/* Content */}
          <div style={{ flex: '2', background: 'var(--bg-secondary)', padding: '32px', borderRadius: '16px', minHeight: '300px' }}>
            {selectedItem ? (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '24px' }}>{selectedItem.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '30px', fontSize: '16px' }}>
                  {selectedItem.description}
                </p>
                <div style={{ padding: '20px', backgroundColor: 'rgba(56, 161, 105, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--accent-green)' }}>
                  <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Reçete</div>
                  <div style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>{selectedItem.cure}</div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Lütfen soldan bir başlık seçin.</p>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 600px) {
          .rehber-layout {
            flex-direction: column;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
