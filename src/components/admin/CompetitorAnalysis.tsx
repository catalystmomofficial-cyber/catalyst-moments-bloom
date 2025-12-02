import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Target, TrendingUp, Lightbulb, Zap, Users, ArrowRight } from 'lucide-react';

interface CompetitorStrength {
  competitor: string;
  topTopics: string[];
  contentStyle: string;
  weaknesses: string[];
}

interface ContentGap {
  topic: string;
  searchVolume: string;
  competition: string;
  opportunity: string;
  suggestedTitle: string;
  productTieIn: string;
}

interface KeywordOpportunity {
  keyword: string;
  monthlySearches: string;
  difficulty: string;
  currentRankers: string;
  ourAngle: string;
}

interface UniqueAngle {
  angle: string;
  targetAudience: string;
  differentiator: string;
  contentIdeas: string[];
}

interface ActionPriority {
  action: string;
  impact: string;
  effort: string;
  timeline: string;
}

interface Analysis {
  competitorStrengths: CompetitorStrength[];
  contentGaps: ContentGap[];
  keywordOpportunities: KeywordOpportunity[];
  uniqueAngles: UniqueAngle[];
  actionPriorities: ActionPriority[];
}

interface CompetitorAnalysisProps {
  onSelectGap?: (title: string, keywords: string[]) => void;
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ onSelectGap }) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-competitors', {
        body: {}
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete!",
        description: "Competitor insights and content gaps identified.",
      });

    } catch (error: any) {
      console.error('Error analyzing competitors:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze competitors.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVolumeColor = (volume: string) => {
    switch (volume?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          Competitor Analysis
        </CardTitle>
        <CardDescription>
          Research top maternal wellness blogs to find content gaps and ranking opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">
              Analyze competitors like The Bloom Method, Expecting and Empowered, MUTU System to find content opportunities
            </p>
            <Button onClick={handleAnalyze} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Competitors...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Run Competitor Analysis
                </>
              )}
            </Button>
          </div>
        )}

        {analysis && (
          <Tabs defaultValue="gaps" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gaps" className="text-xs">Content Gaps</TabsTrigger>
              <TabsTrigger value="keywords" className="text-xs">Keywords</TabsTrigger>
              <TabsTrigger value="angles" className="text-xs">Unique Angles</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs">Action Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="gaps" className="mt-4 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Content Gaps to Fill
                </h3>
                <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Refresh'}
                </Button>
              </div>
              {analysis.contentGaps?.map((gap, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onSelectGap?.(gap.suggestedTitle, [gap.topic])}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm">{gap.suggestedTitle}</h4>
                    <div className="flex gap-1 shrink-0">
                      <Badge variant="outline" className={getVolumeColor(gap.searchVolume)}>
                        Vol: {gap.searchVolume}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(gap.competition)}>
                        Comp: {gap.competition}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{gap.opportunity}</p>
                  <Badge variant="secondary" className="text-xs">
                    {gap.productTieIn}
                  </Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="keywords" className="mt-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-blue-500" />
                Keyword Opportunities
              </h3>
              {analysis.keywordOpportunities?.map((kw, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onSelectGap?.(kw.keyword, [kw.keyword])}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{kw.keyword}</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        ~{kw.monthlySearches}/mo
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(kw.difficulty)}>
                        {kw.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{kw.ourAngle}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Current rankers: {kw.currentRankers}
                  </p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="angles" className="mt-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Unique Angles to Explore
              </h3>
              {analysis.uniqueAngles?.map((angle, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">{angle.angle}</h4>
                      <p className="text-xs text-muted-foreground">Target: {angle.targetAudience}</p>
                    </div>
                  </div>
                  <p className="text-xs mb-2">{angle.differentiator}</p>
                  <div className="flex flex-wrap gap-1">
                    {angle.contentIdeas?.map((idea, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => onSelectGap?.(idea, [])}
                      >
                        {idea}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="actions" className="mt-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-orange-500" />
                Priority Actions
              </h3>
              {analysis.actionPriorities?.map((action, index) => (
                <div key={index} className="p-3 border rounded-lg flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getImpactColor(action.impact)}`}>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.action}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Impact: <span className="font-medium">{action.impact}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Effort: <span className="font-medium">{action.effort}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Timeline: <span className="font-medium">{action.timeline}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
