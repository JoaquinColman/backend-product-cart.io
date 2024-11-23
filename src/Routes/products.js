
const express = require('express');
const router = express.Router();
const Product = require('../models/product');  


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();  
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});


router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  try {
    const newProduct = new Product({  
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails
    });

    await newProduct.save();  
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto.' });
  }
});

module.exports = { router };



