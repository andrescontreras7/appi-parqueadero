import { Entradas } from '../models/entradas.models.js';
import { Espacio } from '../models/espacio.models.js';
import { Vehiculos } from '../models/vehiculos.models.js';
import { HistorialEntradasSalidas } from '../models/historial.models.js';

export const obtenerTodasLasEntradasSalidas = async (req, res) => {
  const { dias, activo } = req.query;

  try {
    const vehiculos = await Entradas.findAll({
      include: [
        {
          model: Vehiculos,
          attributes: ['id', 'placa', 'modelo', 'color', 'marca'],
          include: {
            model: Espacio,
            attributes: ['numero', 'tipo'],
            where: {
              estado: 'ocupado',
            },
          },
        },
      ],
    });

    if (vehiculos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron salidas o entradas de vehículos',
      });
    }

    let resultado = vehiculos;

    if (activo === 'true') {
      resultado = vehiculos.filter(entrada => !entrada.hora_salida);
    } else if (dias && !isNaN(dias)) {
      const haceNDias = new Date();
      haceNDias.setDate(haceNDias.getDate() - parseInt(dias, 10));
      resultado = vehiculos.filter(entrada => new Date(entrada.hora_entrada) < haceNDias);
    }

    if (resultado.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron salidas o entradas de vehículos en los últimos ${dias}`,
      });
    }

    res.status(200).json({
      success: true,
      data: resultado.map(entrada => {
        if (!entrada.Vehiculo) {
          console.error('Vehículo no encontrado para la entrada:', entrada.id);
          return null;
        }

        const diasEnParqueadero = entrada.hora_salida
          ? null
          : Math.floor((new Date() - new Date(entrada.hora_entrada)) / (1000 * 60 * 60 * 24));

        return {
          id: entrada.id,
          id_vehiculo: entrada.id_vehiculoFK,
          tipo: entrada.Vehiculo.espacio.tipo,
          marca: entrada.Vehiculo.marca,
          placa: entrada.Vehiculo.placa,
          color: entrada.Vehiculo.color,
          modelo: entrada.Vehiculo.modelo,
          numeroEspacio: entrada.Vehiculo.espacio.numero,
          horaEntrada: entrada.hora_entrada,
          horaSalida: entrada.hora_salida,
          diasEnParqueadero: diasEnParqueadero,
        };
      }).filter(entrada => entrada !== null),
    });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos',
    });
  }
};

export const obtenerVehiculosMasDe7Dias = async (req, res) => {
  const { dias } = req.query;
  if (dias > 200) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro de consulta "dias" debe ser menor a 200.'
    });
  }

  try {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - parseInt(dias || 7, 10));

    const vehiculos = await Entradas.findAll({
      where: {
        hora_salida: null,
      },
      include: [
        {
          model: Vehiculos,
          attributes: ['id', 'placa', 'modelo'],
          include: {
            model: Espacio,
            attributes: ['numero'],
            where: {
              estado: 'ocupado',
            },
          },
        },
      ],
    });

    const vehiculosMasDe7Dias = vehiculos.filter(entrada => new Date(entrada.hora_entrada) < hace7Dias);

    if (vehiculosMasDe7Dias.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron vehículos que hayan estado más de ${dias || 7} días en el parqueadero`,
      });
    }

    res.status(200).json({
      success: true,
      data: vehiculosMasDe7Dias.map(entrada => ({
        id: entrada.Vehiculo.id_vehiculoFK,
        placa: entrada.Vehiculo.placa,
        modelo: entrada.Vehiculo.modelo,
        numeroEspacio: entrada.Vehiculo.espacio.numero,
        horaEntrada: entrada.hora_entrada || null,
        DiasEnParqueadero: Math.floor((new Date() - new Date(entrada.hora_entrada)) / (1000 * 60 * 60 * 24)),
      })),
    });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos',
    });
  }
};

export const registrarEntradaVehiculo = async (req, res) => {
  const { id_vehiculo } = req.body;
  console.log(id_vehiculo);

  try {
    const vehiculo = await Vehiculos.findOne({ where: { id: id_vehiculo } });
    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'El vehículo no existe',
      });
    }

    const entradaSinSalida = await Entradas.findOne({ where: { id_vehiculoFK: id_vehiculo, hora_salida: null } });
    if (entradaSinSalida) {
      return res.status(400).json({
        success: false,
        message: 'El vehículo ya tiene una entrada registrada sin salida',
      });
    }

    const espacio = await Espacio.findOne({ where: { id_vehiculoFK: id_vehiculo, estado: 'ocupado' } });
    if (!espacio) {
      return res.status(400).json({
        success: false,
        message: 'El vehículo no tiene un espacio asignado',
      });
    }

    const nuevaEntrada = await Entradas.create({
      id_vehiculoFK: id_vehiculo,
      hora_entrada: new Date(),
      hora_salida: null,
    });

    // Registrar en el historial
    await HistorialEntradasSalidas.create({
      id_vehiculo: id_vehiculo,
      hora_entrada: nuevaEntrada.hora_entrada,
    });

    res.status(201).json({
      success: true,
      message: 'Entrada registrada correctamente',
    });
  } catch (error) {
    console.error('Error al registrar la entrada del vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Ocurrio un error inesperado',
    });
  }
};

export const registrarSalidaVehiculo = async (req, res) => {
  const { id_vehiculo } = req.body;

  try {
    const vehiculo = await Vehiculos.findOne({ where: { id: id_vehiculo } });
    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'El vehículo no existe',
      });
    }

    const entrada = await Entradas.findOne({
      where: {
        id_vehiculoFK: id_vehiculo,
        hora_salida: null,
      },
    });
    if (!entrada) {
      return res.status(400).json({
        success: false,
        message: 'No se encontró una entrada sin salida registrada para este vehículo',
      });
    }

    entrada.hora_salida = new Date();
    entrada.activo = false;
    await entrada.save();

    // Actualizar el historial
    await HistorialEntradasSalidas.update(
      { hora_salida: entrada.hora_salida },
      { where: { id_vehiculo: id_vehiculo, hora_salida: null } }
    );

    res.status(201).json({
      success: true,
      message: 'Salida registrada correctamente',
    });
  } catch (error) {
    console.error('Error al registrar la salida del vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la salida del vehículo',
    });
  }
};