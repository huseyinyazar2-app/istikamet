'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateSettings } = useStore();

  const handleNext = () => setStep(s => s + 1);

  const handleComplete = async () => {
    if (nickname.trim()) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: nickname.trim() })
        });
        
        if (res.ok) {
          updateSettings({ nickname: nickname.trim(), onboardingComplete: true });
          onComplete();
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

  const slides = [
    {
      title: "İstikamet'e Hoşgeldin",
      text: "Burası senin dijital aynan. Günlük hayatın karmaşasında kalbini ve amellerini tartabileceğin güvenli bir alan."
    },
    {
      title: "Tamamen Gizli",
      text: "Cevapların sadece senin cihazında kalır. Gün sonunda tövbe ettiğinde hepsi silinir, sadece genel gidişatın saklanır."
    },
    {
      title: "Seni Nasıl Çağıralım?",
      text: "Kendine bir rumuz belirle. (Sistemde eşsiz olmalıdır.)"
    }
  ];

  return (
    <div className="onboarding-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="onboarding-slide"
        >
          <h1>{slides[step].title}</h1>
          <p>{slides[step].text}</p>

          {step === 2 && (
            <input
              type="text"
              placeholder="Rumuzun..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
              style={{ padding: '12px', fontSize: '18px', borderRadius: '8px', border: '1px solid var(--accent-green)', background: 'var(--bg-secondary)', color: 'white', width: '100%', marginBottom: '20px' }}
            />
          )}

          {step < 2 ? (
            <button className="button button-primary" onClick={handleNext}>Devam Et</button>
          ) : (
            <button className="button button-primary" onClick={handleComplete} disabled={!nickname.trim() || isSubmitting}>
              {isSubmitting ? 'Kontrol ediliyor...' : 'Başla'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
