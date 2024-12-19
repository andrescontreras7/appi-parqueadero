import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Vehiculos } from './vehiculos.models.js';

export const HistorialEntradasSalidas = sequelize.define('historialEntradasSalidas', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  id_vehiculo: {
    type: DataTypes.INTEGER,
    references: {
      model: Vehiculos,
      key: 'id',
    },
    allowNull: false,
  },
  hora_entrada: {
    type: DataTypes.DATE,
    allowNull: true,
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

Vehiculos.hasMany(HistorialEntradasSalidas, { foreignKey: 'id_vehiculo' });
HistorialEntradasSalidas.belongsTo(Vehiculos, { foreignKey: 'id_vehiculo' });

