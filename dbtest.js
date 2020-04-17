const db = require("./src/database")

db.connectt().then(() => {
    console.log("Connected to db") 
}).catch((e) => {
    console.log(`Err: ${e.message}`)
})