import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  return (
    <Button
      size="lg"
      className="bg-primary/80 text-primary-foreground hover:bg-primary/90"
      aria-label="Execute workflow"
      title="Execute workflow"
      onClick={() => {}}
      disabled={false}
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
