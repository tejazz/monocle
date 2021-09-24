# Monocle
Social analysis monitoring system which streams real-time tweets.

### Application Setup and Local Development
Clone the repository and go to the `monocle` parent folder. You can use the following commands to start playing around with it.
```
npm install
npm run install:all     // installs the npm dependencies for both the server and the client codebases
// alternatively, you can use `npm run install:client` and `npm run install:server` for installing dependencies separately
npm start               // spins up both the client and server application
npm run start:client    // spins up only the client application
npm run start:server    // spins up only the server application
```
