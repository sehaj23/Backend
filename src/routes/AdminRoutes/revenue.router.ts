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
 *            type: string
 *          - name: end_date
 *            in: query
 *            required: true
 *            type: string
 *      responses:
 *          default:
 *              description: Total Revenue and salon wise revenue
 */
revenueRouter.get("/", verifyToken, revenueController.adminTotalRevenue)

export default revenueRouter