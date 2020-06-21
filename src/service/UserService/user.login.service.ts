import verifyToken from "../../middleware/jwt";
import * as crypto from "crypto"
import validator from "validator"
import logger from "../../utils/logger";
import User from "../../models/user.model";
import {
    Router,
    Request,
    Response
} from "express";
import * as jwt from "jwt-then";
import CONFIG from "../../config";
import UserI from "../../interfaces/user.interface";
import BaseService from "./base.service";
import {
    mongo
} from "mongoose";
import mongoose from "../../database";


export default class LoginService extends BaseService {
    constructor() {
        super(User)
    }

    // Signup
    createUser = async (req: Request, res: Response) => {
        try {
            const v: UserI = req.body
            const validName = validator.isAlpha(v.name)
            const validEmail = validator.isEmail(v.email)
            const validPassword = validator.isLength(v.password, { min: 6 })

            if (!validEmail || !validPassword || !validName) return res.status(400).send({
                message: "Invalid data."
            })

            const passwordHash = crypto.createHash("md5").update(v.password).digest("hex")
            v.password = passwordHash
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

            const validEmail = validator.isEmail(email)
            const validPassword = validator.isLength(password, { min: 6 })

            if (!validEmail || !validPassword) return res.status(400).send({
                message: "Invalid data"
            })

            const passwordHash = crypto.createHash("md5").update(password).digest("hex")
            const user = await User.findOne({
                email,
                password: passwordHash
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