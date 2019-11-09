import { request } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

const url = "http://localhost:4000/";

export const requestGraphql = (query: string, variables?: Variables) =>
  request(url, query, variables);
