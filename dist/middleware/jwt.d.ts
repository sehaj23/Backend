import { Request, Response, NextFunction } from "express";
declare const verifyToken: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>, next: NextFunction) => Promise<void>;
export default verifyToken;
