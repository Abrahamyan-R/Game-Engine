import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';


interface EngineOptions {
  webServerPort: number,
  webSocketPort: number,
}

enum HTTP_METHODS {
  get,
  post,
  put,
  delete,
}

export class Engine {
  private webServerPort: number;
  private webSocketPort: number;
  private webServer: http.Server;
  private app: express.Application;
  private routes: Map<string, express.Router>;
  private allowedHttpMethods: Set<string> = new Set(['get', 'post', 'put', 'delete']);

  constructor(options: EngineOptions) {
    this.webServerPort = options.webServerPort;
    this.webSocketPort = options.webSocketPort;
    this.app = express();
    this.routes = new Map();

    this.config();
  }

  private config() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }

  public start() {
    this.webServer = http.createServer(this.app);

    this.webServer.listen(this.webServerPort, () => {
      console.info(`Web server is running on port ${this.webServerPort}`);
    });
  }

  public addRoute(route: string) {
    if (this.routes.has(route)) {
      throw new Error('Route already exists');
    }

    const newRouter: express.Router = express.Router();
    this.routes.set(route, newRouter);
    this.app.use(route, newRouter);
  }

  public appendPathToRouter(route: string, method: string, path: string, middlewares) {
    const router: express.Router = this.routes.get(route);

    if (!router) {
      throw new Error('Router does not exist for specified route');
    }

    if (!this.allowedHttpMethods.has(method)) {
      throw new Error('Specified http method not allowed');
    }

    router[method](path, middlewares);
  }

  public addMiddleware(middleware: express.RequestHandler) {
    this.app.use(middleware);
  }
}