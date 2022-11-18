FROM node:18 as build

RUN mkdir -p /api-app

# Create and change to the app directory.

WORKDIR /api-app


# copying all the files from your file system to container file system
COPY package.json .

# install all dependencies
RUN yarn install --only=production

# copy oter files as well
COPY ./ .

#expose the port

EXPOSE 8080

# command to run when intantiate an image


CMD ["yarn", "build-backend"]
