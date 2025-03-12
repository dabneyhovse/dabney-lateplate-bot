FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

CMD ["pnpm", "start"]
