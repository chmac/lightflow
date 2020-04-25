import { request } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/graphql"
    : "/graphql";

export const requestGraphql = (query: string, variables?: Variables) =>
  request(url, query, variables);
