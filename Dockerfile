FROM node:16 As development

WORKDIR /app

COPY package.json ./

RUN npm i -g rimraf
RUN npm install

COPY . .

RUN npm run build

FROM node:16 As production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production
RUN npm install pm2 -g

COPY . .

COPY --from=development /app/dist ./dist

CMD pm2 start npm --name "dps" -- run start:prod && pm2 log dps

# docker build -t irctc-node .
# docker run -it -p 8080:8080 irctc-node