import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, Clock, Target, TrendingUp, Star, ChevronRight } from 'lucide-react';

interface CalendarPost {
  weekNumber: number;
  publishDate: string;
  title: string;
  contentType: string;
  keywords: string[];
  seasonalRelevance: string;
  productTieIn: string;
  estimatedHours: number;
  priority: string;
  notes?: string;
}

interface KeyDate {
  date: string;
  event: string;
  contentOpportunity: string;
}

interface MonthlyGoals {
  totalPosts: number;
  pillarContent: number;
  productPosts: number;
  expectedTraffic: string;
  focusKeywords: string[];
}

interface CalendarData {
  month: string;
  year: number;
  seasonalThemes: string[];
  keyDates: KeyDate[];
  posts: CalendarPost[];
  monthlyGoals: MonthlyGoals;
}

interface ContentCalendarProps {
  onSelectPost?: (title: string, keywords: string[]) => void;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({ onSelectPost }) => {
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [postsPerWeek, setPostsPerWeek] = useState('3');
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setCalendar(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content-calendar', {
        body: { 
          month: parseInt(selectedMonth), 
          year: parseInt(selectedYear),
          postsPerWeek: parseInt(postsPerWeek)
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setCalendar(data.calendar);
      toast({
        title: "Calendar Generated!",
        description: `${data.calendar?.posts?.length || 0} posts planned for ${data.calendar?.month}.`,
      });

    } catch (error: any) {
      console.error('Error generating calendar:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content calendar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pillar': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'educational': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inspirational': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'product': return 'bg-green-100 text-green-700 border-green-200';
      case 'community': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority?.toLowerCase() === 'high') return <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />;
    return null;
  };

  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  // Group posts by week
  const postsByWeek = calendar?.posts?.reduce((acc, post) => {
    const week = post.weekNumber || 1;
    if (!acc[week]) acc[week] = [];
    acc[week].push(post);
    return acc;
  }, {} as Record<number, CalendarPost[]>) || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" />
          AI Content Calendar
        </CardTitle>
        <CardDescription>
          Auto-generate a strategic content calendar based on seasonal trends and optimal posting frequency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>

          <Select value={postsPerWeek} onValueChange={setPostsPerWeek}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Posts/week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 posts/week</SelectItem>
              <SelectItem value="3">3 posts/week</SelectItem>
              <SelectItem value="4">4 posts/week</SelectItem>
              <SelectItem value="5">5 posts/week</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Generate Calendar
              </>
            )}
          </Button>
        </div>

        {calendar && (
          <div className="space-y-4">
            {/* Seasonal Overview */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{calendar.month} {calendar.year} Overview</h3>
                <div className="flex gap-2">
                  {calendar.seasonalThemes?.map((theme, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Key Dates */}
              {calendar.keyDates?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {calendar.keyDates.map((kd, i) => (
                    <div key={i} className="text-xs bg-white/70 rounded px-2 py-1">
                      <span className="font-medium">{kd.date}:</span> {kd.event}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Monthly Goals */}
            {calendar.monthlyGoals && (
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-card border rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{calendar.monthlyGoals.totalPosts}</p>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
                <div className="p-3 bg-card border rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{calendar.monthlyGoals.pillarContent}</p>
                  <p className="text-xs text-muted-foreground">Pillar Content</p>
                </div>
                <div className="p-3 bg-card border rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{calendar.monthlyGoals.productPosts}</p>
                  <p className="text-xs text-muted-foreground">Product Posts</p>
                </div>
                <div className="p-3 bg-card border rounded-lg text-center">
                  <p className="text-sm font-medium">{calendar.monthlyGoals.expectedTraffic}</p>
                  <p className="text-xs text-muted-foreground">Expected Traffic</p>
                </div>
              </div>
            )}

            {/* Weekly Calendar */}
            <div className="space-y-4">
              {Object.entries(postsByWeek).map(([week, posts]) => (
                <div key={week} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 border-b">
                    <h4 className="font-medium text-sm">Week {week}</h4>
                  </div>
                  <div className="divide-y">
                    {posts.map((post, index) => (
                      <div 
                        key={index}
                        className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => onSelectPost?.(post.title, post.keywords)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getPriorityIcon(post.priority)}
                              <span className="text-xs text-muted-foreground">{post.publishDate}</span>
                              <Badge variant="outline" className={`text-xs ${getTypeColor(post.contentType)}`}>
                                {post.contentType}
                              </Badge>
                            </div>
                            <h5 className="font-medium text-sm mb-1">{post.title}</h5>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {post.keywords?.map((kw, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {kw}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{post.seasonalRelevance}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge variant="outline" className="text-xs mb-1 block">
                              {post.productTieIn}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {post.estimatedHours}h
                            </div>
                          </div>
                        </div>
                        {post.notes && (
                          <p className="text-xs text-muted-foreground mt-2 italic">{post.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Focus Keywords */}
            {calendar.monthlyGoals?.focusKeywords?.length > 0 && (
              <div className="p-3 border rounded-lg">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  FOCUS KEYWORDS THIS MONTH
                </h4>
                <div className="flex flex-wrap gap-1">
                  {calendar.monthlyGoals.focusKeywords.map((kw, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && !calendar && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Select a month and generate your AI content calendar</p>
            <p className="text-xs mt-1">Optimized for seasonal trends and posting frequency</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
