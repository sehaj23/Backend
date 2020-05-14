import {http} from "./app";
import * as db from "./database";

const PORT = 8082;

db.connectt().then(() => {
    const server = http.listen(PORT, async () => {
        console.log(`Server is running http://localhost:${PORT}`);
    });
    
}).catch((e) => {
    console.log(`Db Error: ${e.message}`)
})

