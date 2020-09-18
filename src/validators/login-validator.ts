import { check } from 'express-validator'
import User from '../models/user.model'

export const signupChecks = [
  // check('name', 'Name too short').isLength({
  //   min: 3,
  // }),
  // check('name', 'Invalid characters in name').isAlpha(),
  check('email', 'Invalid email')
    .isEmail()
    .custom(async (value) => {
      return await User.findOne({
        email: value,
      }).then((user) => {
        if (user) return Promise.reject('E-mail already in use')
      })
    })
    .normalizeEmail(),
  check('password', 'Password should contain atleast 6 characters').isLength({
    min: 6,
  }),
  check('password', 'Password should not be blank').trim().not().equals(''),
]

export const loginChecks = [
  check('email', 'Invalid email').isEmail(),
  check('password', 'Password should contain atleast 6 characters').isLength({
    min: 6,
  }),
  check('password', 'Password should not be blank').trim().not().equals(''),
]

export const emailChecks = [
  check('email', 'Invalid email')
    .isEmail()
    .custom(async (value) => {
      return await User.findOne({
        email: value,
      }).then((user) => {
        if (user) return Promise.reject('E-mail already in use')
      })
    })
    .normalizeEmail(),

]
