import { Request, Response, NextFunction } from "express";
import * as jwt from "jwt-then"
import CONFIG from "../config";
import logger from "../utils/logger";


export const userJWTVerification = async (token: string) => {
  try {
        
  
    // verifies secret and checks exp
    const decoded: string | object = await jwt.verify(token,CONFIG.USER_JWT);
    
    // @ts-ignore
    if (!decoded._id) {
      logger.error("_id not found from decoced token")
      return null
    }
    // @ts-ignore
    return decoded
  } catch (err) {
    logger.error(err.message)
    return null
  }
}

const UserverifyToken = async (req: Request, res: Response, next: NextFunction) =>  {
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
      const decoded = await userJWTVerification(token)
      if(decoded === null){
        logger.error("Something went wrong")
        res.status(401).send({ success: false, message: 'Something went wrong' });
        return
      }
      // @ts-ignore
      req.userId = decoded._id;
  
      next();
    } catch (err) {
      res.status(401).send({ auth: false, message: err });
    }
  };

 
  export default UserverifyToken