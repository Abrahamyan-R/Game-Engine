"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var HTTP_METHODS;
(function (HTTP_METHODS) {
    HTTP_METHODS[HTTP_METHODS["get"] = 0] = "get";
    HTTP_METHODS[HTTP_METHODS["post"] = 1] = "post";
    HTTP_METHODS[HTTP_METHODS["put"] = 2] = "put";
    HTTP_METHODS[HTTP_METHODS["delete"] = 3] = "delete";
})(HTTP_METHODS || (HTTP_METHODS = {}));
class Engine {
    constructor(options) {
        this.allowedHttpMethods = new Set(['get', 'post', 'put', 'delete']);
        this.webServerPort = options.webServerPort;
        this.webSocketPort = options.webSocketPort;
        this.app = express();
        this.routes = new Map();
        this.config();
    }
    config() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
    }
    start() {
        this.webServer = http.createServer(this.app);
        this.webServer.listen(this.webServerPort, () => {
            console.info(`Web server is running on port ${this.webServerPort}`);
        });
    }
    addRoute(route) {
        if (this.routes.has(route)) {
            throw new Error('Route already exists');
        }
        const newRouter = express.Router();
        this.routes.set(route, newRouter);
        this.app.use(route, newRouter);
    }
    appendPathToRouter(route, method, path, middlewares) {
        const router = this.routes.get(route);
        if (!router) {
            throw new Error('Router does not exist for specified route');
        }
        if (!this.allowedHttpMethods.has(method)) {
            throw new Error('Specified http method not allowed');
        }
        router[method](path, middlewares);
    }
    addMiddleware(middleware) {
        this.app.use(middleware);
    }
}
exports.Engine = Engine;
