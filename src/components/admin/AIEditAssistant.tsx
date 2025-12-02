import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, Loader2, Wand2, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIEditAssistantProps {
  content: string;
  onApplyEdit: (newContent: string) => void;
}

const quickActions = [
  { label: 'Fix grammar & spelling', instruction: 'Fix all grammar and spelling errors while keeping the content the same' },
  { label: 'Make it shorter', instruction: 'Condense this content to be more concise while keeping the key points' },
  { label: 'Make it more engaging', instruction: 'Rewrite to be more engaging and compelling with better hooks and power words' },
  { label: 'Add a CTA', instruction: 'Add a compelling call-to-action at the end that encourages readers to try our Birth Ball Guide or explore our wellness programs' },
  { label: 'Improve SEO', instruction: 'Optimize the content for SEO by improving headings, adding relevant keywords naturally, and improving readability' },
  { label: 'Remove first paragraph', instruction: 'Remove the first paragraph completely' },
];

export const AIEditAssistant: React.FC<AIEditAssistantProps> = ({ content, onApplyEdit }) => {
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [originalContent] = useState(content);

  const handleAIEdit = async (editInstruction: string) => {
    if (!editInstruction.trim()) {
      toast.error('Please enter an editing instruction');
      return;
    }

    setIsProcessing(true);
    setPreviewContent(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-edit-blog', {
        body: { content, instruction: editInstruction }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.editedContent) {
        setPreviewContent(data.editedContent);
        toast.success('Edit generated! Review and apply when ready.');
      }
    } catch (error: any) {
      console.error('AI edit error:', error);
      toast.error(error.message || 'Failed to process edit request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (previewContent) {
      onApplyEdit(previewContent);
      setPreviewContent(null);
      setInstruction('');
      toast.success('Edit applied!');
    }
  };

  const handleDiscard = () => {
    setPreviewContent(null);
    toast.info('Edit discarded');
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Edit Assistant
        </CardTitle>
        <CardDescription>
          Describe what you want to change and AI will edit your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Quick Actions</label>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Badge
                key={action.label}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => !isProcessing && handleAIEdit(action.instruction)}
              >
                {action.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Custom Instruction */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Or describe your edit</label>
          <Textarea
            placeholder="e.g., 'Remove the section about meal planning' or 'Rewrite the introduction to be more personal'"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={isProcessing}
            rows={3}
            className="resize-none"
          />
          <Button
            onClick={() => handleAIEdit(instruction)}
            disabled={isProcessing || !instruction.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Apply AI Edit
              </>
            )}
          </Button>
        </div>

        {/* Preview Section */}
        {previewContent && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">Edit Preview Ready</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleDiscard}>
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Discard
                </Button>
                <Button size="sm" onClick={handleApply}>
                  Apply Edit
                </Button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-md border bg-background p-3">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
