### pushing
```shell
# for dev
git push > dev

# for master
git checkout master
git merge dev
# dont stage database.ts and server.ts
git push
check-slack for updates
```

### database.ts
```typescript    
uri = `mongodb+srv://zattire_dev:zattire_dev_password@production.8kbli.mongodb.net/zattire_pro?authSource=admin&replicaSet=atlas-27r88k-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`
```

### server.ts
```typescript
console.log('Starting server....');

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
if (process.env.NODE_ENV !== 'locals' && process.env.NODE_ENV !== 'test-api') {
    activateAws(true)
}
db.connectt().then(async () => {

    if (process.env.NODE_ENV === 'test-api') {
        if (!process.env.USER_ID) throw new Error(`User id required in test env`)
        const userId = process.env.USER_ID
        const user = await User.findOne({ _id: userId })
        if (user === null) throw new Error(`User not found with this id: ${userId}`)
    }

    if (cluster.isMaster && process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test-api') {
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
    console.error(`Db Error: ${e.message}`)
})
```