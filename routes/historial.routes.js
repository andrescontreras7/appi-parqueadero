import express from 'express';
import { obtenerHistorial, obtenerHistorialPorVehiculo } from '../controller/historial.controller.js';

const historial = express.Router();

historial.get('/api/historial', obtenerHistorial);
historial.get('/historial/:id_vehiculo', obtenerHistorialPorVehiculo);

export default historial;