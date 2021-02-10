//TODO:
//1. init express server
//2. connect middlewares
//3. Declare routes
//4. connect to db
//5.listen on port

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require("cors");
const morgan = require('morgan')
const contactsRouter = require('./contacts/contacts.routes')


dotenv.config()

const PORT = process.env.PORT || 3000

start();

function start() {
     const app = initServer()
     connectMiddlewares(app)
     declareRoutes(app)
     connectToDb()
     listen(app) 
    
}

function initServer(){
    return express()
}

function connectMiddlewares(app){
    app.use(express.json())
    app.use(cors({ origin: '*' }))
    app.use(morgan('dev'));
}

function declareRoutes(app){
    app.use('/api/contacts', contactsRouter)
}



async function connectToDb() {
    try 
    {await mongoose.connect(process.env.MONGO_URL, 
        {   useNewUrlParser:true,
        useUnifiedTopology:true,})
        console.log("Database connection successful");
} catch (error) {
    console.log(error.message);
    process.exit(1);
}
}

function listen(app) {
    app.listen(PORT, () => {
        console.log('Server is listening on port', PORT);
    })
}







//*from branch 02

// const express = require("express")
// const cors = require("cors");
// const morgan = require('morgan')
// const contactsRouter = require ('./routes/contacts.routes')

// const PORT = process.env.port || 3000

// class Server {
//   constructor() {
//     this.server = null;
//   }

//   start(){
//     this.server = express();
//     this.initMiddlewares();
//     this.initRoutes();
//     this.listen();
//   }

//   initMiddlewares() {
//     this.server.use(express.json());
//     this.server.use(
//       cors({
//         origin:'*'
//       })
//     )
//     this.server.use(morgan('dev'));
//   }

//   initRoutes(){
//     this.server.use('/api/contacts', contactsRouter)
//   }

//   listen(){
//     this.server.listen(PORT, () =>{
//       console.log('Server is listening on port: ', PORT);
//     })
//   }
// }

// const server =  new Server;

// server.start()