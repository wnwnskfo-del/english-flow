import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileProcessed: (content: string, filename: string) => void;
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      toast({
        title: '지원하지 않는 형식 / Unsupported Format',
        description: 'TXT 또는 MD 파일만 업로드 가능합니다. / Only TXT or MD files are supported.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const content = await file.text();
      setUploadedFile(file.name);
      onFileProcessed(content, file.name);
      
      toast({
        title: '파일 업로드 완료 / File Uploaded',
        description: `${file.name} 파일이 성공적으로 업로드되었습니다.`,
      });
    } catch (error) {
      toast({
        title: '오류 / Error',
        description: '파일을 읽는 중 오류가 발생했습니다. / Error reading file.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <Card
      className={`drill-card transition-all duration-200 ${
        isDragging ? 'border-primary border-2 bg-primary/5' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {isProcessing ? (
            <>
              <div className="p-4 rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div>
                <p className="font-medium">처리 중... / Processing...</p>
                <p className="text-sm text-muted-foreground font-korean">
                  AI가 드릴을 생성하고 있습니다.
                </p>
              </div>
            </>
          ) : uploadedFile ? (
            <>
              <div className="p-4 rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {uploadedFile}
                </p>
                <p className="text-sm text-muted-foreground font-korean">
                  파일이 성공적으로 업로드되었습니다.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedFile(null);
                }}
              >
                다른 파일 업로드 / Upload Another
              </Button>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-secondary">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium font-english">
                  Drag & drop your text file here
                </p>
                <p className="text-sm text-muted-foreground font-korean">
                  텍스트 파일을 여기에 드래그하세요
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported: .txt, .md / 지원 형식: .txt, .md
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">또는 / or</span>
              </div>
              <Button asChild>
                <label className="cursor-pointer">
                  파일 선택 / Browse Files
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
