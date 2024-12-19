import { Espacio } from "../models/espacio.models.js";

import {Vehiculos} from "../models/vehiculos.models.js"





export const getVehiculosSinEspacio = async (req, res) => {
  const { id_vehiculo } = req.query;
  try {
    if (id_vehiculo) {
      const vehiculo = await Vehiculos.findOne({
        where: { id: id_vehiculo }
      });

      if (vehiculo) {
        const espacios = await Espacio.findAll({
          where: { id_vehiculoFK: id_vehiculo },
          attributes: ['id', 'numero', 'estado', 'tipo'],
          include: {
            model: Vehiculos,
            attributes: ['id', 'placa', 'color', 'modelo', 'marca', 'tipo' ],
          }
        });

        return res.status(200).json({
          success: true,
          message: 'Vehículos obtenidos correctamente',
          data: espacios
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'El vehículo no existe'
        });
      }
    } else {
      const vehiculos = await Vehiculos.findAll({
        attributes: ['id', 'placa', 'color', 'modelo', 'marca', "tipo"],
        include: {
          model: Espacio,
          attributes: ['id', 'numero', 'estado', 'tipo']
        }
      });

      
      const vehiculosSinEspacio = vehiculos.filter(vehiculo => !vehiculo.espacio);

      res.status(200).json({
        success: true,
        message: 'Vehículos obtenidos correctamente',
        data: vehiculosSinEspacio
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos',
      error: error.message
    });
  }
};

 

export const obtenerDetalleVehiculo = async (req, res) => {
  try {
    const { id_vehiculo } = req.params;

    // Buscar el vehículo por ID
    const vehiculo = await Vehiculos.findByPk(id_vehiculo, {
      attributes: ['id', 'placa', 'color', 'modelo', 'marca']
    });

    if (vehiculo) {
      // Buscar los espacios asociados al vehículo
      const espacios = await Espacio.findAll({
        where: { id_vehiculoFK: id_vehiculo },
        attributes: ['id', 'numero', 'estado', 'tipo'],
       
      });

      return res.status(200).json({
        success: true,
        message: 'Detalles del vehículo obtenidos correctamente',
        data: {
          vehiculo,
          espacios
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'El vehículo no existe'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles del vehículo'
    });
  }
};




export const getVehiculosCnEspacio = async (req, res) => {
  const {estado} = req.query
  
  try {
    const vehiculos = await Vehiculos.findAll({
      attributes: ['id', 'placa', 'color', 'modelo', 'marca'],
      include: {
        model: Espacio,
        attributes: ['id', 'numero', 'estado', 'tipo'],
        where: {
          estado: 'ocupado'
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Vehículos obtenidos correctamente',
      data: vehiculos
    });


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos',
      error: error.message
    });
  }
};

export const getVehiculosAll = async (req, res) => {

  
  try {
    const vehiculos = await Vehiculos.findAll({
      attributes: ['id', 'placa', 'color', 'modelo', 'marca', 'tipo', ],
      include: {
        model: Espacio,
        attributes: ['id', 'numero', 'estado', 'tipo'],
        
      }
    });

    res.status(200).json({
      success: true,
      message: 'Vehículos obtenidos correctamenteeeee',
      data: vehiculos
    });


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos',
      error: error.message
    });
  }
};


export const CreateVehiculos = async (req,res) =>{
    try {
    const { placa, color,tipo, modelo, marca } = req.body;
    console.log(req.body)
    const vehiculo = await Vehiculos.findOne({ where: { placa } });
    if (vehiculo) {
        return res.status(400).json({
            sucess: false,
            message: 'la placa del vehiculo ya existe',
            })
    }

    const user = await Vehiculos.create({ placa,tipo, color, modelo, marca });
    res.status(201).json({
        sucess: true,
        message: 'Vehículo creado correctamente',
        data: user
     
    });
   } catch (error) {
     console.error('Error:', error);
     res.status(500).json({
        sucess: false,
        message: 'Error al crear vehículo',

    });
   }
}


export const getEspacioVehiculo = async (req, res) => {
  try {
   
    const { tipo, estado } = req.query;

    const whereConditions = {};

   
    if (tipo) {
      whereConditions.tipo = tipo; 
    }
    
    if (estado) {
      whereConditions.estado = estado; 
    }

    const data = await Espacio.findAll({
      attributes: ["id", "numero", "estado", "tipo"],
      where: whereConditions, 
      include: {
        model: Vehiculos,
        attributes: ['id', 'placa', 'color', 'modelo', 'marca', "tipo"],
      },
    });

    res.status(200).json({
      success: true,
      message: 'Espacios en el parqueadero obtenidos correctamente',
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener espacios en el parqueadero',
      error: error,
    });
  }
};
export const getByidEspacio = async (req, res) => {
    const {id} = req.params
    try {
        const data = await Espacio.findAll({
          where: {
            numero: id
          },
          attributes: ["id", "numero", "estado", "tipo"],
          include: {
            model: Vehiculos,
            attributes: ['id', 'placa', 'color', 'modelo','marca']
          }
        });
        if(data.length === 0){
            return res.status(404).json({
                success: false,
                message: 'El espacio no existe'
            });
        }
        
      
  
      res.status(200).json({
        success: true,
        message: 'Espacio en el parqueadero obtenidos correctamente',
        data: data
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener espacio en el parqueadero',
        error: error
      });
    }
  };
  

  export const AsignarEspacios = async (req, res) => {
    const { id_vehiculoFK, tipo } = req.body;
    const { id } = req.params;
    try {
      const vehiculo = await Vehiculos.findOne({ where: { id: id_vehiculoFK } });
      if (!vehiculo) {
        return res.status(404).json({
          success: false,
          message: 'El vehículo no existe'
        });
      }
  
      const espacio = await Espacio.findOne({ where: { id_vehiculoFK } });
      if (espacio) {
        return res.status(400).json({
          success: false,
          message: 'El vehículo ya tiene un espacio asignado'
        });
      }
  
      const data = await Espacio.update(
        { estado:'ocupado', tipo, id_vehiculoFK},
        { where: { id } }
      );
      res.status(201).json({
        success: true,
        message: 'Espacio asignado correctamente',
        data: data
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Error al asignar espacio',
        error: error
      });
    }

  }



  export const getEspaciosDisponibles = async (req, res) => {
    const { estado } = req.query; 
  
 
    if (!estado || (estado !== 'libre' && estado !== 'ocupado')) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro de consulta "estado" es requerido y debe ser "libre" o "ocupado".'
      });
    }
  
    try {
      const data = await Espacio.findAll({
        where: {
          estado: estado 
        },
        attributes: ["id", "numero", "estado", "tipo"],
        include: {
          model: Vehiculos,
          attributes: ['id', 'placa', 'color', 'modelo', 'marca']
        }
      });
  
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron espacios con el estado especificado.'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Espacios en el parqueadero obtenidos correctamente',
        data: data
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener espacios en el parqueadero',
        error: error.message
      });
    }
  };


