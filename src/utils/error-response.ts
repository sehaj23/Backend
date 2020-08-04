import logger from "./logger"


export default class ErrorResponse extends Error{

    statusCode: number
    constructor(e: any, statusCode: number = 400,  modelName: string = "NA"){
        super(e.message)
        logger.error(`Error Handler - ${modelName} - ${e.message}`)
        this.statusCode = statusCode
    }

}