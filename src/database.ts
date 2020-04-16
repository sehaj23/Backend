import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import { Mockgoose } from "mockgoose"
import Env from "./env";

dotenv.config();


const uri: string = Env.getDBURI() ?? "mongodb://127.0.0.1:27017/zattire";

const user: string = process.env.DB_USER ?? "postgres";
const password: string = process.env.DB_PASS ?? "postgres";

export const connectt = () => {
  console.log("*************")
    console.log(`process.env.DB_URI: ${uri}`)
    console.log("*************")
  if (process.env.NODE_ENV === "test") {
    
    const mockgoose = new Mockgoose(mongoose)
    return mockgoose.prepareStorage().then(() => {
      mongoose.connect(
        uri,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        },
        (err: any) => {
          if (err) {
            console.log(`Test Env: ${err.message}`);
          } else {
            console.log("Successfully Connected! Test Env");
          }
        }
      );
    })
  } else {
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
}

export const disconnect = () => {
  return mongoose.disconnect()
}

export default mongoose;
