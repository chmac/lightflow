FROM node:10

# Copy the built app
WORKDIR /usr/src/app/frontend
COPY frontend/build ./build/

# Go to the server working directory
WORKDIR /usr/src/app/server

COPY server/build ./build/

# Copy the package.json and yarn.lock
COPY server/package.json ./
COPY server/yarn.lock ./

# Install our dependencies
RUN yarn install --production

# We expose port 4000 as that's where the app runs by default
EXPOSE 4000

CMD [ "node", "build/" ]
