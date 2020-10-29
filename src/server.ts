import * as dotenv from "dotenv";
import { httpApp } from "./app";
import './aws';
import * as db from "./database";
import firebase from "./utils/firebase";

dotenv.config()

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const PORT = process.env.PORT || 8082;
db.connectt().then(() => {
    if (cluster.isMaster && process.env.NODE_ENV !== 'local') {
        console.log(`Master ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        const server = httpApp.listen(PORT, async () => {
            const name = firebase.name
            console.log(`Server is running http://localhost:${PORT}`);
            console.log(`Firebase app name: ${name}`);
        });

        console.log(`Worker ${process.pid} started`);
    }


}).catch((e) => {
    console.log(`Db Error: ${e.message}`)
})
