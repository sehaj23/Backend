import { Request, Response } from "express";
import BaseService from "./base.service";
export default class SalonService extends BaseService {
    constructor();
    post: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    getOffer: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    getService: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    addSalonEmployee: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    deleteSalonEmployee: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    addSalonService: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    deleteSalonService: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    addSalonEvent: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
}
