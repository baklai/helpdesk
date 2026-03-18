ARG NODE_VERSION=24.12.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/app/package*.json ./packages/app/
COPY packages/docs/package*.json ./packages/docs/

RUN --mount=type=cache,target=/root/.npm \
    npm install

FROM base AS build-api
COPY packages/api/ ./packages/api/
RUN npm run build --workspace api

FROM base AS build-app
COPY packages/app/ ./packages/app/
RUN npm run build --workspace app

FROM base AS build-docs
COPY packages/docs/ ./packages/docs/
RUN npm run build --workspace docs

FROM node:${NODE_VERSION}-alpine AS production

RUN apk add --no-cache nginx

WORKDIR /app

COPY --from=build-app /app/packages/app/dist/ /usr/share/nginx/html/app/
COPY --from=build-docs /app/packages/docs/.vitepress/dist/ /usr/share/nginx/html/docs/
COPY --from=build-api /app/packages/api/dist/ ./dist/
COPY --from=build-api /app/packages/api/package*.json ./

RUN npm install --omit=dev

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

CMD ["sh", "-c", "nginx && node dist/main.js"]