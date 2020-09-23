import {http} from "./app";
import * as db from "./database";
import RazorPayService from "./service/razorpay.service";
import firebase from "./utils/firebase";

const PORT = process.env.PORT || 8082;
db.connectt().then(() => {
    const server = http.listen(PORT, async () => {
        const name = firebase.name
        console.log(`Server is running http://localhost:${PORT}`);
        console.log(`Firebase app name: ${name}`);
    });
    
}).catch((e) => {
    console.log(`Db Error: ${e.message}`)
})

// const r = new RazorPayService()
// r.createOrderId("Mybookingid")
