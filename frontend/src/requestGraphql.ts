import { request } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/graphql"
    : "/graphql";

export const requestGraphql = <T extends any>(
  query: string,
  variables?: Variables
) => request<T>(url, query, variables);
