"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioMessageProps {
  audioUrl: string;
  isUser: boolean;
  timestamp: Date;
  transcript?: string;
}

export function AudioMessage({ audioUrl, isUser, timestamp, transcript }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) {
      return "0:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (duration > 0 && isFinite(duration)) ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-2xl ${
      isUser 
        ? "bg-blue-500 text-white" 
        : "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600"
    }`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlayPause}
        className={`w-10 h-10 rounded-full ${
          isUser 
            ? "hover:bg-blue-600 text-white" 
            : "hover:bg-slate-100 dark:hover:bg-slate-600"
        }`}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs opacity-70 whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        
        {transcript && (
          <p className="text-xs opacity-80 truncate" title={transcript}>
            {transcript}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className={`w-8 h-8 rounded-full ${
          isUser 
            ? "hover:bg-blue-600 text-white" 
            : "hover:bg-slate-100 dark:hover:bg-slate-600"
        }`}
      >
        {isMuted ? (
          <VolumeX className="h-3 w-3" />
        ) : (
          <Volume2 className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
