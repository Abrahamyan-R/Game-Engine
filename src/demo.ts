import { Engine, HTTP_METHODS } from './engine';

const engine = new Engine({
  webServerPort: 4689,
  webSocketPort: 4690,
});

engine.addRoute('/users');
engine.appendPathToRouter('/users', HTTP_METHODS.GET, '/', [(req, res) => {
  res.json({ message: 'Get users list' });
}]);

const middlewares = [
  (req, res, next) => {
    console.log('Middleware aaa');
    next();
  },
  (req, res) => {
    res.json({ message: 'Create new user' });
  }
];

engine.appendPathToRouter('/users', HTTP_METHODS.POST, '/', middlewares);

engine.addMiddleware((req, res) => {
  res.status(404).json({ message: 'Requested endpoint not found' });
});

engine.start();