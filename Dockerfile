FROM node:10.20.1-alpine3.11
# Env
ENV NODE_ENV test

# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .
# Install all Packages
RUN npm install
RUN npm run vcheck
# Copy all other source code to work directory
COPY . .
# TypeScript
RUN npm run build
EXPOSE 8082

# Start
CMD [ "npm", "start" ]