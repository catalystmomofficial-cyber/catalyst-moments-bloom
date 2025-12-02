import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lightbulb, TrendingUp, Target, DollarSign, Search, Sparkles } from 'lucide-react';

interface TopicSuggestion {
  title: string;
  keywords: string[];
  searchIntent: 'informational' | 'commercial' | 'transactional';
  rankingRationale: string;
  conversionAngle: string;
  estimatedSearchVolume: 'low' | 'medium' | 'high';
  productTieIn: string;
}

interface BlogTopicSuggestionsProps {
  onSelectTopic: (title: string, keywords: string[]) => void;
}

export const BlogTopicSuggestions: React.FC<BlogTopicSuggestionsProps> = ({ onSelectTopic }) => {
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusArea, setFocusArea] = useState<string>('');
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('suggest-blog-topics', {
        body: { focusArea: focusArea || undefined }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setSuggestions(data.suggestions || []);
      
      toast({
        title: "Topics Generated!",
        description: `${data.suggestions?.length || 0} strategic blog topics ready for review.`,
      });

    } catch (error: any) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate topic suggestions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case 'high': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'transactional': return <DollarSign className="h-3 w-3" />;
      case 'commercial': return <Target className="h-3 w-3" />;
      default: return <Search className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Topic Suggestions
        </CardTitle>
        <CardDescription>
          Generate strategic blog topics optimized for SEO, conversions, and brand growth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Select value={focusArea} onValueChange={setFocusArea}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All topics (or select focus)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              <SelectItem value="pregnancy fitness">Pregnancy Fitness</SelectItem>
              <SelectItem value="birth ball exercises">Birth Ball Exercises</SelectItem>
              <SelectItem value="postpartum recovery">Postpartum Recovery</SelectItem>
              <SelectItem value="trying to conceive">Trying to Conceive</SelectItem>
              <SelectItem value="prenatal nutrition">Prenatal Nutrition</SelectItem>
              <SelectItem value="pelvic floor health">Pelvic Floor Health</SelectItem>
              <SelectItem value="mental wellness">Mental Wellness</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleGenerateSuggestions} 
            disabled={isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3 mt-4">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onSelectTopic(suggestion.title, suggestion.keywords)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-medium text-sm leading-tight flex-1">
                    {suggestion.title}
                  </h4>
                  <div className="flex gap-1.5 shrink-0">
                    <Badge variant="outline" className={getVolumeColor(suggestion.estimatedSearchVolume)}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {suggestion.estimatedSearchVolume}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getIntentIcon(suggestion.searchIntent)}
                      <span className="ml-1">{suggestion.searchIntent}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {suggestion.keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Why it ranks:</span>{' '}
                    {suggestion.rankingRationale}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Conversion:</span>{' '}
                    {suggestion.conversionAngle}
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {suggestion.productTieIn}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Click to use this topic</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && suggestions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Click "Generate Ideas" to get AI-powered topic suggestions</p>
            <p className="text-xs mt-1">Optimized for SEO, conversions, and scaling to $100M</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
