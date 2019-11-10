export const GoToBrightness = `
mutation GoToBrightness($input: GoToBrightnessInput!) {
  goToBrightness(input: $input) {
    success
  }
}
`;

export const GoToColour = `
mutation GoToBrightness($input: GoToColourInput!) {
  goToColour(input: $input) {
    success
  }
}
`;
