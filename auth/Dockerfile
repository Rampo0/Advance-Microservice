FROM node:14-alpine

WORKDIR /app
COPY package.json ./ 
RUN npm install --only=prod
COPY ./ ./

CMD ["npm", "start"]