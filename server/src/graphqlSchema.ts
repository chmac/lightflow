import { GraphQLServer } from "graphql-yoga";
import { Hue, Lamp, XYPoint } from "hue-hacking-node";
import express from "express";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import path from "path";

import { getLights } from "./utils";
import { goToColour } from "./mutations/goToColour";
import { goToBrightness } from "./mutations/goToBrightness";
import { getLog } from "./log";

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
  xyAsHex: String
  "The Hue field \`ct\`, lamp colour temperature"
  colourTemperature: Int
}

type Light {
  hueIndex: Int!
  name: String!
  state: LightState!
}

type LogMessage {
  time: Int!
  message: String!
  params: String
}


type Query {
  lights(name: String): [Light]
  xyToRGB(x: Float!, y: Float!): String!
  log: [LogMessage]
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

type RestartResponse {
  """
  This indicates that the request succeeded, and that the server will restart
  in 1 second (to ensure this request has completed first).
  """
  success: Boolean
}

type Mutation {
  goToColour(input: GoToColourInput!): GoToColourResponse
  goToBrightness(input: GoToBrightnessInput!): GoToBrightnessResponse
  restart: RestartResponse
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

type GoToBrightnessInputArgs = {
  hueIndexes: number[];
  brightness: number;
  timeMinutes: number;
};

const getProp = (name) => (val) => val[name];

const assertHueIndexes = (hueIndexes: number[]) => {
  if (hueIndexes.length === 0) {
    throw new Error("You must provide at least 1 hueIndex value #I4Qlbd.");
  }
};

const makeResolvers = ({ hue }: { hue: Hue }) => {
  return {
    LightState: {
      brightness: getProp("bri"),
      colourTemperature: getProp("ct"),
      saturation: getProp("sat"),
      xyAsHex: (state) =>
        !!state.xy ? hue.colors.CIE1931ToHex(new XYPoint(...state.xy)) : null,
    },
    Light: {
      hueIndex: (light: Lamp) => light.lampIndex,
    },
    Query: {
      xyToRGB: (root, { x, y }: { x: number; y: number }) => {
        return hue.colors.CIE1931ToHex(new XYPoint(x, y));
      },
      lights: async (root, args: LightsArgs) => {
        const { name } = args;
        const lights = await getLights();
        if (!!name) {
          return lights.filter(
            (light) =>
              light.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
          );
        }
        return lights;
      },
      log: (root) => {
        return getLog();
      },
    },
    Mutation: {
      goToColour: async (root, args: { input: GoToColourInputArgs }) => {
        const { hueIndexes, colour, timeMinutes } = args.input;
        assertHueIndexes(hueIndexes);
        return goToColour({ hue, hueIndexes, colour, timeMinutes });
      },
      goToBrightness: async (
        root,
        args: { input: GoToBrightnessInputArgs }
      ) => {
        const { hueIndexes, brightness, timeMinutes } = args.input;
        assertHueIndexes(hueIndexes);
        return goToBrightness({ hue, hueIndexes, brightness, timeMinutes });
      },
      restart: () => {
        setTimeout(() => {
          restartServer();
        }, 1e3);
        return { success: true };
      },
    },
  };
};

export const startServer = async ({ hue }: { hue: Hue }) => {
  const resolvers = makeResolvers({ hue });

  const server = new GraphQLServer({ typeDefs, resolvers });

  server.express.use(
    express.static(path.join(__dirname, "../../frontend/build"))
  );

  server.express.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  });

  await server.start(
    {
      endpoint: "/graphql",
      playground: "/graphiql",
    },
    () => {
      console.log("Server started on localhost:4000 #AUJVSy");
    }
  );
};

export const restartServer = () => {
  process.exit();
};
