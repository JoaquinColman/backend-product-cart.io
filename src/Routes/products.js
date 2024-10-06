
const express = require('express');
const router = express.Router();
const { products, loadProducts, saveProducts } = require('../data/productsManager');
const io = require('../app'); 


loadProducts();

router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || price === undefined || stock === undefined || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  let newId;
  if (products.length === 0) {
    newId = 1;
  } else {
    const maxId = Math.max(...products.map(p => parseInt(p.id, 10)));
    newId = maxId + 1;
  }

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

  res.status(201).json(newProduct);
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params; 
  const productIndex = products.findIndex(p => p.id === pid); 

  if (productIndex === -1) {
    return res.status(404).send({ error: 'Product not found' }); 
  }

  products.splice(productIndex, 1);
  await saveProducts();

  io.emit('updateProducts', products); 

  res.status(200).send({ message: 'Product deleted successfully' });
});

module.exports = router; 




