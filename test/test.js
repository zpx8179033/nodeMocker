/**
 * Created by zpx on 2017/11/3.
 */

var express = require('express');
var app = express();
var nodeMocker = require('../src/index');

app.use(nodeMocker);
app.listen(3000);
