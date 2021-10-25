import mongoose from "../database";
import { ServicesI } from "../interfaces/zattire-service.interface";
import BaseService from "./base.service";



export default class ZattireService extends BaseService {
    getCategories() {
        return this.model.distinct("category_name")
    }


    addServiceToCategory = async (id: any, service_name: ServicesI) => {
        //@ts-ignore
        const addService = await this.model.findOneAndUpdate({ _id: id }, { $push: { "services": service_name } })
        return addService
    }

    deleteServiceFromCategory = async (category_id: any, service_id: any) => {
        //@ts-ignore
        const removeService = await this.model.findOneAndUpdate({ _id: category_id, "services._id": service_id }, { $pull: { services: { _id: service_id } } }, { new: true })
        return removeService

    }
    editServiceFromCategory = async (category_id: any, service_id: any, data: any) => {
        const editService = await this.model.findOneAndUpdate({ _id: category_id, "services._id": service_id }, { $set: { "services.$": data } }, { new: true })
        return editService


    }

    searchServicebyName = async (phrase: string) => {
        const search = await this.model.aggregate([
            {

                $match:
                {
                    "services.service_name": {
                        $regex: `.*${phrase}.*`, $options: 'i'
                    },


                }

            }
        ])
        return search
    }
    getById = async (id: string) => {
        return this.model.findOne({ _id: mongoose.Types.ObjectId(id) })
    }

    getByService = async (id: string) => {
        return this.model.findOne({ "services._id": id }).select("services")

    }
}