FROM node:lts-slim

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

CMD ["pnpm", "start"]
