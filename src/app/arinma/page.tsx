'use client';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import '@/components/components.css';

export default function Arinma() {
  const [receteler, setReceteler] = useState([]);

  useEffect(() => {
    fetch('/api/arinma').then(r => r.json()).then(data => setReceteler(data.data || []));
  }, []);

  return (
    <>
      <div className="container" style={{ paddingBottom: '100px', paddingTop: '40px', maxWidth: '700px' }}>
        <h1 style={{ color: 'var(--accent-green)', marginBottom: '10px' }}>Arınma Reçeteleri</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Hatalara karşı alınacak aksiyonlar ve zikirler.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {receteler.length === 0 && <p style={{ color: 'gray' }}>Yükleniyor...</p>}
          {receteler.map((r: any) => (
            <div 
              key={r.id} 
              className="card" 
              style={{ 
                borderTop: r.isHeavy ? '4px solid var(--accent-danger)' : '4px solid var(--accent-green)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '24px'
              }}
            >
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '18px' }}>{r.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>{r.action}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
