import * as mongoose from "mongoose";
export declare const connectt: () => Promise<typeof mongoose>;
export declare const disconnect: () => Promise<void>;
export default mongoose;
