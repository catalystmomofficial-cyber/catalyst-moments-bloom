import React from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostPreviewProps {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImageUrl?: string;
  tags?: string[];
  publishedAt?: string;
}

export const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  title,
  content,
  excerpt,
  author,
  featuredImageUrl,
  tags,
  publishedAt,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        {featuredImageUrl && (
          <div className="w-full h-64 overflow-hidden">
            <img 
              src={featuredImageUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl">{title || 'Untitled Post'}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {publishedAt 
                  ? format(new Date(publishedAt), 'MMM d, yyyy')
                  : format(new Date(), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {excerpt && (
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
              {excerpt}
            </p>
          )}
          
          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(content) 
            }}
          />

          {tags && tags.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  tag.trim() && (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
