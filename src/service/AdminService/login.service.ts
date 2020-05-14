import verifyToken from "../../middleware/jwt";
import * as crypto from "crypto"
import logger from "../../utils/logger";
import Admin from "../../models/admin.model";
import {Router, Request, Response} from "express";
import * as jwt from "jwt-then";
import CONFIG from "../../config";

const loginRouter = Router()

export default class LoginService {

    static post = async (req: Request, res: Response) => {
        try{
            console.log(req.body);

            const { username, password } = req.body
            if(!username || !password){

                res.status(403)
                res.send({message: "Send all data"})
                return
            }
            const passwordHash = crypto.createHash("md5").update(password).digest("hex")
            const admin = await Admin.findOne({username, password: passwordHash})
            if(admin == null){
                res.status(403)
                res.send({message: "Username password does not match"})
                return
            }
            admin.password = ""
            const token = await jwt.sign(admin.toJSON(), CONFIG.ADMIN_JWT_KEY)
            res.send({token})
        }catch(e){
            res.status(403)
            res.send({message: `${CONFIG.RES_ERROR} ${e.message}`})
        }
    }
}
