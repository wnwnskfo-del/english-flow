import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DrillSet, DrillType } from '@/types/drill';
import { SubstitutionDrill } from '@/components/drills/SubstitutionDrill';
import { ResponseDrill } from '@/components/drills/ResponseDrill';
import { TransformationDrill } from '@/components/drills/TransformationDrill';
import { ExpansionDrill } from '@/components/drills/ExpansionDrill';
import { IntegrationDrill } from '@/components/drills/IntegrationDrill';
import { Replace, MessageCircle, RefreshCw, Maximize2, Layers } from 'lucide-react';

interface DrillTabsProps {
  drillSet: DrillSet;
}

const tabConfig: { value: DrillType; label: string; labelKorean: string; icon: React.ReactNode }[] = [
  { value: 'substitution', label: 'Substitution', labelKorean: '대체', icon: <Replace className="h-4 w-4" /> },
  { value: 'response', label: 'Response', labelKorean: '응답', icon: <MessageCircle className="h-4 w-4" /> },
  { value: 'transformation', label: 'Transformation', labelKorean: '변형', icon: <RefreshCw className="h-4 w-4" /> },
  { value: 'expansion', label: 'Expansion', labelKorean: '확장', icon: <Maximize2 className="h-4 w-4" /> },
  { value: 'integration', label: 'Integration', labelKorean: '통합', icon: <Layers className="h-4 w-4" /> },
];

export function DrillTabs({ drillSet }: DrillTabsProps) {
  return (
    <Tabs defaultValue="substitution" className="w-full">
      <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-secondary/50">
        {tabConfig.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex flex-col gap-1 py-3 px-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              {tab.icon}
              <span className="font-english text-sm hidden sm:inline">{tab.label}</span>
            </div>
            <span className="font-korean text-xs text-muted-foreground">{tab.labelKorean}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="substitution" className="mt-6 space-y-4">
        {drillSet.substitution.map((drill, index) => (
          <SubstitutionDrill key={drill.id} drill={drill} index={index} />
        ))}
      </TabsContent>

      <TabsContent value="response" className="mt-6 space-y-4">
        {drillSet.response.map((drill, index) => (
          <ResponseDrill key={drill.id} drill={drill} index={index} />
        ))}
      </TabsContent>

      <TabsContent value="transformation" className="mt-6 space-y-4">
        {drillSet.transformation.map((drill, index) => (
          <TransformationDrill key={drill.id} drill={drill} index={index} />
        ))}
      </TabsContent>

      <TabsContent value="expansion" className="mt-6 space-y-4">
        {drillSet.expansion.map((drill, index) => (
          <ExpansionDrill key={drill.id} drill={drill} index={index} />
        ))}
      </TabsContent>

      <TabsContent value="integration" className="mt-6 space-y-4">
        {drillSet.integration.map((drill, index) => (
          <IntegrationDrill key={drill.id} drill={drill} index={index} />
        ))}
      </TabsContent>
    </Tabs>
  );
}
