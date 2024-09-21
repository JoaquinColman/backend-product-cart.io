const express = require('express');
const router = express.Router();
const fs = require('fs').promises; 
const path = require('path'); 

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');


let products = [];

const loadProducts = async () => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    products = JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
     
      products = [];
      await saveProducts();
    } else {
      console.error('Error al leer products.json:', error);
    }
  }
};


const saveProducts = async () => {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al escribir en products.json:', error);
  }
};


loadProducts();


router.get('/', async (req, res) => {
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params; 
  const product = products.find(p => p.id === pid);

  if (!product) {
    return res.status(404).send({ error: 'Product not found' }); 
  }

  res.status(200).json(product); 
});

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

  res.status(201).json(newProduct); 
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, stock, category, thumbnails, status } = req.body;

  const productIndex = products.findIndex(p => p.id === pid);

  if (productIndex === -1) {
    return res.status(404).send({ error: 'Product not found' });
  }


  if (title !== undefined) products[productIndex].title = title;
  if (description !== undefined) products[productIndex].description = description;
  if (code !== undefined) products[productIndex].code = code;
  if (price !== undefined) products[productIndex].price = price;
  if (stock !== undefined) products[productIndex].stock = stock;
  if (category !== undefined) products[productIndex].category = category;
  if (thumbnails !== undefined) products[productIndex].thumbnails = thumbnails;
  if (status !== undefined) products[productIndex].status = status;

  await saveProducts(); 

  res.status(200).json(products[productIndex]); 
});


router.delete('/:pid', async (req, res) => {
  const { pid } = req.params; 
  const productIndex = products.findIndex(p => p.id === pid); 

  if (productIndex === -1) {
    return res.status(404).send({ error: 'Product not found' }); 
  }

  products.splice(productIndex, 1); 

  await saveProducts(); 

  res.status(200).send({ message: 'Product deleted successfully' }); 
});

module.exports = router; 



