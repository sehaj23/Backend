import {Sequelize} from 'sequelize-typescript';
import * as dotenv from "dotenv"

dotenv.config()

const user: string = (process.env.DB_USER) ? process.env.DB_USER : 'postgres'
const password: string = (process.env.DB_PASS) ? process.env.DB_PASS : 'postgres'

export const sequelize = new Sequelize('zattire', user, password, {
  host: 'localhost',
  dialect: 'postgres',
  models: [__dirname + '/models']
});
