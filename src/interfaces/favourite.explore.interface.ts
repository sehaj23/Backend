import mongoose from "../database";


export default interface ExploreFavouriteI{
    user_id: string
    explore_id: string
  
}

export interface ExploreFavouriteSI  extends ExploreFavouriteI, mongoose.Document{}