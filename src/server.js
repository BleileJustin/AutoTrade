var path = require('path')
var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
}); //__dir and not _dir
app.use("/static", express.static(path.join(__dirname, 'static')));
var port = 8000; // you can use any port
app.listen(port);
console.log('server on' + port);
