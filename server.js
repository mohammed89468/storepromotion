const express =  require('express');
const connectDB =  require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const Authroute = require('./routes/Authroute');
const app = express();

const PORT = 3000;


// db
connectDB();

app.use(express.json());

app.use('/api', Authroute);

app.listen(PORT,()=>{ console.log('app is running')});