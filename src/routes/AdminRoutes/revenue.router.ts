import { Router } from "express"
import RevenueController from "../../controller/revenue.controller"
import verifyToken from "../../middleware/jwt"
import Booking from "../../models/booking.model"
import RevenueService from "../../service/revenue.service"

const revenueRouter = Router()

const revenueService = new RevenueService(Booking)
const revenueController = new RevenueController(revenueService)

/**
 * @swagger
 * tags:
 *  name: AdminRevenue
 *  description: Revenue shown to the admin
 * /api/revenue:
 *  get:
 *      tags: [AdminRevenue]
 *      parameters:
 *          - name: start_date
 *            in: query
 *            required: true
 *            default: 2020-12-30
 *            schema:
 *              type: string
 *          - name: end_date
 *            in: query
 *            required: true
 *            default: 2020-12-30
 *            schema:
 *              type: string
 *          - name: salon_ids
 *            in: query
 *            description: Add salon ids seprated by commas (NO Spaces)
 *            default: 5fa28c2f70c80a50388e1a92,5fa2d9e7dbd06c21665b4640
 *            schema:
 *              type: string
 *          - name: status
 *            in: query
 *            description: Status of bookings. By default the value in the backend is set to **Completed**
 *            default: Completed
 *            schema:
 *              type: string
 *              enum: ['Online Payment Failed',  'Online Payment Requested', 'Requested', 'Confirmed', 'Vendor Cancelled', 'Customer Cancelled', 'Completed', 'Vendor Cancelled After Confirmed', 'Customer Cancelled After Confirmed', 'Rescheduled Canceled', 'Rescheduled']
 * 
 *      responses:
 *          default:
 *              description: Total Revenue and salon wise revenue
 */
revenueRouter.get("/", verifyToken, revenueController.adminTotalRevenue)

export default revenueRouter