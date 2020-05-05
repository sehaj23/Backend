import BaseService from "./base.service"
import Booking from "../../models/booking.model"
import Salon from "../../models/salon.model"
import { Request, Response } from "express"
import { BookingI } from "../../interfaces/booking.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"
import Service from "../../models/service.model"
import { ServiceSI } from "../../interfaces/service.interface"
import Offer from "../../models/offer.model"



export default class BookinkService extends BaseService {

    constructor() {
        super(Booking)
    }

    post = async (req: Request, res: Response) => {
        try {
            const e: BookingI = req.body

            if (!e.salon_id && !e.makeup_artist_id && !e.designer_id) {
                const errMsg = `Atleast one provider is is reqired out of 3`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            // if(e.salon_id){
            //     e.salon_id = mongoose.Types.ObjectId(e.salon_id.toString())
            // }
            // if(e.makeup_artist_id){
            //     e.makeup_artist_id = mongoose.Types.ObjectId(e.makeup_artist_id.toString())
            // }
            // if(e.designer_id){
            //     e.designer_id = mongoose.Types.ObjectId(e.designer_id.toString())
            // }

            if (!e.designer_id) {
                const { services } = e;
                if (!services) {
                    const errMsg = `Services not defined`;
                    logger.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }

                if (services.length === 0) {
                    const errMsg = `Atleast one services is required. Length is 0`;
                    logger.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }

                const serviceIds = [];
                for (let s of services) {
                    if (s.service_id) {
                        if (!s.service_time) {
                            const errMsg = `Service time not found for id: ${s.service_id}`;
                            logger.error(errMsg);
                            res.status(400);
                            res.send({ message: errMsg });
                            return;
                        }
                        serviceIds.push(mongoose.Types.ObjectId(s.service_id));
                    } else {
                        const errMsg = `Service Id not found: 22`;
                        logger.error(errMsg);
                        res.status(400);
                        res.send({ message: errMsg });
                        return;
                    }
                }

                if (serviceIds.length === 0) {
                    const errMsg = `Service Ids not found`;
                    logger.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }

                const serviceInfoReq = Service.find({ _id: { $in: serviceIds } })
                const offerInfoReq = Offer.find({ service_id: { $in: serviceIds } })
                const [serviceInfo, offerInfo] = await Promise.all([serviceInfoReq, offerInfoReq])

                if (serviceInfo.length === 0) {
                    const errMsg = `serviceInfo not found`
                    logger.error(errMsg)
                    res.status(400)
                    res.send({ message: errMsg })
                    return
                }

                for (let offer of offerInfo) {
                    for (let service of serviceInfo) {
                        if (offer._id === service._id) {
                            // TODO: 
                        }
                    }
                }
            }



            const event = await Booking.create(e)

            res.send(event)
        } catch (e) {
            logger.error(`Post ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }

    }
    getSalonEmployees = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.salonId;
            if (!salonId) {
                const errMsg = `Salon Id not found`;
                logger.error(errMsg);
                res.status(400);
                res.send({ message: errMsg });
                return;
            }
            const { dateTime } = req.body;
            if (!dateTime) {
                const errMsg = `dateTime not found`;
                logger.error(errMsg);
                res.status(400);
                res.send({ message: errMsg });
            }

            const dateTimeD = new Date(dateTime);

            const busyEmployeesIds = [];

            // @ts-ignore
            const bookings = await Booking.findOne({ services: { service_time: dateTimeD }, salon_id: salonId });
            console.log("*********Got bookings ****************");
            console.log(bookings);

            if (bookings !== null) {
                for (const bs of bookings.services) {
                    busyEmployeesIds.push(bs.employee_id);
                }
            }

            const salon = await Salon.findById(salonId).populate("employees").exec();
            if (!salon) {
                const errMsg = `salon not found`;
                logger.error(errMsg);
                res.status(400);
                res.send({ message: errMsg });
            }

            for (const bemp of busyEmployeesIds) {
                //@ts-ignore
                const i = salon.employees.findIndex((e) => e._id === bemp);
                if (i !== -1) {
                    salon.employees.splice(i, 1);
                }
            }

            res.send(salon);
        } catch (e) { }
    };

    getSalonBookings = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.id
            if (!salonId) {
                const errMsg = 'Salon Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ salon_id: salonId, status: { $ne: "Requested" } })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getmakeupArtistBookings = async (req: Request, res: Response) => {
        try {
            const makeupArtistId = req.params.id
            if (!makeupArtistId) {
                const errMsg = 'Makeup Artist ID not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ smakeup_artist_id: makeupArtistId, status: { $ne: "Requested" } })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getDesignerBookings = async (req: Request, res: Response) => {
        try {
            const designerId = req.params.id
            if (!designerId) {
                const errMsg = 'Designer Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ designer_id: designerId, status: { $ne: "Requested" } })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getPendingSalonBookings = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.id
            if (!salonId) {
                const errMsg = 'Salon Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ salon_id: salonId, status: "Requested" })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            res.send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getPendingmakeupArtistBookings = async (req: Request, res: Response) => {
        try {
            const makeupArtistId = req.params.id
            if (!makeupArtistId) {
                const errMsg = 'Makeup Artist ID not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ smakeup_artist_id: makeupArtistId, status: "Requested" }).populate("makeup_artists").populate("designers").populate("salons").exec()
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }
    getPendingDesignerBookings = async (req: Request, res: Response) => {
        try {
            const designerId = req.params.id
            if (!designerId) {
                const errMsg = 'Designer Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            const bookings = await Booking.find({ designer_id: designerId, status: "Requested" })
            if (!bookings) {
                const errMsg = 'No Bookings Found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.status(200).send(bookings)
        } catch (e) {
            const errMsg = "Error Fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
    }


    updateStatusBookings = async (req: Request, res: Response) => {

        try {
            const bookingid = req.params.id
            const status = req.body.status

            if (!bookingid) {
                const errMsg = 'Booking Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            if (!status) {
                const errMsg = 'status not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            const bookings = await Booking.findByIdAndUpdate({ _id: bookingid }, { status: status }, { new: true, runValidators: true })

            res.send(bookings)

        } catch (error) {
            console.log(error)
            const errMsg = "Error updating Status"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }


    }

    assigneEmployeeBookings = async (req: Request, res: Response) => {

        try {
            const bookingId = req.params.id
            const employeeId = mongoose.Types.ObjectId(req.body.employee_id)
            const serviceName = req.body.service_name
            if (!bookingId) {
                const errMsg = 'Booking  not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            if (!employeeId || !serviceName) {
                const errMsg = 'not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            const booking = await Booking.update({ _id: bookingId, service: { service_name: serviceName } }, { employee_id: employeeId })
            res.send(booking)

        } catch (error) {
            const errMsg = "Error updating employee"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }

    }

    getBookings = async (req: Request, res: Response) => {
        const salon_id = req.params.id
        const match = {}
        const date = new Date().toLocaleDateString()
        console.log(date)




        if (!salon_id) {
            const errMsg = "Error fetching Bookings"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        } else {
            //@ts-ignore
            match.salon_id = salon_id

        }

        if (req.query.status || req.query.employee || req.query.service) {


            if (req.query.status) {
                //@ts-ignore
                match.status = req.query.status


                if (req.query.service) {
                    //@ts-ignore
                    match.services = { $elemMatch: { service_name: req.query.service } }
                }
                //testing for employee is left
                if (req.query.employee) {
                    //@ts-ignore
                    match.services = { $elemMatch: { employee_id: req.query.employee } }
                }

                //@ts-ignore
                const booking = await Booking.find((match))
                res.send(booking)

            }
        } else {

            //@ts-ignore
            match.date_time = date
            const booking = await Booking.find(({ match }))
            return res.send(booking)
            // check with date thing from db
        }


    }

}