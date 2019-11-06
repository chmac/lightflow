import { GraphQLServer } from "graphql-yoga";

// import { Settings, Actions } from "./data";
import { getLights, getHue } from "./utils";
import { toColour } from "./toColour";
import { startTransitionToColour } from "./actions";

const typeDefs = `
type LightState {
  on: Boolean!
  "The colour mode this lamp is currently set to. Only for lamps which support colours."
  colormode: String
  reachable: Boolean!
}

type Light {
  hueIndex: Int!
  name: String!
  state: LightState!
}

type Query {
  lights: [Light]
}

input GoToColourInput {
  """
  The Hue provided indexes of the lights to control.
  """
  hueIndexes: [Int!]
  "The colour (a name, like red, blue, etc)"
  colour: String!
  "The time the transition should take"
  timeMinutes: Int!
}
type GoToColourResponse {
  """
  This indicates that the request succeeded, and that the operation has
  started.
  """
  success: Boolean
}

input GoToBrightnessInput {
  """
  The Hue provided indexes of the lights to control.
  """
  hueIndexes: [Int!]
  """
  The brightness this bulb should end up at, from 0 to 255.
  NOTE: A brightness of 0 does not turn off the light.
  """
  brightness: Int!
  "The time the transition should take"
  timeMinutes: Int!
}

type GoToBrightnessResponse {
  """
  This indicates that the request succeeded, and that the operation has
  started.
  """
  success: Boolean
}

type Mutation {
  goToColour(input: GoToColourInput!): GoToColourResponse
  goToBrightness(input: GoToBrightnessInput!): GoToBrightnessResponse
}
`;

type GoToColourInputArgs = {
  hueIndexes: number[];
  colour: string;
  timeMinutes: number;
};

const makeResolvers = ({ hue }) => {
  return {
    Query: {
      lights: getLights
    },
    Mutation: {
      goToColour: async (root, args: { input: GoToColourInputArgs }) => {
        const { hueIndexes, colour, timeMinutes } = args.input;

        const results = await Promise.all(
          hueIndexes.map(index => {
            return startTransitionToColour({
              index,
              colour,
              timeMinutes,
              hue
            });
          })
        );
        return {
          // Only return `true` if all operations were successful
          success: results.find(result => !result) || true,
          results
        };
      }
    }
  };
};

const start = async () => {
  const hue = await getHue();

  const resolvers = makeResolvers({ hue });

  const server = new GraphQLServer({ typeDefs, resolvers });
  server.start(() => {
    console.log("Server started on localhost:4000 #AUJVSy");
  });

  // tick()
  // hue.setColor(6, "00ff00");
};

start();
