"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@repo/database";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowItem data={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
  );
};

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search workflows"
    />
  );
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        // Open modal (skipping cause I am not adding payments as of now)
        console.error(error);
      },
    });
  };
  return (
    <>
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();
  return (
    <EntityPagination
      disabled={workflows.isFetching}
      page={workflows.data.page}
      totalPages={workflows.data?.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading workflows" />;
};

export const WorkflowsError = () => {
  return <ErrorView message="Loading workflows" />;
};

export const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        // router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        // Open modal (skipping cause I am not adding payments as of now)
        console.error(error);
      },
    });
  };
  return (
    <>
      <EmptyView
        message="You havn't created any workflows yet.
        Get started by creating your first workflow"
        onNew={handleCreate}
      />
    </>
  );
};

export const WorkflowItem = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id });
  };
  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
        </>
      }
      image={
        <>
          <div className="size-8 flex items-center justify-center">
            <WorkflowIcon className="size-5 text-muted-foreground" />
          </div>
        </>
      }
      // actions={<p>actions</p>}
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
