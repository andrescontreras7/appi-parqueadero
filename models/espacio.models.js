import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

import { Vehiculos } from './vehiculos.models.js';

export const Espacio = sequelize.define('espacio', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'libre', 
  },
  tipo: {
    type: DataTypes.STRING,  // Tipo de espacio, "carro" o "moto"
    allowNull: false,
  },
  id_vehiculoFK: {
    type: DataTypes.INTEGER,
    references: {
      model: Vehiculos,  
      key: 'id',
    },
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

// Definir relaciones
Vehiculos.hasOne(Espacio, { foreignKey: 'id_vehiculoFK' });
Espacio.belongsTo(Vehiculos, { foreignKey: 'id_vehiculoFK' });


sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tablas sincronizadas y actualizadas');
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
  });
