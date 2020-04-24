import { Request, Response } from "express";
import BaseService from "./base.service";
export default class UserService extends BaseService {
    constructor();
    post: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    putPhoto: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    getPhoto: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
}
