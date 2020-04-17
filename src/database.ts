import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { Mockgoose } from "mockgoose"
import Env from "./env";

dotenv.config();

let db = process.env.DB_NAME ?? "zattire"
if(process.env.NODE_ENV === "test")
  db += "_test"
console.log(`Datatabasaeeeae: ${db}`)
const uri: string = process.env.DB_URI ?? `mongodb://127.0.0.1:27017/${db}`;

const user: string = process.env.DB_USER ?? "postgres";
const password: string = process.env.DB_PASS ?? "postgres";

export const connectt = () => {
    return mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      (err: any) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("Successfully Connected!");
        }
      }
    );
}

export const disconnect = ()  => {
  if(process.env.NODE_ENV === "test"){
    return mongoose.connection.db.dropDatabase().then(() => {
      return mongoose.disconnect()
    })
  }else{
    return mongoose.disconnect()
  }
}

export default mongoose;
