const express = require('express');
const app = express();
const productsRouter = require('./Routes/products');
const cartsRouter = require('./Routes/carts');  

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter); 

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
