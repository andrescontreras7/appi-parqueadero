import express from 'express';

import { obtenerVehiculosMasDe7Dias,obtenerTodasLasEntradasSalidas, registrarSalidaVehiculo,registrarEntradaVehiculo } from '../controller/entradas.controller.js';


const entradas = express.Router();


entradas.get('/api/vehiculos/entradas-salidas',  obtenerTodasLasEntradasSalidas);
entradas.get('/api/vehiculos/mas-7-dias', obtenerVehiculosMasDe7Dias);
entradas.post('/api/vehiculos/registrar/entrada', registrarEntradaVehiculo);
entradas.post('/api/vehiculos/registrar/salida', registrarSalidaVehiculo);

export default entradas;
