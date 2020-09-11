import BaseService from "./base.service";
import MongoCounterSI from "../interfaces/mongo-counter.interface";

export default class MongoCounterService extends BaseService{

    async incrementByName(name: string): Promise<number>{
        const counter = await this.model.findOne({name}) as MongoCounterSI
        if(counter === null) throw new Error(`MongoCounter not found with name ${name}`)
        counter.count = counter.count + 1
        await counter.save()
        return counter.count
    }
}