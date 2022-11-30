import mongoose from "../database";
import { ExploreFavouriteSI } from "../interfaces/favourite.explore.interface";

const FavouriteExploreSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    explore_id: {  type: mongoose.Schema.Types.ObjectId,
        ref: 'explore',
        required: true
     },
}, {
    timestamps: true
})


const FavouriteExplore = mongoose.model<ExploreFavouriteSI>("Favourite-explore", FavouriteExploreSchema)
FavouriteExploreSchema.index({
    user_id:1
},{
    name:"get_favourites",
    background:true
})
FavouriteExploreSchema.index({
    user_id:1,
    explore_id:1
},{
    name:"unique_userID_exploreID",
    unique:true,
    background:true
})
export default FavouriteExplore