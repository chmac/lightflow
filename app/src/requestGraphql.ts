import { request } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

const url = "/graphql";

export const requestGraphql = (query: string, variables?: Variables) =>
  request(url, query, variables);
