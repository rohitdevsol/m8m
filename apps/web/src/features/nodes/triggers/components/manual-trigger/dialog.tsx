"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            Configure the settings for the manual trigger node.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <p>Name : manual</p>
          <p className="text-muted-foreground">
            Used to manually configure a workflow, no configuration available
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
