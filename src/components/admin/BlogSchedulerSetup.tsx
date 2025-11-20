import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const BlogSchedulerSetup = () => {
  const [cronJobExists, setCronJobExists] = useState(false);
  const [checking, setChecking] = useState(true);

  const sqlQuery = `SELECT cron.schedule(
  'publish-scheduled-blogs-hourly',
  '0 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://moxxceccaftkeuaowctw.supabase.co/functions/v1/publish-scheduled-blogs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U"}'::jsonb
    ) as request_id;
  $$
);`;

  useEffect(() => {
    checkCronJob();
  }, []);

  const checkCronJob = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_blogs', { 
        search_query: null, 
        page_number: 1, 
        page_size: 1 
      });
      
      // If we can query, try to check for cron jobs
      // Note: This is a simple check - actual verification requires SQL Editor access
      setCronJobExists(false);
    } catch (error) {
      console.error('Error checking cron job:', error);
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery);
    toast.success('SQL query copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <CardTitle>Automatic Blog Scheduler</CardTitle>
        </div>
        <CardDescription>
          Automatically publish scheduled blog posts every hour
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!checking && !cronJobExists && (
          <Alert>
            <AlertDescription>
              To enable automatic publishing of scheduled blogs, you need to set up a cron job in Supabase.
            </AlertDescription>
          </Alert>
        )}

        {cronJobExists && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              Automatic blog scheduling is active! Scheduled posts will be published every hour.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Click the "Open SQL Editor" button below</li>
            <li>Copy the SQL query and paste it into the SQL Editor</li>
            <li>Click "Run" to create the cron job</li>
            <li>The job will run every hour at minute 0 (e.g., 1:00, 2:00, 3:00)</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => window.open('https://supabase.com/dashboard/project/moxxceccaftkeuaowctw/sql/new', '_blank')}
            className="flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open SQL Editor
          </Button>
          <Button
            variant="outline"
            onClick={copyToClipboard}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy SQL
          </Button>
        </div>

        <div className="bg-muted p-3 rounded-md">
          <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
            {sqlQuery}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm">How to Schedule a Blog Post:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Create or edit a blog post in draft status</li>
            <li>Click the "Schedule" button in the blog preview</li>
            <li>Select a future date and time</li>
            <li>The post will automatically publish at the scheduled time</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
