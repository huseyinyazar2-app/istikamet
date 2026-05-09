'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import BottomNav from '@/components/BottomNav';
import Onboarding from '@/components/Onboarding';
import '@/components/components.css';

export default function Home() {
  const { settings } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // İlk defa giriyorsa onboarding göster
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (!isClient) return null; // Hydration uyuşmazlığını önlemek için

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <>
      <main className="container dashboard-container">
        <h1 className="dashboard-title">Hoşgeldin, {settings.nickname}</h1>
        <p className="dashboard-subtitle">Günün nasıl geçti? Birkaç dakikanı ayırarak istikametini gözden geçir.</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '300px', marginBottom: '30px' }}>
          <Link 
            href="/akaid"
            style={{ textDecoration: 'none', width: '100%', marginBottom: '8px' }}
          >
            <button className="button" style={{ width: '100%', padding: '16px', background: 'var(--bg-secondary)', color: 'var(--accent-gold)', border: '1px solid rgba(212, 175, 55, 0.3)', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>İman Esasları (Akaid)</span>
              <span>→</span>
            </button>
          </Link>
          <p style={{ color: 'var(--text-secondary)', fontSize: '11px', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>
            Doğru bir inanç (Ehli Sünnet) olmadan yapılan ibadetlerin ve iyiliklerin ahirette karşılığı yoktur. Lütfen muhasebeye başlamadan önce inancınızı test edin.
          </p>
        </div>

        <Link 
          href="/muhasebe"
          className="breathe-btn"
        >
          Muhasebeye<br/>Başla
        </Link>
      </main>
      <BottomNav />
    </>
  );
}
