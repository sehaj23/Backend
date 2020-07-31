import logger from "./logger"


export default class ErrorResponse extends Error{


    constructor(e: any, modelName: string = "NA"){
        super(e.message)
        logger.error(`Error Handler - ${modelName} - ${e.message}`)
    }

}