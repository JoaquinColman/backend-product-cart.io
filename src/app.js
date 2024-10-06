
const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const productsRouter = require('./Routes/products');
const cartsRouter = require('./Routes/carts');


const { loadProducts } = require('./data/productsManager');


const hbs = create({
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
  await loadProducts(); 
  const { products } = require('./data/productsManager'); 
  res.render('home', { products }); 
});

app.get('/realtimeproducts', async (req, res) => {
  await loadProducts(); 
  const { products } = require('./data/productsManager'); 
  res.render('realTimeProducts', { products });
});


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');


  socket.emit('updateProducts', require('./data/productsManager').products);


  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

module.exports = io;






