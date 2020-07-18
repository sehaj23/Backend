import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import MakeupartistServiceC from "../../service/makeupartist.service"
import MakeupArtist from "../../models/makeupArtist.model";
import Employee from "../../models/employees.model";
import Vendor from "../../models/vendor.model";
import Event from "../../models/event.model";
import MakeupArtistController from "../../controller/makeupArtist.controller";
import Offer from "../../models/offer.model";

const makeupArtistRouter = Router()
const makeupartistService = new MakeupartistServiceC(MakeupArtist,Employee,Vendor,Event,Offer)
const makeupartistController = new MakeupArtistController(makeupartistService)

makeupArtistRouter.get("/", verifyToken, makeupartistController.get)
makeupArtistRouter.get("/:id", verifyToken, makeupartistController.getId)
makeupArtistRouter.post("/", verifyToken, makeupartistController.postMua)
makeupArtistRouter.put("/:id", verifyToken, makeupartistController.put)
makeupArtistRouter.post("/event", verifyToken, makeupartistController.addMakeupArtistEvent)
makeupArtistRouter.post("/event/delete", verifyToken, makeupartistController.deleteMakeupArtistEvent)
makeupArtistRouter.put("/:id/service", verifyToken, makeupartistController.addMakeupArtistService)
makeupArtistRouter.put("/:id/service/delete/:sid", verifyToken, makeupartistController.deleteMakeupArtistService)
makeupArtistRouter.put("/:id/employee", verifyToken, makeupartistController.addMakeupArtistEmployee)
makeupArtistRouter.put("/:id/employee/delete/:eid", verifyToken, makeupartistController.deleteMakeupArtistEmployee)
makeupArtistRouter.put("/:id/photo", verifyToken, makeupartistController.putPhoto)
makeupArtistRouter.get("/:id/photo", verifyToken, makeupartistController.getPhoto)
makeupArtistRouter.post("/:id/offer/:sid",verifyToken,makeupartistController.createOffer)

export default makeupArtistRouter
