const app = require('./app');
const debug = require('debug')('server');
const http = require('http');
const { createTerminus } = require('@godaddy/terminus');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL).catch((err) => {
    throw new Error(err);
});

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

const terminus_options = {
    signals: ['SIGINT', 'SIGBREAK', 'SIGHUP', 'SIGUSR2'],
    onSignal: () => {
        debug('server is starting cleanup');
        return Promise.all([mongoose.disconnect(), Promise.resolve(server.close())]);
    },
    onShutdown: () => {
        debug('cleanup finished, server is shutting down');
    },
};

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            debug(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            debug(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

createTerminus(server, terminus_options);

server.listen(port, hostname, () => {
    const addr = server.address();
    debug(`Listening on http://${addr.address}:${port}`);
});
