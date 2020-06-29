import * as crypto from "crypto"
import CONFIG from "../config";

const encryptData = (plainData) => {
    plainData += CONFIG.SALT
    const dataHash = crypto.createHash("md5").update(plainData).digest("hex")
    return dataHash
}

export default encryptData