FROM node:20-slim
WORKDIR /app

# prisma needs openssl on -slim images
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
# pnpm 9 = lockfileVersion 9; corepack sciaga pnpm 11, ktore wymaga Node 22
RUN npm i -g pnpm@9

# prisma/ must exist before install: postinstall runs `prisma generate`
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000
# prisma db push tworzy indeksy/unique w Mongo, seed wgrywa slownik (oba idempotentne)
CMD ["sh", "-c", "npx prisma db push --skip-generate && node seed.js && node index.js"]
