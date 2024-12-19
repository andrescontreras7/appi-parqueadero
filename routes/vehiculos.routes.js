import express from 'express';
import { getVehiculosSinEspacio, getVehiculosAll,editarVehiculo,obtenerDetalleVehiculo,crearEspacio, getVehiculosCnEspacio, CreateVehiculos,getEspacioVehiculo, actualizarEspacio, getByidEspacio, getEspaciosDisponibles,AsignarEspacios } from '../controller/vehiculos.controller.js';
import { validarCamposEspacio } from '../validators/espacios.validators.js';

const router = express.Router();


router.get('/vehiculos',getVehiculosSinEspacio);
router.get('/vehiculos/all',getVehiculosAll);
router.get('/vehiculo/:id_vehiculo',obtenerDetalleVehiculo);

router.get('/vehiculos/conEspacio',getVehiculosCnEspacio); // vehiculos solo con espacio asigando
router.post('/vehiculos/create',CreateVehiculos);
router.get('/vehiculos/espacios', getEspacioVehiculo);
router.get('/vehiculos/espacio/:id', getByidEspacio)
router.post('/vehiculos/asignar-espacios/:id', AsignarEspacios)
router.put('/espacios/actualizar/:id', actualizarEspacio)
router.put('/vehiculos/actualizar/:id_vehiculo', editarVehiculo)

router.post('/espacios/create/',validarCamposEspacio, crearEspacio)

router.get('/espacios-disponibles', getEspaciosDisponibles)


export default router;