export const actualizarEspacio = async (req, res) => {
  const { id } = req.params; // Extraer el ID del espacio de los parámetros de la ruta
  const { estado, tipo, id_vehiculoFK } = req.body; // Extraer los datos del cuerpo de la solicitud

  try {
    // Verificar si el espacio existe
    const espacio = await Espacio.findOne({ where: { id } });
    if (!espacio) {
      return res.status(404).json({
        success: false,
        message: 'El espacio no existe',
      });
    }

   
    const espacioActualizado = await Espacio.update(
      { estado, tipo, id_vehiculoFK },
      { where: { id } }
    );

    res.status(200).json({
      success: true,
      message: 'Espacio actualizado correctamente',
      data: espacioActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar el espacio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el espacio',
    });
  }
};


export const crearEspacio = async (req, res) => {
  const { numero, estado, tipo, id_vehiculoFK } = req.body;

  try {
    // Verificar si el número ya existe
    const espacioExistente = await Espacio.findOne({ where: { numero } });
    if (espacioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El número de espacio ya existe',
      });
    }

    // Crear el nuevo espacio
    const nuevoEspacio = await Espacio.create({
      numero,
      estado,
      tipo,
      id_vehiculoFK,
    });

    res.status(201).json({
      success: true,
      message: 'Espacio creado con éxito',
      data: nuevoEspacio,
    });
  } catch (error) {
    console.error('Error al crear el espacio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el espacio',
    });
  }
};

export const editarVehiculo = async (req, res) => {
  try {
    const { id_vehiculo } = req.params;
    const { placa, color, modelo, marca } = req.body;

    // Buscar el vehículo por ID
    const vehiculo = await Vehiculos.findByPk(id_vehiculo);

    if (vehiculo) {
   
      if (placa !== undefined) vehiculo.placa = placa;
      if (color !== undefined) vehiculo.color = color;
      if (modelo !== undefined) vehiculo.modelo = modelo;
      if (marca !== undefined) vehiculo.marca = marca;

      // Guardar los cambios
      await vehiculo.save();

      return res.status(200).json({
        success: true,
        message: 'Vehículo actualizado correctamente',
        data: vehiculo
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'El vehículo no existe'
      });
    }
  } catch (error) {
    console.error('Error al actualizar el vehículo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el vehículo'
    });
  }
};