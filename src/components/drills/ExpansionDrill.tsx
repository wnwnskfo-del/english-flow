import { useState } from 'react';
import { ExpansionDrill as ExpansionDrillType } from '@/types/drill';
import { TTSButton } from '@/components/TTSButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Eye, EyeOff, Plus } from 'lucide-react';

interface ExpansionDrillProps {
  drill: ExpansionDrillType;
  index: number;
}

export function ExpansionDrill({ drill, index }: ExpansionDrillProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    const normalizedAnswer = userAnswer.toLowerCase().trim().replace(/[.,!?]/g, '');
    const correctAnswer = drill.answer.toLowerCase().replace(/[.,!?]/g, '');
    setIsCorrect(normalizedAnswer === correctAnswer);
    setChecked(true);
  };

  const handleReset = () => {
    setUserAnswer('');
    setChecked(false);
    setShowAnswer(false);
  };

  const originalText = drill.english.map(w => w.text).join('');

  return (
    <Card className="drill-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <CardContent className="p-6 space-y-4">
        {/* Original sentence */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-lg font-english">{originalText}</p>
            <TTSButton text={originalText} />
          </div>
          <p className="text-sm korean-text font-korean">{drill.korean}</p>
        </div>

        {/* Expansion cue */}
        <div className="flex items-center gap-3">
          <Plus className="h-5 w-5 text-accent" />
          <Badge className="text-sm py-1 px-3 bg-accent text-accent-foreground">
            <span className="font-english mr-2">{drill.expansionCue}</span>
            <span className="opacity-80 font-korean">/ {drill.expansionCueKorean}</span>
          </Badge>
        </div>

        {/* Answer input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Expand the sentence... / 문장을 확장하세요..."
              className="flex-1 font-english"
              disabled={checked}
            />
            {!checked ? (
              <Button onClick={handleCheck} disabled={!userAnswer.trim()}>
                확인 / Check
              </Button>
            ) : (
              <Button variant="outline" onClick={handleReset}>
                다시 / Reset
              </Button>
            )}
          </div>

          {/* Feedback */}
          {checked && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">정답입니다! / Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">다시 시도해보세요. / Try again.</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Answer toggle */}
        <div className="pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-muted-foreground"
          >
            {showAnswer ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showAnswer ? '정답 숨기기 / Hide Answer' : '정답 보기 / Show Answer'}
          </Button>
          
          {showAnswer && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <p className="font-english font-medium">{drill.answer}</p>
                <TTSButton text={drill.answer} />
              </div>
              <p className="text-sm korean-text font-korean mt-1">{drill.answerKorean}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
