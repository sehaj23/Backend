import { Request, Response, NextFunction } from "express";
import * as jwt from "jwt-then"
import CONFIG from "../config";

const verifyToken = async (req: Request, res: Response, next: NextFunction) =>  {
    // check header or url parameters or post parameters for token
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      res.status(403).send({ success: false, message: 'No token provided.' });
      return 
    }
    try {
        
      // verifies secret and checks exp
      const decoded: string | object = await jwt.verify(token,CONFIG.JWT_KEY);
      // @ts-ignore
      if (!decoded.id) {
        res.status(403).send({ message: "something went wrong, please login again" });
        return
      }
      // @ts-ignore
      req.userId = decoded.id;
      next();
    } catch (err) {
      res.status(403).send({ auth: false, message: err });
    }
  };
  
  export default verifyToken;