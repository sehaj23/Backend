import { Router } from "express";
import loginRouter from "./login.router";

const Userrouter = Router();

Userrouter.use("/login", loginRouter);

export default Userrouter
