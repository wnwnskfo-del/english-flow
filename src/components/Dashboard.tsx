import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DrillTabs } from '@/components/DrillTabs';
import { sampleDrillSet } from '@/data/sampleDrills';
import { DrillSet } from '@/types/drill';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react';

export function Dashboard() {
  const [currentDrillSet, setCurrentDrillSet] = useState<DrillSet | null>(null);
  const [showSample, setShowSample] = useState(false);

  const handleFileProcessed = (content: string, filename: string) => {
    // For now, use sample drills. With backend, this would call LLM API
    console.log('File content:', content);
    setCurrentDrillSet({
      ...sampleDrillSet,
      title: filename.replace(/\.[^/.]+$/, ''),
      titleKorean: '업로드된 콘텐츠',
    });
  };

  const handleLoadSample = () => {
    setCurrentDrillSet(sampleDrillSet);
    setShowSample(true);
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
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="font-korean">
                학습 기록 / History
              </Button>
              <Button variant="ghost" size="sm" className="font-korean">
                설정 / Settings
              </Button>
            </nav>
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
              <p className="text-lg text-muted-foreground font-korean">
                영어 연습을 시작하세요
              </p>
              <p className="text-muted-foreground max-w-md mx-auto">
                <span className="font-english">Upload a text file to generate personalized drills, or try our sample exercises.</span>
              </p>
              <p className="text-sm text-muted-foreground font-korean">
                텍스트 파일을 업로드하여 맞춤형 드릴을 생성하거나, 샘플 연습을 시도해보세요.
              </p>
            </div>

            {/* Upload Section */}
            <FileUpload onFileProcessed={handleFileProcessed} />

            {/* Or Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground px-4">또는 / OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Sample Button */}
            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={handleLoadSample}
                className="gap-2"
              >
                <Sparkles className="h-5 w-5" />
                <span className="font-english">Try Sample Drills</span>
                <span className="font-korean text-muted-foreground">/ 샘플 드릴 체험</span>
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-3 gap-4 pt-8">
              {[
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  title: '5 Drill Types',
                  titleKr: '5가지 드릴 유형',
                  desc: 'Substitution, Response, Transformation, Expansion, Integration',
                },
                {
                  icon: <Sparkles className="h-5 w-5" />,
                  title: 'AI-Powered',
                  titleKr: 'AI 기반',
                  desc: 'Automatically generate drills from your text',
                },
                {
                  icon: <GraduationCap className="h-5 w-5" />,
                  title: 'FSI Method',
                  titleKr: 'FSI 방식',
                  desc: 'Proven language learning methodology',
                },
              ].map((feature, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-card border border-border text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium font-english">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground font-korean">{feature.titleKr}</p>
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
                onClick={() => {
                  setCurrentDrillSet(null);
                  setShowSample(false);
                }}
              >
                새 파일 / New File
              </Button>
            </div>

            {/* Description */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="font-english">{currentDrillSet.description}</p>
              <p className="text-sm korean-text font-korean mt-1">{currentDrillSet.descriptionKorean}</p>
            </div>

            {/* Drill Tabs */}
            <DrillTabs drillSet={currentDrillSet} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-english">FSI English Drills for Korean Learners</p>
          <p className="font-korean">한국인 학습자를 위한 FSI 영어 드릴</p>
        </div>
      </footer>
    </div>
  );
}
