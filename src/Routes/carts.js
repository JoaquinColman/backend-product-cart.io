
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');  
const Product = require('../models/product'); 


router.post('/', async (req, res) => {
  const newCart = new Cart({ products: [] });  

  try {
    await newCart.save();  
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito.' });
  }
});


router.get('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid).populate('products.product');  
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
});

module.exports = { router };


