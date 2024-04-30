const express = require('express');
const cookieParser = require('cookie-parser');
const mainRouter = require('./routes/main');
const methodOverride = require('method-override');
const checkLocalSession = require('./middleware/checkLocalSession');
const checkCookie = require('./middleware/checkCookie');
const session = require('express-session');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(methodOverride('_method'));

//Configuracion de sesion
app.use(session({
  secret: 'BooksChallenge',
  resave: true, 
  saveUninitialized: true
}))

.use(checkCookie)
.use(checkLocalSession)


app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
