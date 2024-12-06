import { Sequelize, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/database.js';

export const Vehiculos = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    defaultValue:UUIDV4,
  },
  placa: {
    type: DataTypes.STRING,
  },
  tipo: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  },
  modelo: {
    type: DataTypes.STRING,
  },
  marca: {
    type: DataTypes.STRING,
  },

  createdAt :{
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt :{
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {});


