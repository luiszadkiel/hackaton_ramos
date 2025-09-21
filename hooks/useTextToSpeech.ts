import { useCallback, useRef } from 'react';

export const useTextToSpeech = () => {
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }) => {
    // Limpiar cualquier audio anterior
    if (currentUtterance.current) {
      speechSynthesis.current?.cancel();
    }

    if (!speechSynthesis.current) {
      speechSynthesis.current = window.speechSynthesis;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar opciones
    utterance.rate = options?.rate || 0.9;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;
    
    // Intentar usar una voz en español
    const voices = speechSynthesis.current.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') || 
      voice.name.includes('Spanish') ||
      voice.name.includes('Español')
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    } else if (options?.voice) {
      utterance.voice = options.voice;
    }

    currentUtterance.current = utterance;
    speechSynthesis.current.speak(utterance);

    return utterance;
  }, []);

  const stop = useCallback(() => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }
  }, []);

  const pause = useCallback(() => {
    if (speechSynthesis.current) {
      speechSynthesis.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (speechSynthesis.current) {
      speechSynthesis.current.resume();
    }
  }, []);

  const getVoices = useCallback(() => {
    if (!speechSynthesis.current) {
      speechSynthesis.current = window.speechSynthesis;
    }
    return speechSynthesis.current.getVoices();
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    getVoices,
  };
};


