import encryptData from '../../utils/password-hash'
import User from "../../models/user.model";
import {
    Request,
    Response
} from "express";
import * as jwt from "jwt-then";
import CONFIG from "../../config";
import UserI from "../../interfaces/user.interface";
import BaseService from "./base.service";


export default class LoginService extends BaseService {
    constructor() {
        super(User)
    }

    // Signup
    createUser = async (req: Request, res: Response) => {
        try {
            const v: UserI = req.body
            v.password = encryptData(v.password)
            const user = await User.create(v)
            delete user.password
            res.status(201).send({
                _id: user._id
            })
        } catch (e) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${e.message}`
            })
        }
    }

    // Login
    verifyUser = async (req: Request, res: Response) => {
        try {
            const {
                email,
                password
            } = req.body

            const user = await User.findOne({
                email,
                password: encryptData(password)
            })
            if (user == null) return res.status(400).send({
                message: "Username & password do not match"
            })

            delete user.password
            const token = await jwt.sign(user.toJSON(), CONFIG.USER_JWT, {
                expiresIn: "30 days"
            })
            
            res.status(200).send({
                token
            })
        } catch (e) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${e.message}`
            })
        }
    }
}