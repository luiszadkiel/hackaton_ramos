import { useCallback, useEffect, useState } from 'react';

export default function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState(false);

  const checkSupport = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition;
  }, []);

  useEffect(() => {
    setIsSupported(checkSupport());
  }, [checkSupport]);

  return { isSupported };
}




