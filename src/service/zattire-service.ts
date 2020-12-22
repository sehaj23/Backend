import ServiceI from "../interfaces/service.interface";
import { ServicesI } from "../interfaces/zattire-service.interface";
import BaseService from "./base.service";



export default class ZattireService extends BaseService {


    addServiceToCategory = async(id:any,service_name:ServicesI)=>{
        //@ts-ignore
        const addService = await this.model.findByIdAndUpdate(id,{$push:{services:service_name}},{new:true})
        return addService
}


}