import { IntegrationDrill as IntegrationDrillType } from '@/types/drill';
import { TTSButton } from '@/components/TTSButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

interface IntegrationDrillProps {
  drill: IntegrationDrillType;
  index: number;
}

export function IntegrationDrill({ drill, index }: IntegrationDrillProps) {
  return (
    <Card className="drill-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-english">{drill.context}</CardTitle>
              <p className="text-sm korean-text font-korean">{drill.contextKorean}</p>
            </div>
          </div>
          <Badge variant="secondary">
            {drill.sentences.length} 문장
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Instruction */}
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm">
            <span className="font-english">{drill.instruction}</span>
          </p>
          <p className="text-sm korean-text font-korean mt-1">{drill.instructionKorean}</p>
        </div>

        {/* Dialogue sentences */}
        <div className="space-y-3">
          {drill.sentences.map((sentence, idx) => {
            const sentenceText = sentence.english.map(w => w.text).join('');
            return (
              <div
                key={sentence.id}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {idx + 1}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-english">{sentenceText}</p>
                    <TTSButton text={sentenceText} />
                  </div>
                  <p className="text-sm korean-text font-korean">{sentence.korean}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
