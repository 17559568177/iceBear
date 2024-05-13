FROM node:21.7.2-slim
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm i
COPY . .
# RUN npm install -g serve
EXPOSE 5170
ENV NODE_ENV production
# CMD ["serve", "-s", "dist", "-l", "5170"]
CMD ["pnpm", "dev"]