const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');


const cartsFilePath = path.join(__dirname, '..', 'data', 'carts.json');
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

let carts = [];


const loadCarts = async () => {
  try {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    carts = JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      carts = [];
      await saveCarts();
    } else {
      console.error('Error al leer carts.json:', error);
    }
  }
};


const saveCarts = async () => {
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error('Error al escribir en carts.json:', error);
  }
};


loadCarts();


router.post('/', async (req, res) => {
  const newCart = {
    id: carts.length + 1,  
    products: []  
  };

  carts.push(newCart);
  await saveCarts();

  res.status(201).json(newCart);
});


router.get('/:cid', async (req, res) => {
  const { cid } = req.params;  
  const cart = carts.find(c => c.id === parseInt(cid));

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  res.status(200).json(cart);
});


router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  
  let products;
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    products = JSON.parse(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al leer el archivo de productos' });
  }

 
  const cart = carts.find(c => c.id === parseInt(cid));
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  
  const product = products.find(p => p.id == pid); 
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

 
  const productInCart = cart.products.find(p => p.product === pid);
  if (productInCart) {
    productInCart.quantity += 1; 
  } else {
    cart.products.push({ product: pid, quantity: 1 }); 
  }

  await saveCarts();
  res.status(200).json(cart);
});

module.exports = router;
