import redisClient from "./redis"


export default class BaseRedis {
    protected modelName: string

    protected DEFAULT_TIME_TO_LIVE = 3600

    constructor(modelName: string) {
        this.modelName = modelName
    }

    /**
     * 
     * @param key the main key like salonId
     * @param data the data from database
     * @param options like lat, long, male/female
     */
    set(key: string, data: any, options: Object = {}) {
        const finalKey = `${this.modelName}_${key}_${this.extrackKeys(options)}`
        return redisClient.set(finalKey, JSON.stringify(data))
    }

    get(key: string, options: Object = {}): Promise<string> {
        const finalKey = `${this.modelName}_${key}_${this.extrackKeys(options)}`
        return new Promise((resolve, reject) => {
            return redisClient.get(finalKey, (err, data) => {
                if (err) {
                    reject(err)
                }

                if (data !== null) {
                    resolve(data)
                }
                resolve(null)
            })
        })
    }

    remove(key: string, options: Object = {}) {
        const finalKey = `${this.modelName}_${key}_${this.extrackKeys(options)}`
        return redisClient.del(finalKey)
    }

    async removeAll() {
        return new Promise((resolve, reject) => {
            redisClient.keys(`${this.modelName}_*`, function handleKeys(err, keys) {
                // If there was an error, callback with it
                if (err) {
                    return reject(err);
                }

                // If there are keys, delete then
                if (keys.length) {
                    // DEV: There is a bit of a delay between get/delete but it is unavoidable
                    redisClient.del(keys);
                    resolve(true)
                    // Otherwise, return immediately (we are already async)
                } else {
                    reject(null);
                }
            });
        })
    }

    protected extrackKeys(options: Object) {
        const keyStr = Object.keys(options).map((k) => {
            return `${k}_${options[k]}`
        })
        return keyStr.join("_")
    }

}
