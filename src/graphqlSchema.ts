import { GraphQLServer } from "graphql-yoga";
import { Hue, Lamp, States } from "hue-hacking-node";

import { getLights } from "./utils";
import { goToColour } from "./mutations/goToColour";

const typeDefs = `
type LightState {
  on: Boolean!
  "The colour mode this lamp is currently set to. Only for lamps which support colours."
  colormode: String
  reachable: Boolean!
  "The Hue field \`bri\`, lamp brightness, from 0-255."
  brightness: Int
  hue: Int
  saturation: Int
  xy: [Float]
  "The Hue field \`ct\`, lamp colour temperature"
  colourTemperature: Int
}

type Light {
  hueIndex: Int!
  name: String!
  state: LightState!
}


type Query {
  lights(name: String): [Light]
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

type LightsArgs = {
  name?: string;
};

type GoToColourInputArgs = {
  hueIndexes: number[];
  colour: string;
  timeMinutes: number;
};

const getProp = name => val => val[name];

const makeResolvers = ({ hue }) => {
  return {
    LightState: {
      brightness: getProp("bri"),
      colourTemperature: getProp("ct"),
      saturation: getProp("sat")
    },
    Light: {
      hueIndex: (light: Lamp) => light.lampIndex
    },
    Query: {
      lights: async (root, args: LightsArgs) => {
        const { name } = args;
        const lights = await getLights();
        if (!!name) {
          return lights.filter(
            light => light.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
          );
        }
        return lights;
      }
    },
    Mutation: {
      goToColour: async (root, args: { input: GoToColourInputArgs }) => {
        const { hueIndexes, colour, timeMinutes } = args.input;
        return goToColour({ hue, hueIndexes, colour, timeMinutes });
      }
    }
  };
};

export const startServer = ({ hue }: { hue: Hue }) => {
  const resolvers = makeResolvers({ hue });

  const server = new GraphQLServer({ typeDefs, resolvers });

  server.start(() => {
    console.log("Server started on localhost:4000 #AUJVSy");
  });

  return server;
};
