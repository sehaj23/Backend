import { Request, Response, NextFunction } from "express";
import * as jwt from "jwt-then"
import CONFIG from "../config";
import logger from "../utils/logger";

const verifyToken = async (req: Request, res: Response, next: NextFunction) =>  {
  if(process.env.NODE_ENV === 'test') {
    next()
    return
  }
    // check header or url parameters or post parameters for token
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      logger.error("No token provided.")
      res.status(401).send({ success: false, message: 'No token provided.' });
      return 
    }
    try {
        
      // verifies secret and checks exp
      const decoded: string | object = await jwt.verify(token,CONFIG.JWT_KEY);
      // @ts-ignore
      if (!decoded._id) {
        logger.error("something went wrong, please login again")
        res.status(401).send({ message: "something went wrong, please login again" });
        return
      }
      // @ts-ignore
      req.userId = decoded._id;
      next();
    } catch (err) {
      res.status(401).send({ auth: false, message: err });
    }
  };

 
  export default verifyToken