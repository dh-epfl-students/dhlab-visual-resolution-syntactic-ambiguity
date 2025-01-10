FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy app source
COPY ./app /usr/src/app

# Install dependencies and build the app
RUN yarn install
RUN yarn run build

# Set startup command
CMD ["yarn", "start"]
