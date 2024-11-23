const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const productsRouter = require('./Routes/products').router;
const cartsRouter = require('./Routes/carts').router;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar la conexión a MongoDB
const mongoURI = 'mongodb://localhost:27017/proyectoFinalBackend';  // Usa tu URI aquí

mongoose.connect(mongoURI, {
  useNewUrlParser: true,  // Usar el nuevo analizador de URL
  useUnifiedTopology: true  // Usar la nueva topología de conexión
})
.then(() => console.log('Conectado a MongoDB de manera exitosa'))
.catch(err => console.log('Error de conexión a MongoDB: ', err));

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Servir archivos estáticos
app.use(express.static('public'));

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
