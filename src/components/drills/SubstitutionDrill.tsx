import { useState } from 'react';
import { SubstitutionDrill as SubstitutionDrillType } from '@/types/drill';
import { InteractiveWord } from '@/components/InteractiveWord';
import { TTSButton } from '@/components/TTSButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubstitutionDrillProps {
  drill: SubstitutionDrillType;
  index: number;
}

export function SubstitutionDrill({ drill, index }: SubstitutionDrillProps) {
  const [sentence, setSentence] = useState(drill.english);

  const handleWordChange = (wordIndex: number, newWord: string) => {
    const newSentence = [...sentence];
    newSentence[wordIndex] = { ...newSentence[wordIndex], text: newWord };
    setSentence(newSentence);
  };

  const getSentenceText = () => {
    return sentence.map(w => w.text).join('');
  };

  return (
    <Card className="drill-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* English sentence with interactive words */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg font-english leading-relaxed">
                {sentence.map((word, idx) => (
                  <InteractiveWord
                    key={idx}
                    word={word}
                    onWordChange={(newWord) => handleWordChange(idx, newWord)}
                  />
                ))}
              </p>
              <TTSButton text={getSentenceText()} />
            </div>

            {/* Korean translation */}
            <p className="text-sm korean-text font-korean">
              {drill.korean}
            </p>
          </div>
        </div>

        {/* Instruction */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-english">{drill.instruction}</span>
            <span className="mx-2">|</span>
            <span className="font-korean">{drill.instructionKorean}</span>
          </p>
        </div>

        {/* Word type badges */}
        <div className="flex flex-wrap gap-2">
          {sentence.filter(w => w.isInteractive && w.type).map((word, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              <span className="font-english mr-1">{word.text}</span>
              <span className="font-korean text-muted-foreground">
                ({word.type === 'subject' && '주어'}
                {word.type === 'verb' && '동사'}
                {word.type === 'adverb' && '부사'}
                {word.type === 'object' && '목적어'}
                {word.type === 'adjective' && '형용사'})
              </span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
