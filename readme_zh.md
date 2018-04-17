悦读
===

语言
---
- [中文](./readme_zh.md)
- [English](./readme.md)

前言
---
悦读是去年底(2017/11)因为参加学校的某个比赛而开发完成的一款面向熟人间共享书籍资源的简易`webapp`。作为默默无名的码农，全权当做自学vue相关知识，也许有些代码写的不太好以及一些bug，欢迎在`issue`里提出相关建议，谢谢。


技术栈
---
- _vue2_: 构建用户界面的框架
- _vuex_: 实现不同组件间的状态共享
- _vue-router_: 不同页面的路由
- _fetch_: 代替ajax发起http异步请求
- _sass/scss_: `css(3)`预处理语言
- _socket.io_: 实时通信
- _nodejs_: 提供后台实时通信应答


目录与启动
---
- 目录结构: 
```
.
├─vue-project       vue代码: 前端界面+即时通信+后台请求
├─websocket-node    nodejs代码: 完成后台即时通信功能
```
- 启动
```bash
# 进入websocket-node目录 (nodejs服务器)
cd websocket-node

# 安装依赖包
npm install

# 启动nodejs服务器，运行在localhost:3000
node wsServer.js

# 进入vue-project目录 (前端)
cd vue-project

# 安装依赖包
npm install

# 在localhost:8888 加载前端
npm run dev

# 编译
npm run build

```

