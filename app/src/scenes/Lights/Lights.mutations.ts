export const GoToBrightness = `
mutation GoToBrightness($input: GoToBrightnessInput!) {
  goToBrightness(input: $input) {
    success
  }
}
`;
