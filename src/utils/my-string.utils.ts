
export default class MyStringUtils{

    /**
     * 
     * @param data This can be a string or a mongo object
     * @returns it return a string or undefined 
     */
    static getMongoId = (data: any): string => {
        let out
        if(typeof data === 'string'){
            out = data
        }else if(typeof data === 'object'){
            //@ts-ignore
            out = booking?.user_id?._id
        }
        return out
    }

}