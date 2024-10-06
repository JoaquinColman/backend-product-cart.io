const fs = require('fs').promises;
const path = require('path');

const cartsFilePath = path.join(__dirname, 'carts.json');

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

module.exports = {
  carts,
  loadCarts,
  saveCarts
};
