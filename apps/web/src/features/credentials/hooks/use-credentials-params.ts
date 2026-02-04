import { useQueryStates } from "nuqs";
import { credentialParams } from "../params";

export const useCredentialsParams = () => {
  return useQueryStates(credentialParams);
};
