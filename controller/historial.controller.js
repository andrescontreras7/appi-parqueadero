import { HistorialEntradasSalidas } from '../models/historial.models.js';
import { Vehiculos } from '../models/vehiculos.models.js';
import { Espacio } from '../models/espacio.models.js';
import { Op } from 'sequelize';


export const obtenerHistorial = async (req, res) => {
  const { dia, mes, año } = req.query;

  try {
    let whereClause = {};

    // Filtrar por día, mes y año
    if (dia && mes && año) {
      const inicioDia = new Date(año, mes - 1, dia, 0, 0, 0, 0); // Inicio del día
      const finDia = new Date(año, mes - 1, dia, 23, 59, 59, 999); // Fin del día
      whereClause = {
        [Op.or]: [
          {
            hora_entrada: {
              [Op.between]: [inicioDia, finDia],
            },
          },
          {
            hora_salida: {
              [Op.between]: [inicioDia, finDia],
            },
          },
        ],
      };
    } 
    // Filtrar solo por mes y año
    else if (mes && año) {
      const inicioMes = new Date(año, mes - 1, 1); // Primer día del mes
      const finMes = new Date(año, mes, 0, 23, 59, 59, 999); // Último día del mes a las 23:59:59.999
      whereClause = {
        [Op.or]: [
          {
            hora_entrada: {
              [Op.between]: [inicioMes, finMes],
            },
          },
          {
            hora_salida: {
              [Op.between]: [inicioMes, finMes],
            },
          },
        ],
      };
    } 
    // Filtrar solo por año
    else if (año) {
      const inicioAño = new Date(año, 0, 1);
      const finAño = new Date(año, 11, 31, 23, 59, 59, 999);
      whereClause = {
        [Op.or]: [
          {
            hora_entrada: {
              [Op.between]: [inicioAño, finAño],
            },
          },
          {
            hora_salida: {
              [Op.between]: [inicioAño, finAño],
            },
          },
        ],
      };
    }

    const historial = await HistorialEntradasSalidas.findAll({
      where: whereClause,
      include: [
        {
          model: Vehiculos,
          attributes: ['id', 'placa', 'modelo', 'color', 'marca'],

          include: {
            model: Espacio,
            attributes: ['id', 'numero', 'estado', 'tipo'],
            where: {
              estado: 'ocupado',
            },
          },
          
        },

       
        
      ],
    });

    if (historial.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron registros para el periodo especificado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registros encontrados',
      data: historial,
    });
  } catch (error) {
    console.error('Error al obtener el historial de entradas y salidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de entradas y salidas',
    });
  }
};
export const obtenerHistorialPorVehiculo = async (req, res) => {
  const { id_vehiculo } = req.params;

  try {
    const historial = await HistorialEntradasSalidas.findAll({
      where: { id_vehiculo },
      include: [
        {
          model: Vehiculos,
          attributes: ['id', 'placa', 'modelo', 'color', 'marca'],
        },
      ],
    });

    if (historial.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró historial para el vehículo especificado',
      });
    }

    res.status(200).json({
      success: true,
      data: historial,
    });
  } catch (error) {
    console.error('Error al obtener el historial del vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial del vehículo',
    });
  }
};