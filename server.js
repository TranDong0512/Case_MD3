const http = require('http');
const router = require('./controller/router');
const url = require('url');
const notFoundRouting = require('./controller/handler/notFoundRouting');

function getUrl(req) {
    const urlParse = url.parse(req.url);
    const pathName = urlParse.pathname;
    return pathName.split('/');
}

const server = http.createServer((req, res) => {
    const arrPath = getUrl(req);
    let trimPath = '';
    if (arrPath.length > 2) {
        trimPath = arrPath[1] + '/' + arrPath[2];
    } else {
        trimPath = arrPath[arrPath.length - 1];
    }
    let chosenHandler;
    if (typeof router[trimPath] === 'undefined') {
        chosenHandler = notFoundRouting.showNotFound;
    } else {
        chosenHandler = router[trimPath];
    }
    chosenHandler(req, res, arrPath[3]);
});

server.listen(8080, () => {
    console.log('Sever is running');
});