import mongoose from "../database";

export type AdminRoleT = "admin" | "sub-admin"

export default interface AdminI{
    username: string
    password?: string
    role: AdminRoleT
    fcm_token? : string[],
}

export interface AdminSI extends AdminI, mongoose.Document{}