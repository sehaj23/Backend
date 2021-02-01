import { Request, Response, Router } from "express";
import UserverifyToken from "../../middleware/User.jwt";

const MicroserviceAuth = Router()
MicroserviceAuth.get("/auth/verify/user", UserverifyToken, async (req: Request, res: Response) => {
    res.send({
        authenticated: true,
        role: 'user',
        //@ts-ignore
        _id: req.userId
    })
})

export default MicroserviceAuth