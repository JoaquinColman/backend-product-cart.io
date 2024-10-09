const express = require('express');
const router = express.Router();
const { loadProducts, saveProducts } = require('../data/productsManager');

let io; 

const setSocket = (socketIoInstance) => {
  io = socketIoInstance;
};


router.get('/', async (req, res) => {
  try {
    const products = await loadProducts(); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar los productos.' });
  }
});


router.get('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const products = await loadProducts();
    const product = products.find(p => p.id === pid);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});


router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || price === undefined || stock === undefined || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const products = await loadProducts();
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
    await saveProducts(products);

    io.emit('updateProducts', products);  

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto.' });
  }
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const products = await loadProducts();
    const productIndex = products.findIndex(p => p.id === pid);

    if (productIndex === -1) {
      return res.status(404).send({ error: 'Product not found' });
    }

    products.splice(productIndex, 1);
    await saveProducts(products);

    io.emit('updateProducts', products);  

    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

module.exports = {
  router,
  setSocket
};






