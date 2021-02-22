const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
require('./models/events.model')
require('./models/users.model')
require('dotenv').config()

const events_router = require('./routes/events');
const users_routers = require("./routes/users");

const app = express();
const port = process.env.PORT ||5000;

app.use(cors())
app.use(express.json())
const uri = process.env.ATLAS_URI;
mongoose.connect(encodeURI(uri), {useNewUrlParser:true, useCreateIndex:true});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB database connection established successfully");
})

app.use("/events", events_router)
app.use('/users', users_routers)

app.listen(port, ()=>{
    console.log('Server is running on port: ${port}');
})