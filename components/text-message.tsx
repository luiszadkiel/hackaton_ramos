"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface TextMessageProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
  onSpeak?: (text: string) => void;
  onStop?: () => void;
}

export function TextMessage({ 
  text, 
  isUser, 
  timestamp, 
  onSpeak, 
  onStop
}: TextMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (isPlaying) {
      onStop?.();
      setIsPlaying(false);
    } else {
      onSpeak?.(text);
      setIsPlaying(true);
      
      // Simular duración de audio (aproximada)
      const estimatedDuration = text.length * 0.1; // ~100ms por carácter
      setTimeout(() => {
        setIsPlaying(false);
      }, estimatedDuration * 1000);
    }
  };

  return (
    <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      {/* Message Content */}
      <div
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600"
        }`}
      >
        <div className="flex items-start justify-between">
          <p className="text-sm leading-relaxed flex-1">{text}</p>
          {!isUser && onSpeak && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              className="ml-2 flex-shrink-0 w-8 h-8 p-0"
              title={isPlaying ? "Detener audio" : "Reproducir audio"}
            >
              {isPlaying ? (
                <VolumeX className="h-3 w-3" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
