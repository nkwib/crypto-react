FROM node:alpine
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN chmod -R 777 /home/node/app
COPY package*.json /home/node/app/
RUN npm install
COPY --chown=node:node . /home/node/app
EXPOSE 3000
CMD ["npm", "start"]