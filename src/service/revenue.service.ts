
import * as moment from "moment";
import mongoose from "../database";
import BaseService from "./base.service";



export default class RevenueService extends BaseService {
    constructor(bookingmodel: mongoose.Model<any, any>) {
        super(bookingmodel);



    }

    adminRevenueBySalon = async (startDate: Date, endDate: Date) => {
        return this.model.aggregate([
            {
                '$match': {
                    'services.service_time': {
                        '$lt': endDate
                    },
                    //@ts-ignore
                    'services.service_time': {
                        '$gte': startDate
                    }
                }
            }, {
                '$group': {
                    '_id': '$salon_id',
                    'service_real_price': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.service_real_price',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'service_total_price': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.service_total_price',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'vendor_commission': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.vendor_commission',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'zattire_commission': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.zattire_commission',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'service_discount': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.service_discount',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    }
                }
            }, {
                '$lookup': {
                    'from': 'salons',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'salon'
                }
            },
            {
                '$project': {
                    "service_real_price": 1,
                    "service_total_price": 1,
                    "vendor_commission": 1,
                    "zattire_commission": 1,
                    "service_discount": 1,
                    'salon.name': 1
                }
            }
        ])
    }

    adminTotalRevenue = async (startDate: Date, endDate: Date) => {
        return await this.model.aggregate([
            {
                '$match': {
                    'services.service_time': {
                        '$lt': endDate
                    },
                    //@ts-ignore
                    'services.service_time': {
                        '$gte': startDate
                    }
                }
            }, {
                '$group': {
                    '_id': null,
                    'service_real_price': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.service_real_price',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'service_total_price': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.service_total_price',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'vendor_commission': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.vendor_commission',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'zattire_commission': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.zattire_commission',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    },
                    'service_discount': {
                        '$sum': {
                            '$reduce': {
                                'input': '$services.service_discount',
                                'initialValue': 0,
                                'in': {
                                    '$sum': [
                                        '$$value', '$$this'
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ])
    }

    revenue = async (q: any) => {


        // if(!q.makeup_artist_id && !q.designer_id && !q.salon_id){
        //     const message = 'None id provided'
        //     res.status(400)
        //     res.send({message})
        //     return
        // }

        // pagination
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        console.log(pageLength)
        console.log(skipCount)

        const keys = Object.keys(q)
        const filters = {}
        const dateFilter = {}
        dateFilter["start_date"] = moment().subtract(28, "days").format("YYYY-MM-DD")
        dateFilter["end_date"] = moment().add(1, "days").format("YYYY-MM-DD")
        for (const k of keys) {
            switch (k) {
                case "service_id":
                    filters["services.service_id"] = {
                        "$in": q[k].split(",")
                    }
                    break
                case "employee_id":
                    filters["services.employee_id"] = {
                        "$in": q[k].split(",")
                    }
                    break
                case "start_date":
                    dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD")
                    break
                case "end_date":
                    dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD")
                    break
                case "page_number":
                case "page_length":
                    break
                default:
                    filters[k] = q[k]
            }
        }
        filters["createdAt"] = {
            "$gte": dateFilter["start_date"],
            "$lt": dateFilter["end_date"]
        }
        filters["status"] = 'Completed'
        const revenueDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')
        const revenuePagesReq = this.model.count(filters)
        const revenueStatsReq = this.model.aggregate([
            { $match: { ...filters } },
            {
                $project: {
                    price: 1,
                    services: 1
                }
            },
            { $unwind: "$services" },
            {
                $group: {
                    _id: null,
                    price: {
                        $sum: "$price",
                    },
                    zattire_commission: {
                        $sum: "$services.zattire_commission"
                    },
                    vendor_commission: {
                        $sum: "$services.vendor_commission"
                    },
                    total: {
                        $sum: {
                            $add: ["$services.zattire_commission", "$services.vendor_commission"]
                        }
                    }
                }
            },
        ]).skip(skipCount).limit(pageLength).sort('-createdAt')
        const [revenueDetails, revenueStats, revenuePages] = await Promise.all([revenueDetailsReq, revenueStatsReq, revenuePagesReq])
        const totalPages = Math.ceil(revenuePages / pageLength)
        return ({ revenueDetails, revenueStats, totalPages, currentPage: pageNumber })


    }
    totalRevenue = async () => {
        const revenue = await this.model.aggregate([
            { $unwind: '$services' },
            { $match: { status: "Completed" } },
            { $group: { _id: null, price: { $sum: "$price" }, zattire_commission: { $sum: "$services.zattire_commission" }, vendor_commission: { $sum: "$services.vendor_commission" } } }
        ])

        return revenue;


    }
    revenueByBookingId = async (id: string, q: any) => {



        // if(!q.makeup_artist_id && !q.designer_id && !q.salon_id){
        //     const message = 'None id provided'
        //     res.status(400)
        //     res.send({message})
        //     return
        // }

        // pagination
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        // console.log(pageLength)
        // console.log(skipCount)

        const keys = Object.keys(q)
        const filters = {}
        const dateFilter = {}
        dateFilter["start_date"] = moment().subtract(28, "days").format("YYYY-MM-DD")
        dateFilter["end_date"] = moment().add(1, "days").format("YYYY-MM-DD")
        for (const k of keys) {
            switch (k) {
                case "service_id":
                    filters["services.service_id"] = {
                        "$in": q[k].split(",")
                    }
                    break
                case "employee_id":
                    filters["services.employee_id"] = {
                        "$in": q[k].split(",")
                    }
                    break
                case "start_date":
                    dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD")
                    break
                case "end_date":
                    dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD")
                    break
                case "page_number":

                    break;
                default:
                    filters[k] = q[k]
            }
        }
        filters["_id"] = id
        filters["createdAt"] = {
            "$gte": dateFilter["start_date"],
            "$lt": dateFilter["end_date"]
        }
        // console.log(filters);
        // console.log(pageLength)


        const revenueDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')
        const revenuePagesReq = this.model.count(filters)
        const revenueStatsReq = this.model.aggregate([
            { $match: { ...filters } },
            {
                $project: {
                    price: 1,
                    services: 1
                }
            },
            { $unwind: "$services" },
            {
                $group: {
                    _id: null,
                    price: {
                        $sum: "$price",
                    },
                    zattire_commission: {
                        $sum: "$services.zattire_commission"
                    },
                    vendor_commission: {
                        $sum: "$services.vendor_commission"
                    },
                    total: {
                        $sum: {
                            $add: ["$services.zattire_commission", "$services.vendor_commission"]
                        }
                    }
                }
            },
        ]).skip(skipCount).limit(pageLength).sort('-createdAt')
        const [revenueDetails, revenueStats, revenuePages] = await Promise.all([revenueDetailsReq, revenueStatsReq, revenuePagesReq])
        const totalPages = Math.ceil(revenuePages / pageLength)
        return ({ revenueDetails, revenueStats, totalPages, currentPage: pageNumber })









    }
}
