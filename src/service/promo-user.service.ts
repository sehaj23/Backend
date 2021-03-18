import mongoose from "../database";
import BaseService from "./base.service";


export default class PromoUserService extends BaseService {
    constructor(promoModel: mongoose.Model<any, any>,) {
        super(promoModel);

    }

    countByUserIdAndPromoCodeIds = async (userId: string, promoCodeIds: string[]) => {
        const promoCodeObjectIds = promoCodeIds.map(p => mongoose.Types.ObjectId(p))
        const res = await this.model.aggregate(
            [
                {
                    '$match': {
                        'user_id': mongoose.Types.ObjectId(userId),
                        'promo_code_id': {
                            '$in': promoCodeObjectIds
                        }
                    }
                }, {
                    '$group': {
                        '_id': '$promo_code_id',
                        'count': {
                            '$sum': 1
                        }
                    }
                }
            ]
        )
        return res
    }

 

}