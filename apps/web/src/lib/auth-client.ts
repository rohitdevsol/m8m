import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
export const authClient = createAuthClient({
  //you can pass client configuration here
  //no need for base url as we are on the same server
});
