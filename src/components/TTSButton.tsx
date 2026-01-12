import { Volume2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface TTSButtonProps {
  text: string;
  size?: 'sm' | 'default';
}

export function TTSButton({ text, size = 'sm' }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    if (isPlaying) return;

    // Use browser's built-in speech synthesis for now
    // Can be upgraded to ElevenLabs or OpenAI TTS with backend
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast({
          title: '오류 / Error',
          description: '음성 재생에 실패했습니다. / Failed to play audio.',
          variant: 'destructive',
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: '지원하지 않음 / Not Supported',
        description: '이 브라우저에서는 TTS를 지원하지 않습니다. / TTS is not supported in this browser.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleSpeak}
      disabled={isPlaying}
      className="tts-button"
      aria-label="Play audio"
    >
      {isPlaying ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}
