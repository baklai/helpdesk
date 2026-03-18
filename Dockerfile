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

FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

COPY --from=build-app /app/packages/app/dist/ ./app/
COPY --from=build-docs /app/packages/docs/.vitepress/dist/ ./docs/

COPY --from=build-api /app/packages/api/dist/ /app/dist/
COPY --from=build-api /app/packages/api/package*.json /app/
COPY --from=build-api /app/packages/api/tsconfig*.json /app/
COPY --from=build-api /app/packages/api/nest-cli.json /app/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

RUN npm install --omit=dev

EXPOSE 80 3000

CMD ["sh", "-c", "nginx && node dist/main.js"]