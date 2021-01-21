FROM node:12.18-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV=production
ENV REDIS_HOST=10.0.0.104
EXPOSE 8082
CMD ["node", "dist/server.js"]