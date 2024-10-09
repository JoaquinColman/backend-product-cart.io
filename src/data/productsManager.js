const fs = require('fs').promises;
const path = require('path');


const productsFilePath = path.join(__dirname, '../data/products.json');


const loadProducts = async () => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Archivo products.json no encontrado.');
      return [];
    } else {
      console.error('Error al leer products.json:', error);
      throw error;
    }
  }
};

const saveProducts = async (products) => {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al escribir en products.json:', error);
  }
};

module.exports = {
  loadProducts,
  saveProducts
};
