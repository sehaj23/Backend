import app from "./app";
import * as db from "./database";

const PORT = 8082;

db.connectt()

app.listen(PORT, async () => {
    console.log(`Server is running http://localhost:${PORT}`);
});