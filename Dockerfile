# syntax=docker/dockerfile:1

FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /src
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --only=production
COPY . .
CMD [ "node", "server.js" ]
