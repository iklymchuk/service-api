FROM node:8

# Create app directory
WORKDIR /app

# Set default env
ENV db='mongodb://test:test@localhost:27017/node'

# Install app dependencies
COPY package.json /app

RUN npm install

# Bundle app source
COPY . /app

EXPOSE 4000

CMD [ "npm", "start", "$db"]
