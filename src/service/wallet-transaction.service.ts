import mongoose from "../database";
import { WalletTransactionI } from "../interfaces/wallet-transaction.interface";
import BaseService from "./base.service";
import UserService from "./user.service";

export default class WalletTransactionService extends BaseService {

    userService: UserService
    constructor(walletTransaction: mongoose.Model<any, any>, userService: UserService) {
        super(walletTransaction)
        this.userService = userService
    }

    post = async (data: WalletTransactionI) => {
        if (data.amount < 0) {
            await this.userService.minusBalance(data.user_id, data.amount)
        } else {
            await this.userService.addBalance(data.user_id, data.amount)
        }
        return await this.model.create(data)
    }

}