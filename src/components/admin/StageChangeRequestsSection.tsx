import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface StageRequest {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  current_stage: string | null;
  requested_stage: string;
  reason: string | null;
  created_at: string;
}

const stageLabel = (s: string | null) => {
  switch (s) {
    case "ttc": return "Trying to Conceive";
    case "pregnancy":
    case "pregnant": return "Pregnant";
    case "postpartum": return "Postpartum";
    case "none": return "Not specified";
    default: return s || "—";
  }
};

export const StageChangeRequestsSection = () => {
  const [requests, setRequests] = useState<StageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_pending_stage_change_requests" as any);
    if (error) {
      toast.error(error.message);
    } else {
      setRequests((data as StageRequest[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const review = async (id: string, decision: "approved" | "rejected") => {
    setActioningId(id);
    const { error } = await supabase.rpc("review_stage_change" as any, {
      p_request_id: id,
      p_decision: decision,
      p_notes: null,
    });
    setActioningId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Request ${decision}`);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Stage Change Requests
            {requests.length > 0 && (
              <Badge variant="secondary">{requests.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Approve or reject users requesting to switch their motherhood stage.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No pending stage change requests.
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {r.display_name || r.email || r.user_id}
                  </div>
                  {r.email && r.display_name && (
                    <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                    <Badge variant="outline">{stageLabel(r.current_stage)}</Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge>{stageLabel(r.requested_stage)}</Badge>
                  </div>
                  {r.reason && (
                    <p className="text-sm text-muted-foreground mt-2 break-words">
                      <span className="font-medium">Reason:</span> {r.reason}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col sm:w-auto">
                  <Button
                    size="sm"
                    onClick={() => review(r.id, "approved")}
                    disabled={actioningId === r.id}
                    className="flex-1 sm:flex-none"
                  >
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => review(r.id, "rejected")}
                    disabled={actioningId === r.id}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StageChangeRequestsSection;
