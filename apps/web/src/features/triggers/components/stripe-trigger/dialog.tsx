"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params["workflowId"] as string;

  //constructing the webhook URL

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const webhookURL = `${baseURL}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookURL);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy webhook URL to clipboard");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe Dashboard to trigger this
            workflow on payment events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                className="font-mono text-sm"
                id="webhook-url"
                value={webhookURL}
                readOnly
              />
              <Button
                type="button"
                size={"icon"}
                variant={"outline"}
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers → Webhooks</li>
              <li>Click "Add endpoint"</li>
              <li>Paste the webhook URL above</li>
              <li>
                Select events to listen for (e.g, payment_intent.succeeded)
              </li>
              <li>Save and copy the signing secret</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-3 text-sm">
            <h4 className="font-medium">Available Variables (Stripe)</h4>

            <ul className="space-y-1 text-muted-foreground">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.id}}"}
                </code>
                — Charge ID
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>
                — Amount (in cents)
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>
                — Currency (usd, inr, etc.)
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.status}}"}
                </code>
                — Payment status
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.paid}}"}
                </code>
                — Payment success (true/false)
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.receipt_url}}"}
                </code>
                — Receipt link
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.description}}"}
                </code>
                — Payment description
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.created}}"}
                </code>
                — Created timestamp
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.meta.eventType}}"}
                </code>
                — Stripe event type
              </li>

              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.meta.eventId}}"}
                </code>
                — Stripe event ID
              </li>
            </ul>

            <div className="pt-2 text-xs text-muted-foreground border-t">
              💡 Tip: Access any nested field using dot notation, e.g.
              <code className="ml-1 bg-background px-1 rounded">
                {"{{stripe.outcome.risk_level}}"}
              </code>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
