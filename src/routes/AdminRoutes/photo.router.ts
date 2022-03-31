import { Router } from "express";
import PhotoController from "../../controller/photo.controller";
import verifyToken from "../../middleware/jwt";
import Photo from "../../models/photo.model";
import PhotoService from "../../service/photo.service";

const photoRouter = Router()
const photoService = new PhotoService(Photo)
const photoController  = new PhotoController(photoService)
photoRouter.post('/',verifyToken,photoController.post)
photoRouter.get("/",photoController. updatePhoto)

export default photoRouter