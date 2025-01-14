const jsonServer = require('json-server');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));

let CROs = [];

try {
    const file = fs.readFileSync('cros.json');
    CROs = JSON.parse(file);
} catch (err) {
    console.error('Error reading CROs file', err);
}

server.post('/cro/:croId/clone', (req, res) => {
    const { croId } = req.params;
    const originalCRO = CROs.find(cro => cro.uid === croId);

    if (!originalCRO) {
        return res.status(404).send('CRO not found');
    }

    const newCRO = { ...originalCRO, id: uuidv4() };
    res.json(newCRO);
});

server.delete('/cro/:croId', (req, res) => {
    const { croId } = req.params;
    const index = CROs.findIndex(cro => cro.uid === croId);

    if (index === -1) {
        return res.status(404).send('CRO not found');
    }

    CROs.splice(index, 1);
    res.status(200).send({ uid: croId });
});

server.use(jsonServer.rewriter({
    '/api/eeus?reg_number=:reg_number': '/dvh',
    '/api/eeus/find-owner-by-tin-of-passport?tin=:tin': '/owners?TIN=:tin',
}));

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
});