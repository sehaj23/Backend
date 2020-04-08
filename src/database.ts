import * as dotenv from "dotenv"
import * as mongoose from "mongoose"

dotenv.config()

const uri: string = process.env.DB_URI ?? "mongodb://127.0.0.1:27017/zattire";

const user: string = process.env.DB_USER ?? 'postgres'
const password: string = process.env.DB_PASS ?? 'postgres'


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err: any) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Successfully Connected!");
  }
});

export default mongoose