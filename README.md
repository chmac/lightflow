## lightflow

- Smooth lighting transitions with hue lights.
- Transition light colours and brightnesses gradually.
- Set a target brightness or colour, transition time, and let fly...

Create a config file at `server/src/config/private.ts` which looks like this:

```typescript
export const HUE_USERNAME = "GET_ME_FROM_THE_HUE_DOCS";

export const STEP_INTERVAL_MS = 10 * 1e3; // seconds
```

To start run `./build.sh`.

Then run `node server/build/`

Lightflow should now be running on port 4000.

If you really want to use this and have challenges, open an issue here and I'll
do what I can to help out.
