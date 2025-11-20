import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export const SocialShareButtons = ({ title, url, description }: SocialShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
  };

  const handleShare = (platform: string, link: string) => {
    window.open(link, '_blank', 'width=600,height=400');
    toast.success(`Sharing on ${platform}!`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center gap-2 py-4 border-y border-border">
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('Facebook', shareLinks.facebook)}
        className="gap-2"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('Twitter', shareLinks.twitter)}
        className="gap-2"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('LinkedIn', shareLinks.linkedin)}
        className="gap-2"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
        aria-label="Copy link"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Copy</span>
      </Button>
    </div>
  );
};
