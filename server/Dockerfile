# FROM node:18
# WORKDIR /app
# COPY package.json .
# RUN npm install
# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "development" ];\
#         then npm install;\
#         else npm install --only=production;\
#     fi;
# COPY . ./
# EXPOSE 5000
# CMD ["node","index.js"]

# specify base image from dockerhub
FROM node:18
LABEL version="1.0"
LABEL description="Production image for the Codex MERN API"
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
CMD ["npm","run","start"]