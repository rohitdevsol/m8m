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
  useRemoveCredential,
  useSuspenseCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";
import type { Credential } from "@repo/database";
import { CredentialType } from "@/config/node-types";
import Image from "next/image";
import { CredentialForm } from "./credential-form";

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/openai.svg",
  [CredentialType.ANTHROPIC]: "/anthropic.svg",
  [CredentialType.GEMINI]: "/gemini.svg",
};

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

export const CredentialHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Credentials"
        description="Create and manage your credentials"
        newButtonHref="credentials/new"
        newButtonLabel="New credential"
        disabled={disabled}
      />
    </>
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();
  return (
    <EntityPagination
      disabled={credentials.isFetching}
      page={credentials.data.page}
      totalPages={credentials.data?.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials" />;
};

export const CredentialsError = () => {
  return <ErrorView message="Loading credentials" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();
  const handleCreate = () => {
    router.push("/credentials/new");
  };
  return (
    <>
      <EmptyView
        message="You havn't created any credentials yet.
        Get started by creating your first credential"
        onNew={handleCreate}
      />
    </>
  );
};

export const CredentialItem = ({
  data,
}: {
  data: Omit<Credential, "userId" | "value">;
}) => {
  const removeCredential = useRemoveCredential();
  const logo = credentialLogos[data.type] || "/openai.svg";

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };
  return (
    <EntityItem
      href={`/credentials/${data.id}`}
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
            <Image src={logo} alt={data.type} width={20} height={20} />
          </div>
        </>
      }
      // actions={<p>actions</p>}
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
};
