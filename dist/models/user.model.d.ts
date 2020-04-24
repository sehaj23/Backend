/// <reference types="mongoose" />
import mongoose from "../database";
import { UserSI } from "../interfaces/user.interface";
declare const User: mongoose.Model<UserSI, {}>;
export default User;
