import * as dotenv from "dotenv";
import * as winston from "winston";
dotenv.config()

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console(),
    ]
})

// logger.add(new WinstonCloudWatch({
//     logGroupName: 'dev-backend',
//     logStreamName:  process?.env?.NODE_ENV ?? 'first',
//     awsRegion: 'ap-south-1'
// }))

logger.stream = {
    //@ts-ignore
    write: function (message: any, encoding: any) {
        logger.info(message);
    }
}

export default logger