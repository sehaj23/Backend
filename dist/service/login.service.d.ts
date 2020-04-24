import { Request, Response } from "express";
export default class LoginService {
    static post: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
}
