import redisClient from "./redis"


export default class BaseRedis {
    modelName: string

    DEFAULT_TIME_TO_LIVE = 3600

    constructor(modelName: string){
        this.modelName = modelName
    }

    set(key: string, data: any){
        return redisClient.set(`${this.modelName}_${key}`, JSON.stringify(data))
    }

    get(key: string): Promise<string>{
        return new Promise((resolve, reject) => {
            return redisClient.get(`${this.modelName}_${key}`, (err, data) => {
                if(err){
                    reject(err)
                }

                if(data !== null){
                    resolve(data)
                }
                resolve(null)
            })
        })
    }

    remove(key: string){
        return redisClient.del(`${this.modelName}_${key}`)
    }

    removeAll(){
        return redisClient.del(`${this.modelName}_*`)
    }

    
}