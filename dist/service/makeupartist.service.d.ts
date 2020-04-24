import { Request, Response } from "express";
import BaseService from "./base.service";
export default class MakeupartistServiceC extends BaseService {
    constructor();
    post: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    addMakeupArtistEvent: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
    deleteMakeupArtistEvent: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
}
