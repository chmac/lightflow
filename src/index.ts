import { GraphQLServer } from "graphql-yoga";

// import { Settings, Actions } from "./data";

const typeDefs = `
type Lamp {
  index: Int!
  name: String!
}
type Query {
  lamps: [Lamp]
}
`;

const resolvers = {
  Query: {
    lamps: (root, args) => {
      return [{ index: "1", name: "foo" }, { index: "2", name: "bar" }];
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("Server started on localhost:4000 #AUJVSy");
});
