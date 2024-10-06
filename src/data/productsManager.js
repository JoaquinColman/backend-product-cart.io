
const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, 'products.json');

let products = [];

const loadProducts = async () => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    products = JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      products = [];
    } else {
      console.error('Error al leer products.json:', error);
    }
  }
};


loadProducts();

module.exports = {
  products,
  loadProducts
};
