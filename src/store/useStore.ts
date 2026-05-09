import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  nickname: string;
  takvaMode: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface DailyAnswer {
  cardId: number;
  answer: boolean | null; // true if yes, false if no
}

interface DailyVector {
  date: string; // YYYY-MM-DD
  vector: number; // e.g. -0.5 to 1.0 (Positive means good, negative means bad)
}

interface AppState {
  settings: Settings;
  dailyAnswers: DailyAnswer[];
  vectors: DailyVector[];
  
  // Actions
  updateSettings: (newSettings: Partial<Settings>) => void;
  addDailyAnswer: (cardId: number, answer: boolean) => void;
  completeDay: (date: string, vector: number) => void;
  resetAll: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        nickname: 'Yolcu',
        takvaMode: false,
        theme: 'system',
      },
      dailyAnswers: [],
      vectors: [],

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addDailyAnswer: (cardId, answer) =>
        set((state) => ({
          dailyAnswers: [
            ...state.dailyAnswers.filter((a) => a.cardId !== cardId),
            { cardId, answer },
          ],
        })),

      completeDay: (date, vector) =>
        set((state) => ({
          vectors: [
            ...state.vectors.filter((v) => v.date !== date),
            { date, vector },
          ],
          // Hard Delete: O günkü özel günah/sevap cevapları siliniyor, sadece vektör değeri kalıyor.
          dailyAnswers: [],
        })),

      resetAll: () => set({ 
        settings: { nickname: 'Yolcu', takvaMode: false, theme: 'system' }, 
        dailyAnswers: [], 
        vectors: [] 
      }),
    }),
    {
      name: 'istikamet-storage', // LocalStorage anahtarı
    }
  )
);
