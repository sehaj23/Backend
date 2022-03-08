import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import ExploreFavouriteService from "../service/explore-favourite.service"
import BaseController from "./base.controller"



export default class ExploreFavouriteController extends BaseController {
    service: ExploreFavouriteService
    constructor(service: ExploreFavouriteService) {
        super(service)
        this.service = service    
    }

    addToExploreFavourites =  controllerErrorHandler(async (req: Request, res: Response)=>{
        const {explore_id} = req.body
        //@ts-ignore
        const addToFavourites =  await this.service.addToFavourites(req.userId,explore_id)
        return res.status(200).send({data:addToFavourites})
    })

     getExploreFavourites =controllerErrorHandler(async (req: Request, res: Response)=>{
         const q = req.query
         //@ts-ignore
        const getExploreFavourites = await this.service.getFavourites(req.userId,q)
        return res.status(200).send({data:getExploreFavourites})
    })

}