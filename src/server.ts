import * as dotenv from "dotenv";
import { httpApp } from "./app";
import activateAws from "./aws";
import * as db from "./database";
import User from "./models/user.model";
import firebase from "./utils/firebase";
dotenv.config()

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const PORT = process.env.PORT || 8082;

if (process.env.NODE_ENV !== 'test-api') {
    activateAws(true)
}

db.connectt().then(async () => {

    if (process.env.NODE_ENV === 'test-api') {
        if (!process.env.USER_ID) throw new Error(`User id required in test env`)
        const userId = process.env.USER_ID
        const user = await User.findOne({ _id: userId })
        if (user === null) throw new Error(`User not found with this id: ${userId}`)
    }
    
    //  ---------------------
    // uncomment while merging to master
    // tag: comment to work 
    if (cluster.isMaster && process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test-api') {
        console.log(`Master ${process.pid} is running`);
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        const server = httpApp.listen(PORT, async () => {
            console.log(`Server is running http://localhost:${PORT}`);
        });
        console.log(`Worker ${process.pid} started`);
    }

    //  ---------------------
    // tag: uncomment to work
    // const server = httpApp.listen(PORT, async () => {
    //     const name = firebase.name
    //     console.log(`Server is running http://localhost:${PORT}`);
    // });
    //  ---------------------
}).catch((e) => {
    console.error(`Db Error: ${e.message}`)
})
