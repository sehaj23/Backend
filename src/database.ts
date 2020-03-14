import {Sequelize} from 'sequelize-typescript';

export const sequelize = new Sequelize('zattire', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  models: [__dirname + '/models']
});
