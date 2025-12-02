import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { BlogTopicSuggestions } from './BlogTopicSuggestions';
import { CompetitorAnalysis } from './CompetitorAnalysis';

export const BlogPostGenerator = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional yet friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedPost, setLastGeneratedPost] = useState<any>(null);
  const { toast } = useToast();

  const handleSelectTopic = (title: string, keywords: string[]) => {
    setTopic(title);
    setKeywords(keywords.join(', '));
    toast({
      title: "Topic Selected",
      description: "Topic and keywords applied. Click generate when ready!",
    });
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a blog post topic.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setLastGeneratedPost(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-post', {
        body: {
          topic: topic.trim(),
          keywords: keywords.trim(),
          tone
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setLastGeneratedPost(data.blog);
      
      toast({
        title: "Success!",
        description: "Blog post generated and saved as draft. Opening preview...",
      });

      // Navigate to preview page
      navigate(`/blog-preview?id=${data.blog.id}`);

      // Reset form
      setTopic('');
      setKeywords('');
      setTone('professional yet friendly');

    } catch (error: any) {
      console.error('Error generating blog post:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate blog post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <CompetitorAnalysis onSelectGap={handleSelectTopic} />
      
      <BlogTopicSuggestions onSelectTopic={handleSelectTopic} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Blog Post Generator
          </CardTitle>
          <CardDescription>
            Generate SEO-optimized blog posts automatically using Lovable AI (Gemini)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Blog Post Topic *</Label>
            <Input
              id="topic"
              placeholder="e.g., Postpartum Recovery: 10 Essential Tips for New Moms"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
            <Textarea
              id="keywords"
              placeholder="e.g., postpartum recovery, new mom tips, pelvic floor exercises"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isGenerating}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add keywords for SEO optimization
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional yet friendly">Professional yet Friendly</SelectItem>
                <SelectItem value="warm and supportive">Warm and Supportive</SelectItem>
                <SelectItem value="energetic and motivational">Energetic and Motivational</SelectItem>
                <SelectItem value="calm and reassuring">Calm and Reassuring</SelectItem>
                <SelectItem value="informative and educational">Informative and Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !topic.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Blog Post...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate & Publish Blog Post
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {lastGeneratedPost && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Blog Post Published Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Title:</p>
              <p className="font-medium">{lastGeneratedPost.title}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Slug:</p>
              <p className="text-sm font-mono">{lastGeneratedPost.slug}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Excerpt:</p>
              <p className="text-sm">{lastGeneratedPost.excerpt}</p>
            </div>
            {lastGeneratedPost.tags && lastGeneratedPost.tags.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Tags:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {lastGeneratedPost.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
