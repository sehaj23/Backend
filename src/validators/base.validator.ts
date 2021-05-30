import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default class BaseValidator {

    static validate = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array()[0]['msg'], success: false });
            return
        }
        next()
    }
}