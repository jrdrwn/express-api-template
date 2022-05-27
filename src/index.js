const app = require('./app');
const debug = require('debug')('server');
const http = require('http');

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);
app.set('hostname', hostname);

const server = http.createServer(app);

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.listen(port, hostname, () => {
    const addr = server.address();
    debug(`Listening on http://${addr.address}:${port}`);
});
