import redisClient from "./redis"


export default class BaseRedis {
    modelName: string

    DEFAULT_TIME_TO_LIVE = 3600

    constructor(modelName: string){
        this.modelName = modelName
    }

    set(key: string, data: any, options: Object = {}){
        const finalKey = `${this.modelName}_${key}_${this.extrackKeys(options)}`
        return redisClient.set(finalKey, JSON.stringify(data))
    }

    get(key: string, options: Object = {}): Promise<string>{
        const finalKey = `${this.modelName}_${key}_${this.extrackKeys(options)}`
        return new Promise((resolve, reject) => {
            return redisClient.get(finalKey, (err, data) => {
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

    remove(key: string, options: Object = {}){
        const finalKey = `${this.modelName}_${key}_${this.extrackKeys(options)}`
        return redisClient.del(finalKey)
    }

    removeAll(){
        return redisClient.del(`${this.modelName}_*`)
    }

    private extrackKeys(options: Object){
        const keyStr = Object.keys(options).map((k) => {
            return `${k}_${options[k]}`
        })
        return keyStr.join("_")
    }
    
}
