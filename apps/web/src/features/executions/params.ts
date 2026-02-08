import { parseAsInteger, parseAsString } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

export const executionParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),

  pageSize: parseAsInteger.withDefault(6).withOptions({ clearOnDefault: true }),
};
/* if http://localhost:3000/workflows?page=1 .. then do not show ?page=1 (its default)
    make it just => http://localhost:3000/workflows
*/
/* if http://localhost:3000/workflows?search= .. in case you removed the search (remove that field)
    make it just => http://localhost:3000/workflows
*/
