"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface TTSControlsProps {
  text: string;
  onSpeak: (text: string) => void;
  onStop: () => void;
  className?: string;
}

export function TTSControls({ text, onSpeak, onStop, className = "" }: TTSControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      onStop();
      setIsPlaying(false);
    } else {
      onSpeak(text);
      setIsPlaying(true);
      
      // Simular duración de audio (aproximada)
      const estimatedDuration = text.length * 0.1; // ~100ms por carácter
      setTimeout(() => {
        setIsPlaying(false);
      }, estimatedDuration * 1000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handlePlay}
      className={`w-8 h-8 p-0 ${className}`}
      title={isPlaying ? "Detener audio" : "Reproducir audio"}
    >
      {isPlaying ? (
        <Pause className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
    </Button>
  );
}
