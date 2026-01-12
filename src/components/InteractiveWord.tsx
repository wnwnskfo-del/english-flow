import { useState } from 'react';
import { Word } from '@/types/drill';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface InteractiveWordProps {
  word: Word;
  onWordChange: (newWord: string) => void;
}

export function InteractiveWord({ word, onWordChange }: InteractiveWordProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentText, setCurrentText] = useState(word.text);

  if (!word.isInteractive) {
    return <span className="english-text">{word.text}</span>;
  }

  const handleSelect = (alternative: string) => {
    setCurrentText(alternative);
    onWordChange(alternative);
    setIsOpen(false);
  };

  const typeLabel: Record<string, string> = {
    subject: '주어',
    verb: '동사',
    adverb: '부사',
    object: '목적어',
    adjective: '형용사',
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="interactive-word font-medium">
          {currentText}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="center">
        <div className="space-y-2">
          {word.type && (
            <div className="text-xs text-muted-foreground font-korean px-2 pb-1 border-b">
              {typeLabel[word.type] || word.type}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {word.alternatives?.map((alt, index) => (
              <button
                key={index}
                onClick={() => handleSelect(alt)}
                className="text-left px-3 py-1.5 rounded-md hover:bg-secondary transition-colors text-sm font-english"
              >
                {alt}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
