import mongoose from "../database";
import { SalonSearchRedis } from "../redis/index.redis";
import BaseService from "./base.service";

export default class SalonSearchService extends BaseService {

    constructor(model: mongoose.Model<any, any>) {
        super(model)
    }

    getServicesByName = async (serviceName: string) => {
        const data = await SalonSearchRedis.get(serviceName)
        if (data === null) {
            const response = await this.model.aggregate([
                {
                    '$search': {
                        'autocomplete': {
                            'query': serviceName,
                            'path': 'service_name',
                            'fuzzy': {
                                'maxEdits': 2,
                                'prefixLength': 3,
                                'maxExpansions': 256
                            }
                        }
                    }
                }, {
                    '$project': {
                        '_id': 0,
                        'service_name': 1,
                        'score': {
                            '$meta': 'searchScore'
                        }
                    }
                }, {
                    '$sort': {
                        'score': -1
                    }
                }, {
                    '$limit': 10
                }
            ])
            SalonSearchRedis.set(serviceName, response)
            return response
        }
        return JSON.parse(data)
    }
}