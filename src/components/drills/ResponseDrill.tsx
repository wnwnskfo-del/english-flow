import { useState } from 'react';
import { ResponseDrill as ResponseDrillType } from '@/types/drill';
import { TTSButton } from '@/components/TTSButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

interface ResponseDrillProps {
  drill: ResponseDrillType;
  index: number;
}

export function ResponseDrill({ drill, index }: ResponseDrillProps) {
  const [userResponse, setUserResponse] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    const normalizedResponse = userResponse.toLowerCase().trim().replace(/[.,!?]/g, '');
    const isMatch = drill.expectedResponses.some(
      expected => normalizedResponse.includes(expected.toLowerCase().replace(/[.,!?]/g, ''))
    );
    setIsCorrect(isMatch);
    setChecked(true);
  };

  const handleReset = () => {
    setUserResponse('');
    setChecked(false);
    setShowAnswer(false);
  };

  const sentenceText = drill.english.map(w => w.text).join('');

  return (
    <Card className="drill-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <CardContent className="p-6 space-y-4">
        {/* Prompt */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <p className="text-lg font-english font-medium">{drill.prompt}</p>
            <TTSButton text={drill.prompt} />
          </div>
          <p className="text-sm korean-text font-korean mt-1">{drill.promptKorean}</p>
        </div>

        {/* Response input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type your response... / 답변을 입력하세요..."
              className="flex-1 font-english"
              disabled={checked}
            />
            {!checked ? (
              <Button onClick={handleCheck} disabled={!userResponse.trim()}>
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
                <p className="font-english">{sentenceText}</p>
                <TTSButton text={sentenceText} />
              </div>
              <p className="text-sm korean-text font-korean mt-1">{drill.korean}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
