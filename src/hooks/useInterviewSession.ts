import { useState, useEffect, useRef } from 'react';

export function useInterviewSessionTimer(session: InterviewSession | null): number {
  const [, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!session || session.status !== 'IN_PROGRESS') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [session]);

  if (!session || session.status !== 'IN_PROGRESS') {
    return 0;
  }

  const startedAt = new Date(session.startedAt).getTime();
  const targetEnd = startedAt + session.timeLimitSeconds * 1000;
  return Math.max(0, Math.floor((targetEnd - Date.now()) / 1000));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
