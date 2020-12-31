import { Router } from "express";
import { query } from "express-validator";
import SalonSearchController from "../../controller/salon-search.controller";
import mySchemaValidator from "../../middleware/my-schema-validator";
import SalonSearch from "../../models/salon-search.model";
import SalonSearchService from "../../service/salon-search.service";

const salonSearchService = new SalonSearchService(SalonSearch)
const salonSearchController = new SalonSearchController(salonSearchService)
const salonSearchRouter = Router()

const salonSearchValidator = [
    query('service_name').isString().withMessage('Enter service name in query'),
    mySchemaValidator
]

/**
 * @swagger
 * tags:
 *  name: SalonSearch
 *  description: API to manage your SalonSearch.
 * /api/u/salon-search:
 *  get:
 *      tags: [SalonSearch]
 *      parameters:
 *          - name: service_name
 *            in: query
 *            required: true
 *            type: string
 *      responses:
 *          default:
 *              description: Services searched
 */
salonSearchRouter.get("/", salonSearchValidator, salonSearchController.getServicesByName)

export default salonSearchRouter