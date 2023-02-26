# FROM node:18 as builder
# LABEL version="1.0"
# LABEL description="React Frontend for the Codex API"
# WORKDIR /app
# COPY ./package.json ./
# COPY . .
# RUN npm install
# COPY . .
# RUN npm run build
FROM nginx
LABEL version="1.0"
LABEL description="React Frontend for the Codex API"
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
