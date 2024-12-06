import express from 'express';
import { getVehiculos, getVehiculosAll, getVehiculosCnEspacio, CreateVehiculos,getEspacioVehiculo, actualizarEspacio, getByidEspacio, getEspaciosDisponibles,AsignarEspacios } from '../controller/vehiculos.controller.js';

const router = express.Router();


router.get('/vehiculos',getVehiculos);
router.get('/vehiculos/all',getVehiculosAll);

router.get('/vehiculos/conEspacio',getVehiculosCnEspacio); // vehiculos solo con espacio asigando
router.post('/vehiculos/create',CreateVehiculos);
router.get('/vehiculos/espacios', getEspacioVehiculo);
router.get('/vehiculos/espacio/:id', getByidEspacio)
router.post('/vehiculos/asignar-espacios/:id', AsignarEspacios)
router.put('/espacios/actualizar/:id', actualizarEspacio)

router.get('/espacios-disponibles', getEspaciosDisponibles)


export default router;
