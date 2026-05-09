'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import '@/components/components.css';

export default function Rapor() {
  const { dailyAnswers, completeDay, settings } = useStore();
  const router = useRouter();
  const [vector, setVector] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function calculateVector() {
      try {
        const res = await fetch('/api/cards');
        if (res.ok) {
          const data = await res.json();
          let allCards = [...data.cards];
          
          if (data.takvaCards) {
            allCards = [...allCards, ...data.takvaCards];
          }

          if (settings.nickname) {
            const uRes = await fetch(`/api/users/takva?nickname=${settings.nickname}`);
            if (uRes.ok) {
              const uData = await uRes.json();
              if (uData.data) {
                allCards = [...allCards, ...uData.data];
              }
            }
          }
          
          let currentScore = 0;
          dailyAnswers.forEach(ans => {
            const card = allCards.find((c: any) => String(c.id) === String(ans.cardId));
            if (card) {
              const weight = Number(card.weight) || 0;
              let scoreChange = 0;
              
              if (weight > 0) { 
                // Farz (+5) veya Nafile Sevap (+1)
                if (ans.answer) {
                  scoreChange = weight; // Yaptıysa (+)
                } else {
                  // Farzları (5 ve üzeri) terk etmek günahtır (-), Nafileleri terk etmek 0'dır.
                  scoreChange = weight >= 5 ? -weight : 0;
                }
              } else if (weight < 0) { 
                // Günahlar (-5, -10 vb.)
                if (ans.answer) {
                  scoreChange = weight; // Günah işlendi (-)
                } else {
                  scoreChange = 0; // Günah işlenmedi (0 - fıtrat hali)
                }
              }
              
              currentScore += scoreChange;
            }
          });
          
          // Ortalama normalizasyon (Soru başına düşen maksimum puan ~5)
          const maxPossibleAbs = dailyAnswers.length * 5; 
          const normalized = Math.max(-100, Math.min(100, (currentScore / Math.max(1, maxPossibleAbs)) * 100));
          setVector(normalized);
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    if (dailyAnswers.length > 0) {
      calculateVector();
    }
  }, [dailyAnswers, settings.nickname]);

  const handleHoldStart = () => {
    setIsHolding(true);
    setHoldProgress(0);
    
    progressIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / 30); // 3 saniyede %100 (30 * 100ms)
      });
    }, 100);

    holdTimerRef.current = setTimeout(() => {
      handleCompleteAndWipe();
    }, 3000);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const handleCompleteAndWipe = () => {
    handleHoldEnd();
    const today = new Date().toISOString().split('T')[0];
    completeDay(today, vector);
    router.push('/'); // Ana ekrana döndür
  };

  const isPositive = vector >= 0;
  const horizonRotate = (vector / 100) * -15; // Ufuk çizgisi açısı
  const horizonColor = isPositive ? 'var(--accent-green)' : 'var(--accent-danger)';
  const message = isPositive 
    ? "İstikametin aydınlık. Eksiklerini tamamla, iyiliklerini artır."
    : "Bugün kalbini ağırlaştırdın. Ama tövbe kapısı her zaman açıktır.";

  if (dailyAnswers.length === 0) {
    return (
      <div className="container dashboard-container">
        <h2>Bugün henüz muhasebe yapmadın.</h2>
        <button className="button button-primary" onClick={() => router.push('/muhasebe')} style={{marginTop: 20}}>Muhasebeye Başla</button>
        <BottomNav />
      </div>
    );
  }

  return (
    <>
      <div className="container rapor-container" style={{ background: isPositive ? 'var(--bg-primary)' : '#0f0a14' }}>
        <h1 className="rapor-title">İstikamet Raporu</h1>
        
        <div className="horizon-wrapper">
          <motion.div 
            className="horizon-line"
            initial={{ rotate: 0 }}
            animate={{ rotate: horizonRotate, backgroundColor: horizonColor }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        <p className="rapor-message">"{message}"</p>

        <div className="wipe-section">
          <p className="wipe-hint">Günü temizlemek ve detayları silmek için basılı tut</p>
          <button 
            className="wipe-btn"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
          >
            <div className="wipe-progress" style={{ width: `${holdProgress}%`, backgroundColor: horizonColor }} />
            <span className="wipe-text">Tövbe Et ve Sıfırla</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
