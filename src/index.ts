import { GraphQLServer } from "graphql-yoga";

// import { Settings, Actions } from "./data";
import { getLamps } from "./utils";

const typeDefs = `
type LampState {
  on: Boolean!
  "The colour mode this lamp is currently set to. Only for lamps which support colours."
  colormode: String
  reachable: Boolean!
}
type Lamp {
  index: Int!
  name: String!
  state: LampState!
}
type Query {
  lamps: [Lamp]
}
input SetColourInput {
  "The Hue bridge index for this lamp"
  index: Int!
  "The colour (a name, like red, blue, etc)"
  colour: String!
}
type SetColourResponse {
  """
  This indicates that the request succeeded, but not that the Hue bridge
  actually successfully processed the update.
  """
  success: Boolean
}
type Mutation {
  setColour(input: SetColourInput!): SetColourResponse
}
`;

const resolvers = {
  Query: {
    lamps: getLamps
  },
  Mutation: {
    setColour: async (root, args) => {
      return {
        success: true
      };
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("Server started on localhost:4000 #AUJVSy");
});
