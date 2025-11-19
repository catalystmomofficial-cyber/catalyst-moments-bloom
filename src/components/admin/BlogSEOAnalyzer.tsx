import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BlogSEOAnalyzerProps {
  title: string;
  content: string;
  excerpt: string;
  keywords?: string[];
}

interface SEOScore {
  score: number;
  level: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  suggestions: string[];
}

export function BlogSEOAnalyzer({ title, content, excerpt, keywords = [] }: BlogSEOAnalyzerProps) {
  // Calculate title score
  const getTitleScore = (): SEOScore => {
    const length = title.length;
    const suggestions: string[] = [];
    let score = 100;

    if (length < 30) {
      score -= 30;
      suggestions.push('Title is too short. Aim for 50-60 characters for better SEO.');
    } else if (length < 50) {
      score -= 15;
      suggestions.push('Title could be longer. Optimal length is 50-60 characters.');
    } else if (length > 60) {
      score -= 20;
      suggestions.push('Title is too long. It may be cut off in search results. Keep it under 60 characters.');
    }

    if (!/[0-9]/.test(title) && !/[?!]/.test(title)) {
      score -= 10;
      suggestions.push('Consider adding a number or question mark to increase click-through rate.');
    }

    return {
      score,
      level: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor',
      suggestions
    };
  };

  // Calculate meta description score
  const getMetaDescriptionScore = (): SEOScore => {
    const length = excerpt.length;
    const suggestions: string[] = [];
    let score = 100;

    if (length < 120) {
      score -= 30;
      suggestions.push('Meta description is too short. Aim for 150-160 characters.');
    } else if (length < 140) {
      score -= 15;
      suggestions.push('Meta description could be longer. Optimal length is 150-160 characters.');
    } else if (length > 160) {
      score -= 20;
      suggestions.push('Meta description is too long. It may be cut off in search results.');
    }

    if (!keywords.some(kw => excerpt.toLowerCase().includes(kw.toLowerCase()))) {
      score -= 20;
      suggestions.push('Include target keywords in the meta description.');
    }

    return {
      score,
      level: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor',
      suggestions
    };
  };

  // Calculate keyword density
  const getKeywordDensityScore = (): SEOScore => {
    const suggestions: string[] = [];
    let score = 100;

    // Remove HTML tags for word count
    const textContent = content.replace(/<[^>]*>/g, ' ');
    const words = textContent.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const totalWords = words.length;

    if (keywords.length === 0) {
      score = 0;
      suggestions.push('No keywords defined. Add target keywords to analyze density.');
      return { score, level: 'poor', suggestions };
    }

    const keywordStats = keywords.map(keyword => {
      const kwLower = keyword.toLowerCase();
      const count = words.filter(w => w.includes(kwLower)).length;
      const density = (count / totalWords) * 100;
      return { keyword, count, density };
    });

    keywordStats.forEach(({ keyword, count, density }) => {
      if (count === 0) {
        score -= 20;
        suggestions.push(`Keyword "${keyword}" not found in content. Consider adding it naturally.`);
      } else if (density < 0.5) {
        score -= 10;
        suggestions.push(`Low density for "${keyword}" (${density.toFixed(2)}%). Aim for 1-2%.`);
      } else if (density > 3) {
        score -= 15;
        suggestions.push(`Keyword "${keyword}" appears too often (${density.toFixed(2)}%). Risk of keyword stuffing.`);
      }
    });

    return {
      score: Math.max(0, score),
      level: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor',
      suggestions
    };
  };

  // Calculate content structure score
  const getContentStructureScore = (): SEOScore => {
    const suggestions: string[] = [];
    let score = 100;

    const h2Count = (content.match(/<h2>/gi) || []).length;
    const h3Count = (content.match(/<h3>/gi) || []).length;
    const paragraphCount = (content.match(/<p>/gi) || []).length;
    const listCount = (content.match(/<ul>|<ol>/gi) || []).length;
    const linkCount = (content.match(/<a /gi) || []).length;
    const imageCount = (content.match(/<img /gi) || []).length;

    if (h2Count < 2) {
      score -= 20;
      suggestions.push('Add more H2 headings (at least 2-3) to improve content structure.');
    }

    if (paragraphCount < 5) {
      score -= 15;
      suggestions.push('Content seems short. Aim for at least 1000 words for better SEO.');
    }

    if (listCount === 0) {
      score -= 10;
      suggestions.push('Add bullet points or numbered lists to improve readability.');
    }

    if (linkCount < 2) {
      score -= 10;
      suggestions.push('Add internal or external links to provide more value to readers.');
    }

    if (imageCount === 0) {
      score -= 10;
      suggestions.push('Add images with descriptive alt text to improve engagement.');
    }

    return {
      score: Math.max(0, score),
      level: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor',
      suggestions
    };
  };

  const titleScore = getTitleScore();
  const metaScore = getMetaDescriptionScore();
  const keywordScore = getKeywordDensityScore();
  const structureScore = getContentStructureScore();

  const overallScore = Math.round(
    (titleScore.score + metaScore.score + keywordScore.score + structureScore.score) / 4
  );

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs-improvement': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'needs-improvement': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          SEO Analysis
          <Badge variant={overallScore >= 80 ? 'default' : overallScore >= 60 ? 'secondary' : 'destructive'}>
            {overallScore}/100
          </Badge>
        </CardTitle>
        <CardDescription>
          Optimize your blog post for better search engine rankings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Overall SEO Score</span>
            <span className="text-sm text-muted-foreground">{overallScore}%</span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>

        {/* Title Analysis */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getScoreIcon(titleScore.level)}
              <span className="font-medium">Title Optimization</span>
            </div>
            <span className={`text-sm font-semibold ${getScoreColor(titleScore.level)}`}>
              {titleScore.score}/100
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Length: {title.length} characters (optimal: 50-60)
          </p>
          {titleScore.suggestions.length > 0 && (
            <Alert>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {titleScore.suggestions.map((s, i) => (
                    <li key={i} className="text-sm">{s}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Meta Description Analysis */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getScoreIcon(metaScore.level)}
              <span className="font-medium">Meta Description</span>
            </div>
            <span className={`text-sm font-semibold ${getScoreColor(metaScore.level)}`}>
              {metaScore.score}/100
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Length: {excerpt.length} characters (optimal: 150-160)
          </p>
          {metaScore.suggestions.length > 0 && (
            <Alert>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {metaScore.suggestions.map((s, i) => (
                    <li key={i} className="text-sm">{s}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Keyword Density */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getScoreIcon(keywordScore.level)}
              <span className="font-medium">Keyword Optimization</span>
            </div>
            <span className={`text-sm font-semibold ${getScoreColor(keywordScore.level)}`}>
              {keywordScore.score}/100
            </span>
          </div>
          {keywordScore.suggestions.length > 0 && (
            <Alert>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {keywordScore.suggestions.map((s, i) => (
                    <li key={i} className="text-sm">{s}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Content Structure */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getScoreIcon(structureScore.level)}
              <span className="font-medium">Content Structure</span>
            </div>
            <span className={`text-sm font-semibold ${getScoreColor(structureScore.level)}`}>
              {structureScore.score}/100
            </span>
          </div>
          {structureScore.suggestions.length > 0 && (
            <Alert>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {structureScore.suggestions.map((s, i) => (
                    <li key={i} className="text-sm">{s}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
