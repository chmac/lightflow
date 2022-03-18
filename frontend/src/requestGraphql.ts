import { GraphQLClient } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

const KEY = `HUE_USERNAME`;

export const getHueUsername = () => {
  const HUE_USERNAME = globalThis.localStorage.getItem(KEY);
  if (typeof HUE_USERNAME === "string" && HUE_USERNAME.length > 0) {
    return HUE_USERNAME;
  }

  return "";
};

export const setHueUsername = (HUE_USERNAME: string) => {
  globalThis.localStorage.setItem(KEY, HUE_USERNAME);
};

export const removeHueUsername = () => {
  globalThis.localStorage.removeItem(KEY);
};

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/graphql"
    : "/graphql";

const client = new GraphQLClient(url, {
  headers: {
    Authorization: getHueUsername(),
  },
});

export const requestGraphql = <T extends any>(
  query: string,
  variables?: Variables
) => client.request<T>(query, variables);
