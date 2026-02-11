import { Button } from "@/components/ui/button";
import { useCreateExecutionThroughManualTrigger } from "@/features/executions/hooks/use-executions";
import { FlaskConicalIcon } from "lucide-react";

//it will create the execute instance for a workflow

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const workflow = useCreateExecutionThroughManualTrigger();
  const handleClick = async () => {
    await workflow.mutate({ workflowId });
  };
  return (
    <Button
      size="lg"
      className="bg-primary/80 text-primary-foreground hover:bg-primary/90"
      aria-label="Execute workflow"
      title="Execute workflow"
      onClick={handleClick}
      disabled={workflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
