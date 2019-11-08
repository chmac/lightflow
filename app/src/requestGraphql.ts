import { request } from "graphql-request";

const url = "http://localhost:4000/";

export const requestGraphql = (query: string) => request(url, query);
