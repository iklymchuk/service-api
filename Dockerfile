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

HEALTHCHECK --interval=5s --timeout=10s --retries=3 CMD curl -sS localhost:4000 || exit 1

CMD [ "npm", "start", "$db"]