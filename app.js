var express = require('express'), app = module.exports = express();
var util = require('util');
var nav = require('./js/navigation.js');
var db = require('./js/db.js');

app.engine('html', require('ejs').__express);
 
console.log('server dir: '+__dirname);
app.set('views', __dirname + '/views');
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/views/js'));
app.use("/imgs", express.static(__dirname + '/views/imgs'));
app.set('view engine', 'html');

if (!module.parent) {
  app.listen(8081);
  console.log('Rodando na porta 8081');
}

db.startMongo();


app.get('/', nav.enter);
app.get('/toSave', nav.toSave);
app.get('/toLogout', nav.toLogout);
app.get('/register', nav.register);
app.get('/battl3/:e', nav.battl3);
app.get('/manual', nav.manual);
app.get('/hist/:hist', nav.history);

app.post('/toBattl3', nav.toBattl3);
app.post('/toLogin', nav.toLogin);
app.post('/toRegister', nav.toRegister);
app.post('/check', nav.check);







