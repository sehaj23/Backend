import { Request, Response } from "express";
import ErrorResponse from "../utils/error-response";

const controllerErrorHandler = fn => (req: Request, res: Response) => Promise.resolve(fn(req, res)).catch((e) => {
    res.status(400).send({message: e.message})
})

export default controllerErrorHandler