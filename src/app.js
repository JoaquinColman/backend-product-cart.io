const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);


const io = socketIo(server);


const { loadProducts, saveProducts, products } = require('./data/productsManager');


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


const { router: productsRouter, setSocket } = require('./Routes/products');
setSocket(io); 
const cartsRouter = require('./Routes/carts');


app.use('/api/products', productsRouter);  
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
  await loadProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  await loadProducts();
  res.render('realTimeProducts', { products });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.emit('updateProducts', products);

  
  socket.on('createProduct', async (productData) => {
    const { title, description, code, price, stock, category, thumbnails } = productData;

    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
      socket.emit('error', 'Faltan campos obligatorios');
      return;
    }

    let newId = products.length === 0 ? 1 : Math.max(...products.map(p => parseInt(p.id, 10))) + 1;

    const newProduct = {
      id: String(newId),
      title,
      description,
      code,
      price,
      stock,
      category,
      status: true,
      thumbnails: thumbnails || []
    };

    products.push(newProduct);
    await saveProducts();

    io.emit('updateProducts', products);
  });

 
  socket.on('deleteProduct', async (productId) => {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      socket.emit('error', 'Producto no encontrado');
      return;
    }

    products.splice(productIndex, 1);
    await saveProducts();

    io.emit('updateProducts', products);
  });

  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});









