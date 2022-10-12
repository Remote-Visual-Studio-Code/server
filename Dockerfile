FROM node:16

# set workdir as current directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# RUN echo "JWT_SECRET=my-jwt-secret\nMONGO_URI=my-mongo-uri\nSOCK_PORT=8080\nDEBUG=false\nPORT=3000" > .env
COPY .env ./

RUN yarn lint
RUN yarn build


EXPOSE 3000
EXPOSE 8080

CMD ["node", "dist/server.js"]