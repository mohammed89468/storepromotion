const express =  require('express');
const connectDB =  require('./config/db');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const Authroute = require('./routes/Authroute');
const Shoproute = require('./routes/Shoproute');
const app = express();

const PORT = 3000;


// db
connectDB();

app.use(express.json());

app.use(session({
    secret:"mySecret",
    resave:false,
    saveUninitialized:false
}));

app.use('/user', Authroute);
app.use('/shops', Shoproute);

app.listen(PORT,()=>{ console.log('app is running')});