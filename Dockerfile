# Multi-stage build for NestJS API

FROM node:20-alpine AS deps
WORKDIR /app

# Enable corepack (yarn)
RUN corepack enable

# Install ALL deps for build (dev deps included)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

# Use cached node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy sources and build
COPY package.json yarn.lock ./
COPY nest-cli.json tsconfig*.json ./
COPY src ./src

RUN yarn build


FROM node:20-alpine AS prod-deps
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production

# Install ONLY production deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true


FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

# Set container timezone to KST (Asia/Seoul)
RUN apk add --no-cache tzdata \
  && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
  && echo "Asia/Seoul" > /etc/timezone
ENV TZ=Asia/Seoul

# Only runtime artifacts (prod deps only)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]


