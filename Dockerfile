# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=18.17.1

ARG GITHUB_USERNAME=baklai
ARG APP_REPOSITORY=helpdesk-app-v1
ARG API_REPOSITORY=helpdesk-api-v1

# Building layer API
FROM node:${NODE_VERSION}-alpine AS build-api

ARG GITHUB_USERNAME=baklai
ARG APP_REPOSITORY=helpdesk-app-v1
ARG API_REPOSITORY=helpdesk-api-v1

RUN apk update && apk add git

WORKDIR /app

RUN git clone https://github.com/${GITHUB_USERNAME}/${API_REPOSITORY}.git .

# Install dependencies from package.json
RUN npm install

# Build application (produces dist/folder)
RUN npm run build

# Building layer APP
FROM node:${NODE_VERSION}-alpine AS build-app

ARG GITHUB_USERNAME=baklai
ARG APP_REPOSITORY=helpdesk-app-v1
ARG API_REPOSITORY=helpdesk-api-v1

RUN apk update && apk add git

WORKDIR /app

ENV VITE_APP_BASE_URL=/
ENV VITE_API_BASE_URL=/

RUN git clone https://github.com/${GITHUB_USERNAME}/${APP_REPOSITORY}.git .

# Install dependecies from package.json
RUN npm install

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Copy configuration files
COPY --from=build-api tsconfig*.json ./
COPY --from=build-api package*.json ./

# Install runtime dependecies (without dev/test dependecies)
# RUN npm i --omit=dev

# Copy production build
COPY --from=build-api /app/dist/ ./dist/
COPY --from=build-app /app/dist/ ./client/

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD [ "node", "dist/main.js" ]
