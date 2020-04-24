import { Request, Response } from "express";
import BaseService from "./base.service";
export default class DesignerService extends BaseService {
    constructor();
    post: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    addDesignerEvent: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    deleteDesignerEvent: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
}
