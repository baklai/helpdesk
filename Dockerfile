ARG NODE_VERSION=24.12.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

RUN npm install -g pm2

COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/app/package*.json ./packages/app/
COPY packages/docs/package*.json ./packages/docs/

RUN --mount=type=cache,target=/root/.npm npm install

FROM base AS builder
COPY . .
RUN npm run build --workspace api
RUN npm run build --workspace app
RUN npm run build --workspace docs

FROM node:${NODE_VERSION}-alpine
WORKDIR /app

RUN apk add --no-cache nginx openssl && npm install -g pm2

RUN mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/privkey.pem \
    -out /etc/nginx/certs/fullchain.pem \
    -subj "/C=UA/ST=Kyiv/L=Kyiv/O=Helpdesk/OU=IT/CN=localhost"

COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/packages/app/dist /usr/share/nginx/html/app
COPY --from=builder /app/packages/docs/.vitepress/dist /usr/share/nginx/html/docs

COPY ./nginx.conf /etc/nginx/http.d/default.conf
COPY ./ecosystem.config.js ./ecosystem.config.js

ENV TZ=Europe/Kyiv
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 80 443 3000

CMD ["pm2-runtime", "ecosystem.config.js"]