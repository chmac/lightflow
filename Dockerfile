FROM node:12-buster as builder

# Copy the built app
WORKDIR /usr/src/frontend
COPY frontend/package.json package.json
COPY frontend/public public
COPY frontend/src src
COPY frontend/tsconfig.json tsconfig.json
COPY frontend/yarn.lock yarn.lock

# Install our dependencies and build
RUN yarn install
RUN yarn build

# Go to the server working directory
WORKDIR /usr/src/server
COPY server/package.json package.json
COPY server/src src
COPY server/tsconfig.json tsconfig.json
COPY server/yarn.lock yarn.lock

# Install our dependencies and build
RUN yarn install
RUN yarn build

# We expose port 4000 as that's where the app runs by default
EXPOSE 4000

# ------------------------------------------------------------------------------
# From builder to production image
# ------------------------------------------------------------------------------

# Start over with a clean build
# We start again from the `-slim` container here, which we can't use for
# building, as it doesn't have all the required build dependencies.
FROM node:12-buster-slim

ENV NODE_ENV="production"

WORKDIR /usr/src/

COPY --from=builder /usr/src/frontend/build/ ./frontend/build/
COPY --from=builder /usr/src/server/dist/ ./server/dist/

CMD [ "node", "server/dist" ]
