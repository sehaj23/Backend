import mongoose from "../database";
export default interface ExploreI {
    options: Options[] // option ids of the service
    salon_id: string,
    color:string[],
    photo:string,
    service_name:string,
    tags:string[],
    description:string
    
}
interface Options{
    name:string,
        price: number,
        duration: number,
        gender: string
}

export interface ExploreSI extends ExploreI, mongoose.Document { }