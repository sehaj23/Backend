import {Sequelize} from 'sequelize-typescript';

export const sequelize = new Sequelize('zattire', 'Gammy', 'Gammy', {
  host: 'localhost',
  dialect: 'postgres',
  models: [__dirname + '/models']
});
