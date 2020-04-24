import BaseService from "./base.service";
import { Request, Response } from "express";
export default class BookinkService extends BaseService {
    constructor();
    post: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
}
