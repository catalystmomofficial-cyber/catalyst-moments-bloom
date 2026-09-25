import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export const getSocialShareLinks = (title: string, url: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    // Facebook gets the public article URL for its Open Graph preview. The
    // quote is a best-effort title hint; Facebook still lets the member write
    // or edit their own caption before posting.
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    // LinkedIn's supported web share composer reads title, description, and
    // image from the article's Open Graph metadata.
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
};

export const SocialShareButtons = ({ title, url }: SocialShareButtonsProps) => {
  const shareLinks = getSocialShareLinks(title, url);

  const handleShare = (platform: string, link: string) => {
    const width = 640;
    const height = 640;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
    const popup = window.open(
      link,
      `${platform.toLowerCase()}-share`,
      `popup=yes,width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      toast.error(`Please allow pop-ups to share on ${platform}.`);
      return;
    }

    popup.opener = null;
    popup.focus();
    toast.success(`${platform} share is ready.`);
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
