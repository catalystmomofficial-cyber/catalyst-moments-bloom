import { useCallback, useRef } from 'react';

type SoundType = 'complete' | 'achievement' | 'click' | 'success' | 'notification';

const SOUND_ENABLED_KEY = 'catalyst_sound_enabled';

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const isSoundEnabled = useCallback(() => {
    const stored = localStorage.getItem(SOUND_ENABLED_KEY);
    return stored === null ? true : stored === 'true';
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!isSoundEnabled()) return;

    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case 'complete':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        case 'achievement':
          const frequencies = [523.25, 659.25, 783.99];
          frequencies.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            osc.start(audioContext.currentTime + i * 0.1);
            osc.stop(audioContext.currentTime + 0.5 + i * 0.1);
          });
          return;

        case 'notification':
          // Soft two-tone chime
          const n1 = audioContext.createOscillator();
          const n2 = audioContext.createOscillator();
          const ng1 = audioContext.createGain();
          const ng2 = audioContext.createGain();
          n1.connect(ng1); ng1.connect(audioContext.destination);
          n2.connect(ng2); ng2.connect(audioContext.destination);
          n1.frequency.value = 698.46; // F5
          n2.frequency.value = 880;    // A5
          n1.type = 'sine';
          n2.type = 'sine';
          ng1.gain.setValueAtTime(0.25, audioContext.currentTime);
          ng1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          ng2.gain.setValueAtTime(0.25, audioContext.currentTime + 0.15);
          ng2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.45);
          n1.start(audioContext.currentTime);
          n1.stop(audioContext.currentTime + 0.3);
          n2.start(audioContext.currentTime + 0.15);
          n2.stop(audioContext.currentTime + 0.45);
          return;

        case 'success':
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.15);
          break;

        case 'click':
          oscillator.frequency.value = 600;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
      }
    } catch (error) {
      console.log('Sound playback not supported');
    }
  }, [getAudioContext, isSoundEnabled]);

  return { playSound, isSoundEnabled, setSoundEnabled };
}
