import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
const mySchemaValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors.array());
  else next();
};

export default mySchemaValidator;
