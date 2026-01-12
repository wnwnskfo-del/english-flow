import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DrillTabs } from '@/components/DrillTabs';
import { sampleDrillSet } from '@/data/sampleDrills';
import { DrillSet, Word, SubstitutionDrill, ResponseDrill, TransformationDrill, ExpansionDrill, IntegrationDrill } from '@/types/drill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Sparkles, GraduationCap, Loader2, Key } from 'lucide-react';

export function Dashboard() {
  const [currentDrillSet, setCurrentDrillSet] = useState<DrillSet | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [directInput, setDirectInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load API Key from LocalStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  // Helper: Convert string to Word[] for the type system
  const stringToWords = (sentence: string, targetWord?: string, type?: 'subject' | 'verb' | 'object' | 'adjective' | 'adverb', alternatives?: string[]): Word[] => {
    if (!sentence) return [];
    
    return sentence.split(' ').map((text, index, array) => {
      // Clean punctuation for comparison but keep in display
      const cleanText = text.replace(/[.,?!]/g, '');
      const isTarget = targetWord && cleanText.toLowerCase() === targetWord.toLowerCase();
      
      // Add space after word unless it's the last one
      const suffix = index < array.length - 1 ? ' ' : '';
      
      return {
        text: text + suffix,
        isInteractive: !!isTarget,
        type: isTarget ? type : undefined,
        alternatives: isTarget ? alternatives : undefined
      };
    });
  };

  const generateDrills = async (content: string, sourceName: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API Key first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `
        You are an expert English Instructor creating FSI (Foreign Service Institute) style pattern drills.
        User Content: "${content.substring(0, 3000)}" (Content truncated for length)

        Task: Analyze the content and create a Drill Set with 5 types of drills.
        
        Return ONLY a raw JSON object (no markdown, no backticks) with this EXACT structure:
        {
          "title": "Short title based on content",
          "titleKorean": "Korean title",
          "description": "Brief description",
          "descriptionKorean": "Korean description",
          "substitution": [
            { "sentence": "Full English sentence", "korean": "Korean meaning", "targetWord": "word to replace", "alternatives": ["alt1", "alt2", "alt3"], "wordType": "subject" } 
          ],
          "response": [
             { "prompt": "Question or statement", "promptKorean": "Korean prompt", "response": "Expected answer", "expectedResponses": ["likely answer 1", "likely answer 2"], "korean": "Korean answer" }
          ],
          "transformation": [
             { "original": "Original sentence", "korean": "Korean meaning", "instruction": "Change to Past Tense", "instructionKorean": "과거형으로 바꾸세요", "answer": "Transformed sentence", "answerKorean": "Korean answer" }
          ],
          "expansion": [
             { "original": "Short sentence", "korean": "Korean meaning", "cue": "Add: 'quickly'", "cueKorean": "추가: 'quickly'", "answer": "Expanded sentence", "answerKorean": "Korean answer" }
          ],
          "integration": [
             { 
               "context": "Context description", "contextKorean": "Korean context",
               "dialogue": [
                 { "speaker": "A", "text": "Line 1", "korean": "Korean line 1" },
                 { "speaker": "B", "text": "Line 2", "korean": "Korean line 2" }
               ] 
             }
          ]
        }
        
        Create at least 3 items for substitution, response, transformation, and expansion.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      let jsonStr = data.candidates[0].content.parts[0].text;
      jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(jsonStr);

      // Map JSON to DrillSet type
      const newDrillSet: DrillSet = {
        id: Date.now().toString(),
        title: result.title || sourceName,
        titleKorean: result.titleKorean || '생성된 드릴',
        description: result.description || 'Custom generated drills',
        descriptionKorean: result.descriptionKorean || '사용자 콘텐츠 기반 드릴',
        createdAt: new Date(),
        
        substitution: (result.substitution || []).map((item: any, idx: number) => ({
          id: `sub-${idx}`,
          type: 'substitution',
          english: stringToWords(item.sentence, item.targetWord, item.wordType || 'object', item.alternatives),
          korean: item.korean,
          instruction: 'Substitute the highlighted word.',
          instructionKorean: '강조된 단어를 다른 단어로 교체하세요.'
        })),

        response: (result.response || []).map((item: any, idx: number) => ({
          id: `res-${idx}`,
          type: 'response',
          english: stringToWords(item.response),
          korean: item.korean,
          prompt: item.prompt,
          promptKorean: item.promptKorean,
          expectedResponses: item.expectedResponses || [item.response],
          instruction: 'Listen and respond naturally.',
          instructionKorean: '듣고 자연스럽게 응답하세요.'
        })),

        transformation: (result.transformation || []).map((item: any, idx: number) => ({
          id: `trans-${idx}`,
          type: 'transformation',
          english: stringToWords(item.original),
          korean: item.korean,
          targetForm: item.instruction,
          targetFormKorean: item.instructionKorean,
          answer: item.answer,
          answerKorean: item.answerKorean,
          instruction: item.instruction,
          instructionKorean: item.instructionKorean
        })),

        expansion: (result.expansion || []).map((item: any, idx: number) => ({
          id: `exp-${idx}`,
          type: 'expansion',
          english: stringToWords(item.original),
          korean: item.korean,
          expansionCue: item.cue,
          expansionCueKorean: item.cueKorean,
          answer: item.answer,
          answerKorean: item.answerKorean,
          instruction: 'Expand the sentence.',
          instructionKorean: '문장을 확장하세요.'
        })),

        integration: (result.integration || []).map((item: any, idx: number) => ({
          id: `int-${idx}`,
          type: 'integration',
          context: item.context,
          contextKorean: item.contextKorean,
          instruction: 'Practice the dialogue.',
          instructionKorean: '대화를 연습하세요.',
          sentences: (item.dialogue || []).map((line: any, lineIdx: number) => ({
            id: `int-${idx}-${lineIdx}`,
            english: stringToWords(line.text),
            korean: line.korean
          }))
        }))
      };

      setCurrentDrillSet(newDrillSet);
      toast({ title: "Drills Generated!", description: "Your custom drills are ready." });

    } catch (error) {
      console.error(error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate drills",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileProcessed = (content: string, filename: string) => {
    generateDrills(content, filename.replace(/\.[^/.]+$/, ''));
  };

  const handleDirectInput = () => {
    if (!directInput.trim()) return;
    generateDrills(directInput, "Custom Input");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-english">FSI English Drills</h1>
                <p className="text-sm text-muted-foreground font-korean">한국어 학습자를 위한 영어 훈련</p>
              </div>
            </div>
            
            {/* API Key Input in Header */}
            <div className="flex items-center gap-2 max-w-sm w-full">
               <Key className="h-4 w-4 text-muted-foreground" />
               <Input 
                 type="password" 
                 placeholder="Gemini API Key" 
                 value={apiKey}
                 onChange={(e) => saveApiKey(e.target.value)}
                 className="h-9 font-mono text-xs"
               />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!currentDrillSet ? (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                <span className="font-english">Start Your English Practice</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload a file or enter text to generate personalized AI drills.
              </p>
            </div>

            {/* Input Section */}
            <div className="grid gap-6">
                {/* File Upload */}
                <div className="space-y-2">
                    <Label>Option 1: Upload File (PDF/TXT)</Label>
                    <FileUpload onFileProcessed={handleFileProcessed} />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground px-2">OR</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                {/* Direct Input */}
                <div className="space-y-3">
                    <Label>Option 2: Direct Text Input</Label>
                    <Textarea 
                        placeholder="Paste your English sentences here (e.g., I go to school every day...)" 
                        className="min-h-[100px]"
                        value={directInput}
                        onChange={(e) => setDirectInput(e.target.value)}
                    />
                    <Button 
                        onClick={handleDirectInput} 
                        disabled={isLoading || !directInput.trim()} 
                        className="w-full"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Drills from Text
                    </Button>
                </div>
            </div>

            {/* Sample Button */}
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentDrillSet(sampleDrillSet)}
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                View Sample Drills &rarr;
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 pt-8">
              {[
                { icon: <BookOpen className="h-5 w-5" />, title: '5 Drill Types', desc: 'Substitution, Response, etc.' },
                { icon: <Sparkles className="h-5 w-5" />, title: 'Gemini AI', desc: 'Powered by Google AI' },
                { icon: <GraduationCap className="h-5 w-5" />, title: 'FSI Method', desc: 'Proven methodology' },
              ].map((feature, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-card border border-border text-center">
                  <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Drill Set Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-english">{currentDrillSet.title}</h2>
                <p className="text-muted-foreground font-korean">{currentDrillSet.titleKorean}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentDrillSet(null)}
              >
                New Session
              </Button>
            </div>

            <DrillTabs drillSet={currentDrillSet} />
          </div>
        )}
      </main>
    </div>
  );
}
