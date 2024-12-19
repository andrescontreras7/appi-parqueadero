import express from 'express';
import sequelize from './config/database.js';
import router from './routes/vehiculos.routes.js'; 
import entradas from './routes/entradas.routes.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import historial from './routes/historial.routes.js';
const app = express();
const port = 3002;

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});
app.use(cors());
app.use(bodyParser.json()); 
app.use(cors({ origin: 'http://localhost:3000' }));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
app.use(express.json());

app.use('/api', router);
app.use(entradas) 
app.use(historial)

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida exitosamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

testConnection();

