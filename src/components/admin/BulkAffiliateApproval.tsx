import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users } from "lucide-react";

export const BulkAffiliateApproval = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const { toast } = useToast();

  const handleApproveAll = async () => {
    setIsApproving(true);
    try {
      const { data, error } = await supabase.rpc('approve_all_pending_affiliates');
      
      if (error) {
        console.error('Error approving affiliates:', error);
        toast({
          title: "Error",
          description: "Failed to approve affiliate applications. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const count = data?.[0]?.updated_count || 0;
      setApprovedCount(count);
      
      toast({
        title: "Success",
        description: `Approved ${count} pending affiliate applications.`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Affiliate Approval
        </CardTitle>
        <CardDescription>
          Approve all pending affiliate applications at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvedCount !== null && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Successfully approved {approvedCount} affiliate applications
            </span>
          </div>
        )}
        
        <Button 
          onClick={handleApproveAll}
          disabled={isApproving}
          size="lg"
          className="w-full"
        >
          {isApproving ? "Approving..." : "Approve All Pending Applications"}
        </Button>
        
        <p className="text-sm text-muted-foreground">
          This action will approve all pending affiliate applications and send confirmation notifications to applicants.
        </p>
      </CardContent>
    </Card>
  );
};