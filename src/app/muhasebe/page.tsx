'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import SwipeCard from '@/components/SwipeCard';
import { AnimatePresence, motion } from 'framer-motion';
import '@/components/components.css';

export default function Muhasebe() {
  const [cards, setCards] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  const [reflectionMsg, setReflectionMsg] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  
  const { addDailyAnswer, settings } = useStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch('/api/cards');
        if (res.ok) {
          const data = await res.json();
          let finalCards = [...data.cards];

          if (settings.takvaMode) {
            if (data.takvaCards && data.takvaCards.length > 0) {
              const shuffledTakva = [...data.takvaCards].sort(() => 0.5 - Math.random());
              const halfTakva = shuffledTakva.slice(0, Math.ceil(shuffledTakva.length / 2));
              finalCards = [...finalCards, ...halfTakva];
            }

            if (settings.nickname) {
              const uRes = await fetch(`/api/users/takva?nickname=${settings.nickname}`);
              if (uRes.ok) {
                const uData = await uRes.json();
                if (uData.data && uData.data.length > 0) {
                  finalCards = [...finalCards, ...uData.data];
                }
              }
            }
          }

          finalCards.sort(() => 0.5 - Math.random());
          setCards(finalCards);
          setReflections(data.reflections || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCards();
  }, [settings.takvaMode, settings.nickname]);

  const handleSwipeFast = () => {
    setToastMsg("Bu soruyu gerçekten okuyup düşündün mü?");
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const handleSwipe = (result: boolean) => {
    const currentCard = cards[currentIndex];
    addDailyAnswer(currentCard.id, result);

    // Kullanıcının günah işlediği veya sevabı terk ettiği durumlar "olumsuz" kabul edilir
    const isNegativeAction = (currentCard.weight < 0 && result === true) || (currentCard.weight > 0 && result === false);

    // Eğer olumsuz bir eylemse %20 ihtimalle, değilse %5 ihtimalle çıksın (ortalama 7-8 kez çıkması için)
    const probability = isNegativeAction ? 0.20 : 0.05;

    // Kartın kendi tefekkür mesajları var mı kontrol et
    const availableReflections = [];
    if (currentCard.reflection1) availableReflections.push(currentCard.reflection1);
    if (currentCard.reflection2) availableReflections.push(currentCard.reflection2);

    if (availableReflections.length > 0 && Math.random() < probability) {
      const randomReflection = availableReflections[Math.floor(Math.random() * availableReflections.length)];
      setReflectionMsg(randomReflection);
      setTimeout(() => {
        setReflectionMsg(null);
        nextCard();
      }, 4000); 
    } else {
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      router.push('/rapor');
    }
  };

  if (cards.length === 0) {
    return <div className="container dashboard-container" style={{ color: 'var(--text-secondary)' }}>Ayna siliniyor... (Yükleniyor)</div>;
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingBottom: '20px' }}>
      
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 50 }}>
        <button onClick={() => setShowExitModal(true)} className="button" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Çıkış
        </button>
      </div>

      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tefekkur-toast"
            style={{ position: 'absolute', top: '10%', zIndex: 100 }}
          >
            <p>"{toastMsg}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {reflectionMsg ? (
          <motion.div 
            key="reflection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="tefekkur-toast"
            style={{ zIndex: 50 }}
          >
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{reflectionMsg}</p>
          </motion.div>
        ) : (
          <motion.div key={currentIndex} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <SwipeCard card={cards[currentIndex]} onSwipe={handleSwipe} onSwipeFast={handleSwipeFast} />
            <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)' }}>
              {currentIndex + 1} / {cards.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ÇIKIŞ ONAY MODALI */}
      {showExitModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', maxWidth: '350px', width: '100%', border: '1px solid var(--accent-gold)' }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: 20, textAlign: 'center' }}>Nefis Muhasebesi Yarım Kalacak</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5, textAlign: 'center' }}>
              Muhasebeyi tamamlamadan çıkmak istediğinize emin misiniz? Kaydettiğiniz cevaplar gün sonu raporuna tam yansımayabilir.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="button" style={{ flex: 1, backgroundColor: 'var(--bg-primary)', color: 'white' }} onClick={() => setShowExitModal(false)}>İptal</button>
              <button className="button button-primary" style={{ flex: 1, fontWeight: 'bold' }} onClick={() => router.push('/')}>Evet, Çık</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
