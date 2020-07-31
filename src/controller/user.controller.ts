import BaseController from "./base.controller"
import UserService from "../service/user.service"


export default class UserController extends BaseController{
    service: UserService
    constructor(service: UserService) {
        super(service)
        this.service = service
    }

}