import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

import { Vehiculos } from './vehiculos.models.js';


export const Entradas = sequelize.define('entradas', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  id_vehiculoFK: {
    type: DataTypes.INTEGER,
    references: {
      model: Vehiculos,
      key: 'id',
    },
    allowNull: false,
  },
  

  hora_entrada: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  hora_salida: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: true,
});

Vehiculos.hasMany(Entradas, { foreignKey: 'id_vehiculoFK' });
Entradas.belongsTo(Vehiculos, { foreignKey: 'id_vehiculoFK' });



sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tablas sincronizadas y actualizadas');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });