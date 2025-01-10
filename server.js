const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.rewriter({
    '/api/eeus?reg_number=:reg_number': '/dvh',
    '/api/eeus/find-owner-by-tin-of-passport?tin=:tin': '/owners?TIN=:tin',
}));

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
});