'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/components/components.css';

export default function AkaidTest() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [isAnswered, setIsAnswered] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [userChoice, setUserChoice] = useState<boolean | 'bilmiyorum' | null>(null);
  const [showCorrectMsg, setShowCorrectMsg] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    fetch('/api/akaid')
      .then(res => res.json())
      .then(data => {
        // Kartları rastgele sıraya sokalım ki her seferinde farklı gelsin
        const shuffled = (data.data || []).sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (choice: boolean | 'bilmiyorum') => {
    const currentCard = cards[currentIndex];
    setUserChoice(choice);
    setIsAnswered(true);

    if (choice === 'bilmiyorum') {
      setIsWrong(true);
      setWrongCount(prev => prev + 1);
    } else if (choice !== currentCard.isTrue) {
      setIsWrong(true);
      setWrongCount(prev => prev + 1);
    } else {
      setIsWrong(false);
      setShowCorrectMsg(true);
      // 1.5 saniye sonra otomatik geç
      setTimeout(() => {
        nextCard();
      }, 1500);
    }
  };

  const nextCard = () => {
    setIsAnswered(false);
    setIsWrong(false);
    setShowCorrectMsg(false);
    setUserChoice(null);
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--accent-gold)' }}>Yükleniyor...</div>;
  }

  if (cards.length === 0) {
    return <div className="container" style={{ textAlign: 'center', marginTop: 100, color: 'white' }}>Henüz test eklenmemiş.</div>;
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
        <h2 style={{ color: 'var(--accent-gold)', marginBottom: 20, textAlign: 'center' }}>Test Tamamlandı</h2>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', border: '1px solid var(--accent-gold)', maxWidth: '500px', width: '100%', marginBottom: 30 }}>
          <h3 style={{ color: 'white', marginBottom: 15, fontSize: 18 }}>İmanın Önemi</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 15, lineHeight: 1.6, fontSize: 15 }}>
            İslam'da iman (Akaid), ibadetlerden ve ahlaktan önce gelir. Sağlam ve doğru bir inanç (Ehli Sünnet) olmadan yapılan ibadetlerin ve iyiliklerin ahirette hiçbir karşılığı yoktur. Binanın temeli imandır, ameller ise onun üzerine inşa edilir.
          </p>

          {wrongCount > 0 && (
            <div style={{ background: 'rgba(255, 50, 50, 0.1)', padding: '16px', borderRadius: '12px', marginTop: '20px', borderLeft: '4px solid var(--accent-danger)' }}>
              <p style={{ color: 'white', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                Bu testte <strong>{wrongCount}</strong> adet soruda hatanız veya bilmediğiniz konu oldu. Lütfen bu eksiklikleri ciddiye alarak inancımızı bu hakikatler ışığında düzeltelim ve Rabbimize olan yürüyüşümüze sarsılmaz bir imanla devam edelim. Unutmayın ki niyetimiz sizi kırmak değil, ebedi kurtuluşunuza vesile olmaktır.
              </p>
            </div>
          )}
          
          {wrongCount === 0 && (
            <div style={{ background: 'rgba(50, 200, 50, 0.1)', padding: '16px', borderRadius: '12px', marginTop: '20px', borderLeft: '4px solid var(--accent-green)' }}>
              <p style={{ color: 'white', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                Tebrikler! Hiçbir hataya düşmeden, itikadınızı sapasağlam muhafaza etmişsiniz. Rabbim bu sarsılmaz imanınızı daim eylesin ve amellerinizle taçlandırsın.
              </p>
            </div>
          )}
        </div>

        <Link href="/">
          <button className="button button-primary" style={{ padding: '12px 30px', fontSize: 16 }}>Ana Sayfaya Dön</button>
        </Link>
      </div>
    );
  }

  const card = cards[currentIndex];

  // Titreme (shake) animasyonu. Sadece yanlış bildiğinde titrer, bilmiyorum derse titremez.
  const shakeAnimation = (isWrong && userChoice !== 'bilmiyorum') ? {
    x: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
    transition: { duration: 0.5 }
  } : {};

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
      
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 50 }}>
        <button onClick={() => setShowExitModal(true)} className="button" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Çıkış
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '40px' }}>
        <h1 style={{ color: 'var(--accent-gold)', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>İman Esasları</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: 5 }}>Soru {currentIndex + 1} / {cards.length}</p>
      </div>

      <motion.div 
        animate={shakeAnimation}
        style={{ 
          background: isAnswered ? (isWrong ? 'rgba(255,50,50,0.05)' : 'rgba(50,255,50,0.05)') : 'rgba(30,30,35,0.7)', 
          border: isAnswered ? (isWrong ? '1px solid rgba(255,50,50,0.3)' : '1px solid rgba(50,255,50,0.3)') : '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '30px 24px', 
          borderRadius: '24px', 
          width: '100%', 
          maxWidth: '450px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '20px', lineHeight: '1.6', textAlign: 'center', fontWeight: '500', letterSpacing: '0.3px' }}>
          "{card.statement}"
        </p>

        {!isAnswered ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
              <button 
                className="button" 
                onClick={() => handleAnswer(true)}
                style={{ flex: 1, padding: '15px', background: 'rgba(50,200,50,0.2)', color: 'white', fontSize: '16px', border: '1px solid rgba(50,200,50,0.4)' }}
              >
                Doğru
              </button>
              <button 
                className="button" 
                onClick={() => handleAnswer(false)}
                style={{ flex: 1, padding: '15px', background: 'rgba(200,50,50,0.2)', color: 'white', fontSize: '16px', border: '1px solid rgba(200,50,50,0.4)' }}
              >
                Yanlış
              </button>
            </div>
            <button 
              className="button" 
              onClick={() => handleAnswer('bilmiyorum')}
              style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '16px', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Bilmiyorum
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
          >
            {showCorrectMsg ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: 10 }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '24px' }}>Tebrikler!</span>
                <span style={{ color: 'white', fontSize: '16px' }}>Doğru cevap verdin.</span>
                <span style={{ color: 'gray', fontSize: '14px', marginTop: 10 }}>Sıradaki soruya geçiliyor...</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 15 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {userChoice === 'bilmiyorum' ? (
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '18px' }}>Öğrenme Vakti</span>
                    ) : (
                      <span style={{ color: 'var(--accent-danger)', fontWeight: 'bold', fontSize: '18px' }}>Yanlış Cevap</span>
                    )}
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Hakikat: {card.isTrue ? "Doğru" : "Yanlış"}</span>
                  </div>
                  <button 
                    className="button" 
                    onClick={nextCard}
                    style={{ padding: '10px 20px', background: 'var(--accent-gold)', color: 'black', fontWeight: 'bold', fontSize: '14px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}
                  >
                    Geç <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>

                <div className="custom-scrollbar" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--accent-gold)', maxHeight: '45vh', overflowY: 'auto' }}>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }}>
                    {card.explanation}
                  </p>
                  <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <p style={{ color: 'var(--accent-gold)', fontSize: '14px', fontStyle: 'italic', margin: 0, lineHeight: 1.6, display: 'flex', gap: 10 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      <span>{card.proof}</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* ÇIKIŞ ONAY MODALI */}
      {showExitModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', maxWidth: '350px', width: '100%', border: '1px solid var(--accent-gold)' }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: 20, textAlign: 'center' }}>Testi Yarım Bırakıyorsunuz</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5, textAlign: 'center' }}>
              İman Esasları testini tamamlamadan çıkmak istediğinize emin misiniz?
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
