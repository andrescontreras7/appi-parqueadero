import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('control-vehiculos', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'  
});

export default sequelize;
