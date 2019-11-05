export const getBridgeIp = async () => {
  const foundBridges: HueUPNPResponse[] = await Hue.search();

  if (foundBridges.length !== 1) {
    console.error("Failed to find bridges #t83u5l", foundBridges);
    throw new Error("Failed to find exactly one bridge #JMvJyo");
  }

  return foundBridges[0].internalipaddress;
};

let hue: Hue;

export const getHue = async () => {
  if (!hue) {
    const ip = await getBridgeIp();
    hue = new Hue({
      ip,
      key: HUE_USERNAME
    });
  }

  return hue;
};

let lamps: Lamp[];

export const getLamps = async () => {
  const hue = await getHue();
  if (!lamps) {
    lamps = await hue.getLamps();
  }
  return lamps;
};
