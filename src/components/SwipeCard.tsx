'use client';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import './components.css';

export default function SwipeCard({ card, onSwipe, onSwipeFast }: { card: any, onSwipe: (res: boolean) => void, onSwipeFast?: () => void }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  
  // CSS değişkenleri (var) aralığında animasyon bozulduğu için doğrudan HEX/RGB kullanıyoruz.
  // Sola çekince kırmızı, ortada koyu arka plan, sağa çekince yeşil.
  const background = useTransform(
    x,
    [-150, 0, 150],
    ['#7a1f1f', '#211c24', '#1f5a3a'] 
  );

  const [mountedTime, setMountedTime] = useState(Date.now());
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    setMountedTime(Date.now());
    setHasWarned(false);
  }, [card.id]);

  const handleDragEnd = (e: any, info: any) => {
    // 2 saniye geçmeden kaydırılmasını engelle (ilk seferinde)
    if (!hasWarned && Date.now() - mountedTime < 2000) {
      if (Math.abs(info.offset.x) > 50) {
        setHasWarned(true);
        if (onSwipeFast) onSwipeFast();
      }
      return; // Framer motion dragConstraints sayesinde otomatik geri seker
    }

    if (info.offset.x > 80) {
      onSwipe(true); // Sağ (Evet)
    } else if (info.offset.x < -80) {
      onSwipe(false); // Sol (Hayır)
    }
  };

  const handleBtnClick = (res: boolean) => {
    if (!hasWarned && Date.now() - mountedTime < 2000) {
      setHasWarned(true);
      if (onSwipeFast) onSwipeFast();
      return;
    }
    onSwipe(res);
  };

  return (
    <div className="swipe-card-wrapper">
      <motion.div
        className="swipe-card"
        style={{ x, opacity, rotate, background }}
        drag="x"
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div className="card-category">
          {card.isTakva && '🌙 '} 
          {card.categoryName}
        </div>
        <h2 className="card-text">{card.text}</h2>
        {card.description && (
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '0 12px' }}>
            {card.description}
          </p>
        )}
        <div className="swipe-hints">
          <span className="hint-no">← Hayır</span>
          <span className="hint-yes">Evet →</span>
        </div>
      </motion.div>
      
      <div className="swipe-buttons">
        <button className="btn-swipe btn-no" onClick={() => handleBtnClick(false)}>Hayır</button>
        <button className="btn-swipe btn-yes" onClick={() => handleBtnClick(true)}>Evet</button>
      </div>
    </div>
  );
}
