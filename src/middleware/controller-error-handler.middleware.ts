import { Request, Response } from "express";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";

const controllerErrorHandler = fn => (req: Request, res: Response) => Promise.resolve(fn(req, res)).catch((e: ErrorResponse) => {
    logger.error(`${e.statusCode || 400} - ${e.message}`)
    logger.error(e.stack)
    res.status(e.statusCode || 400).send({message: e?.message ?? "Some Error"})
})

export default controllerErrorHandler