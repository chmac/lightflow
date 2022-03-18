# lightflow

- Smooth lighting transitions with hue lights.
- Transition light colours and brightnesses gradually.
- Set a target brightness or colour, transition time, and let fly...

## Usage

Firstly, follow the [Hue developer
instructions](https://developers.meethue.com/develop/get-started-2/). Create a
new "app" on your bridge and save the `username` it generates for you.

Then run the `chmac/lightflow` docker container on the same network as your hue
bridge. It runs on port `4000`. If you're using docker-compose, this should be enough:

```yaml
version: "3.8"

services:
  lightflow:
    image: chmac/lightflow
    environment:
      - HUE_IP=192.168.0.XXX
    restart: unless-stopped
    ports:
      - "4000:4000"
```

### Advanced

Some aspects of the application can be controlled via environment variables set
via docker.

- If you have more than 1 bridge on your network, or if your bridge has had
multiple IP addresses, the server will log an error on startup. Figure out the
IP of your hue bridge (see the hue docs above) and then set it in `HUE_IP`.
- To enable debugging on the graphql server set `DEBUG_GRAPHQL` to a string.
- To enable debugging of the application set `DEBUG` TO `*` or `lightflow:*`.
