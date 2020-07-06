import {
    Request,
    Response
} from "express";
import {check, validationResult} from 'express-validator'
import LoginService from "../../service/UserService/user.login.service";
import User from '../../models/user.model'

const ls = new LoginService()

export const signupChecks = [
    check('name', 'Invalid name').isAlpha().isLength({
        min: 3
    }),
    check('email', 'Invalid email').isEmail().custom(async value => {
        return await User.findOne({
            email: value
        }).then(user => {
            if (user) return Promise.reject('E-mail already in use');
        });
    }).normalizeEmail(),
    check('password', 'Password should contain atleast 6 characters').isLength({
        min: 6
    }),
    check('password', 'Password should not be blank').trim().not().equals('')
]


export const loginChecks = [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password should contain atleast 6 characters').isLength({
        min: 6
    }),
    check('password', 'Password should not be blank').trim().not().equals('')
]

export const validateSignup = (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send(errors.array());
    ls.createUser(req, res)
}

export const validateLogin = (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send(errors.array());
    ls.verifyUser(req, res)
}