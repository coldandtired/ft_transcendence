# -----------------------------------------------------------------------------
# Build stage
# -----------------------------------------------------------------------------
FROM node:24.6.0-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --omit=dev


# -----------------------------------------------------------------------------
# Runtime stage
# -----------------------------------------------------------------------------
FROM node:24.6.0-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user (uid/gid 1001) and a writable data dir for SQLite
RUN useradd -u 1001 -m nonroot \
  && mkdir -p /data \
  && chown -R 1001:1001 /data

COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules

USER nonroot

EXPOSE 3000

CMD ["node", "dist/app.js"]
