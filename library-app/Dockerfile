FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p public/uploads

EXPOSE 3001

CMD ["npm", "start"]
