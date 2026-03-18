ARG NODE_VERSION=24.12.0

FROM node:${NODE_VERSION}-alpine AS build-api

WORKDIR /app

COPY package*.json ./
COPY packages/api/package*.json ./packages/api/

RUN npm install --workspace api

COPY packages/api/ ./packages/api/

RUN npm run build --workspace api

FROM node:${NODE_VERSION}-alpine AS build-app

WORKDIR /app

COPY package*.json ./
COPY packages/app/package*.json ./packages/app/

RUN npm install --workspace app

COPY packages/app/ ./packages/app/

RUN npm run build --workspace app

FROM node:${NODE_VERSION}-alpine AS build-docs

WORKDIR /app

COPY package*.json ./
COPY packages/docs/package*.json ./packages/docs/

RUN npm install --workspace docs

COPY packages/docs/ ./packages/docs/

RUN npm run build --workspace docs

FROM node:${NODE_VERSION}-alpine AS production

ENV TZ=Europe/Kyiv

WORKDIR /app

COPY --from=build-api /app/packages/api/tsconfig*.json ./
COPY --from=build-api /app/packages/api/package*.json ./
COPY --from=build-api /app/packages/api/nest-cli.json ./

RUN npm i --omit=dev

COPY --from=build-api /app/packages/api/dist/ ./dist/
COPY --from=build-app /app/packages/app/dist/ ./app/
COPY --from=build-docs /app/packages/docs/.vitepress/dist/ ./docs/

EXPOSE 3000

CMD ["node", "dist/main.js"]