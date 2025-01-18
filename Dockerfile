# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.16.0

FROM node:${NODE_VERSION}-alpine AS build-api

ARG USERNAME=baklai
ARG REPOSITORY=helpdesk-api

RUN apk update && apk add git

WORKDIR /app

RUN git clone https://github.com/${USERNAME}/${REPOSITORY}.git .
RUN npm install
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS build-app

ARG USERNAME=baklai
ARG REPOSITORY=helpdesk-app

RUN apk update && apk add git

WORKDIR /app

RUN git clone https://github.com/${USERNAME}/${REPOSITORY}.git .
RUN npm install
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS build-docs

ARG USERNAME=baklai
ARG REPOSITORY=helpdesk-docs

RUN apk update && apk add git

WORKDIR /app

RUN git clone https://github.com/${USERNAME}/${REPOSITORY}.git .
RUN npm install
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production

ENV TZ=Europe/Kyiv

ARG PORT
ARG HOST

WORKDIR /app

COPY --from=build-api /app/tsconfig*.json ./
COPY --from=build-api /app/package*.json ./
COPY --from=build-api /app/nest-cli.json ./

RUN npm i --omit=dev

COPY --from=build-api /app/dist/ ./dist/
COPY --from=build-app /app/dist/ ./app/
COPY --from=build-docs /app/.vitepress/dist/ ./docs/

EXPOSE ${PORT}

ENV PORT=${PORT}
ENV HOST=${HOST}

CMD [ "node", "dist/main.js" ]
