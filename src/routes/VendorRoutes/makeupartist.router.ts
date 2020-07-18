import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
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


makeupArtistRouter.post("/", VendorverifyToken, makeupartistController.postMua)
makeupArtistRouter.get("/:id", VendorverifyToken, makeupartistController.getId)
makeupArtistRouter.patch("/:id",VendorverifyToken,makeupartistController.patchMakeupArtist)
makeupArtistRouter.put("/settings/:id",VendorverifyToken,makeupartistController.makeupArtistSettings)
makeupArtistRouter.put("/:id/service", VendorverifyToken, makeupartistController.addMakeupArtistService)
makeupArtistRouter.delete("/:id/service/delete/:sid", VendorverifyToken, makeupartistController.deleteMakeupArtistService)
makeupArtistRouter.get("/:id/service", VendorverifyToken, makeupartistController.getService)
makeupArtistRouter.patch("/:id/service/update/:sid",VendorverifyToken,makeupartistController.updateService)
makeupArtistRouter.put("/:id/employee", VendorverifyToken, makeupartistController.addMakeupArtistEmployee)
makeupArtistRouter.delete("/:id/employee/delete/:eid", VendorverifyToken, makeupartistController.deleteMakeupArtistEmployee)
makeupArtistRouter.patch("/:id/employee/update/:eid",VendorverifyToken,makeupartistController.editMuaEmployee)
makeupArtistRouter.put("/:id/photo", VendorverifyToken, makeupartistController.putPhoto)
makeupArtistRouter.get("/:id/photo", VendorverifyToken, makeupartistController.getPhoto)
makeupArtistRouter.post("/:id/offer/:sid",VendorverifyToken,makeupartistController.createOffer)


export default makeupArtistRouter