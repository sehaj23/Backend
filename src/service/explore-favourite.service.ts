

import mongoose from "../database";
import Explore from "../models/explore.model";
import FavouriteExplore from "../models/favorite-explore.model";
import { ExploreRedis } from "../redis/index.redis";
import REDIS_CONFIG from "../utils/redis-keys";
import BaseService from "./base.service";


export default class ExploreFavouriteService extends BaseService {
    addToFavourites = async (user_id, explore_id) => {
        await ExploreRedis.remove(user_id, { type: REDIS_CONFIG.exploreFavourites })
        const favourite = await FavouriteExplore.create({ user_id: user_id, explore_id: explore_id })
        return favourite
    }
    deleteFavourites = async (user_id, explore_id) => {
        await ExploreRedis.remove(user_id, { type: REDIS_CONFIG.exploreFavourites })
        const favourite = await FavouriteExplore.deleteOne({ user_id: user_id, explore_id: explore_id })
        return favourite
    }

    // fix here
    getFavourites = async (user_id, q) => {
        const getFavourite = await ExploreRedis.get(user_id, { type: REDIS_CONFIG.exploreFavourites })
        if (getFavourite == null) {
            const pageNumber: number = parseInt(q?.page_number || 1)
            let pageLength: number = parseInt(q?.page_length || 10)
            pageLength = (pageLength > 100) ? 100 : pageLength
            const skipCount = (pageNumber - 1) * pageLength
            const favourite = await FavouriteExplore.find({ user_id: user_id })
                .skip(skipCount)
                .limit(pageLength)
                .populate({
                    path: "explore_id",
                    populate: {
                        path: "salon_id",
                        model: "salons",
                        select: { '_id': 1, 'temporary_closed': 1, "book_service": 1, "name": 1, "location_id": 1 }, populate: {
                            path: 'location_id', model: "location"
                        }
                    }
                })
            return favourite
        }
        return JSON.parse(getFavourite)
    }

    getFavouriteForExplore = async (user_id, exploreIds) => {
        // const getFavourite = await ExploreRedis.get(user_id, { type: REDIS_CONFIG.exploreFavourites })
        // if (getFavourite == null) {
        const favourite = await FavouriteExplore.find({ user_id: user_id, explore_id: { $in: exploreIds } })
        return favourite
        // }
        // return JSON.parse(getFavourite)
    }
}