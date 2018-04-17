joyReader
===

Language
---
- [中文](./readme_zh.md)
- [English](./readme.md)

Foreword
---
joyReader is a simple `webapp` developed for sharing book resources among acquaintances at the end of last year (2017/11) due to participating in a certain school competition. As an obscure coder, it is entirely responsible for self-learning vue-related knowledge, maybe some code is not very well written and some bugs. Welcome to make relevant suggestions in `issue`. Thank you.


Technology stack
---
- _vue2_: Framework for building user interfaces
- _vuex_: Enables state sharing between different components
- _vue-router_: Routes for different pages
- _fetch_: Initiate http asynchronous request instead of ajax
- _sass/scss_: `css(3)` preprocessing language
- _socket.io_: Real-time communication
- _nodejs_: Provides real-time communication response in the background


Directory and startup
---
- Directory Structure: 
```
.
├─vue-project       vue code: front-end interface + instant messaging + background request
├─websocket-node    nodejs code: Complete background instant messaging
```
- build and setup
```bash
# Enter websocket-node directory (nodejs server)
cd websocket-node

# Install dependencies
npm install

# Start the nodejs server and run on localhost:3000
node wsServer.js

# Enter the vue-project directory (front end)
cd vue-project

# Install dependencies
npm install

# Load the front end on localhost:8888
npm run dev

# build for production with minification
npm run build

```

