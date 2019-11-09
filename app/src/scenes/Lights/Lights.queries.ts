export const GetLights = `
query GetLights {
  lights {
    hueIndex
    name
    state {
      on
      reachable
      colormode
      brightness
      hue
      saturation
      xy
      xyAsHex
      colourTemperature
    }
  }
}
`;
