FROM node:8-alpine

# Install ffmpeg 
RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

# Install fluent-ffmpeg globally
RUN npm install -g fluent-ffmpeg

#Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install Dependencies
COPY package.json /usr/src/app
RUN npm install

#Bundle app source
COPY . /usr/src/app

EXPOSE 1337 
ENTRYPOINT []
CMD [ "/bin/sh", "run.sh" ]
