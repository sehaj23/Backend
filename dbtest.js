const mon = require('mongoose')

mon.connect("mongodb://127.0.0.1:27017/zattire").then(() => {
    console.log('Succc')
}).catch((e) => {
    console.log(`Err ${e.message}`);
    
}).finally(() => {
    mon.disconnect()
})