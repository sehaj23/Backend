
const arrayFirstOrString = (data: any) =>{
    if(Array.isArray(data)){
        if(data.length > 0) return data[0]
    }
    return data.toString()
}

export default arrayFirstOrString