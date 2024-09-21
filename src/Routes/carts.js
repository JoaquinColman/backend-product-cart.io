const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Ruta del archivo carts.json
const cartsFilePath = path.join(__dirname, '..', 'data', 'carts.json');
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

let carts = [];

// Función para cargar carritos desde carts.json
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

// Función para guardar carritos en carts.json
const saveCarts = async () => {
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error('Error al escribir en carts.json:', error);
  }
};

// Cargar los carritos al iniciar el servidor
loadCarts();

// Ruta POST para crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = {
    id: carts.length + 1,  // Generar un ID único basado en el número de carritos
    products: []  // Array vacío de productos al inicio
  };

  carts.push(newCart);
  await saveCarts();

  res.status(201).json(newCart);
});

// Ruta GET para obtener productos de un carrito específico por su ID
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;  // Obtener el ID del carrito
  const cart = carts.find(c => c.id === parseInt(cid));

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  res.status(200).json(cart);
});

// Ruta POST para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  // Cargar los productos del archivo products.json
  let products;
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    products = JSON.parse(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al leer el archivo de productos' });
  }

  // Buscar el carrito por su ID
  const cart = carts.find(c => c.id === parseInt(cid));
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  // Buscar el producto por su ID
  const product = products.find(p => p.id == pid); // Cambiar a == para comparar cadenas y números
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Verificar si el producto ya existe en el carrito
  const productInCart = cart.products.find(p => p.product === pid);
  if (productInCart) {
    productInCart.quantity += 1; // Si ya existe, incrementar la cantidad
  } else {
    cart.products.push({ product: pid, quantity: 1 }); // Si no existe, agregarlo con cantidad 1
  }

  await saveCarts();
  res.status(200).json(cart);
});

module.exports = router;
