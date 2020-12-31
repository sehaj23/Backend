import { NextFunction, Request, Response } from "express";
import * as jwt from "jwt-then";
import { isNamedExportBindings } from "typescript";
import CONFIG from "../config";
import logger from "../utils/logger";


export const openJWTVerification = async (token: string) => {
  try {
        
  
    // verifies secret and checks exp
    const decoded: string | object = await jwt.verify(token,CONFIG.USER_JWT);
    
  
    // @ts-ignore
    return decoded
  } catch (err) {
    logger.error(err.message)
    return null
  }
}

const openVerifyToken = async (req: Request, res: Response, next: NextFunction) =>  {
  if(process.env.NODE_ENV === 'test-api') {
    //@ts-ignore
    req.userId = process.env.USER_ID 
    next()
    return
  }

    // check header or url parameters or post parameters for token
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(!token){
      next()
    }
   
    try {
        
      // verifies secret and checks exp
      const decoded = await openJWTVerification(token)
      if(decoded === null){
        next()
      }else{
      // @ts-ignore
      req.userId = decoded._id;
  
      next();
      }
    } catch (err) {
      res.status(401).send({ auth: false, message: err });
    }
  };

 
  export default openVerifyToken