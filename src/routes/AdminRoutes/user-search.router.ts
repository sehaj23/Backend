import { Router } from "express"
import { UserSearchController } from "../../controller/user-search.controller"
import verifyToken from "../../middleware/jwt"
import UserSearch from "../../models/user-search.model"
import UserSearchService from "../../service/user-search.service"

const userServiceRouter = Router()

const userSearchService = new UserSearchService(UserSearch)
const userServiceController = new UserSearchController(userSearchService)

userServiceRouter.get("/", verifyToken, userServiceController.getWithPagination)
userServiceRouter.get("/:id", verifyToken, userServiceController.getId)

export default userServiceRouter