
import BaseService from '../service/base.service'

export default class LoginService extends BaseService {
  // Signup
  create = async (user) => {
    const gotAdmin = await this.model.create(user)
    gotAdmin.password = ''
    return gotAdmin
  }

  loginAdmin = async (username: string, password: string) => {
    // this.model is coming from the base service class
    return await this.model.findOne({ username, password })
  }

  // Login
  login = async (email: string, password: string) => {
    // this.model is coming from the base service class
    return await this.model.findOne({ email, password })
  }

  getByEmail = async (email: string) => {
    return await this.model.findOne({ email })
  }

  getbyUIDandEmail = async (uid: string, email: string) => {
    return await this.model.findOne({ uid: uid, email: email })
  }
  getbyUID = async (uid: string) => {
    return await this.model.findOne({ uid: uid })
  }



}
