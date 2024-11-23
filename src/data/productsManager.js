const Product = require('../models/product');

const loadProducts = async () => {
  try {
    return await Product.find(); 
  } catch (error) {
    console.error('Error al obtener productos desde MongoDB:', error);
    throw error;
  }
};

const saveProducts = async (products) => {
  try {
    
  } catch (error) {
    console.error('Error al guardar productos en MongoDB:', error);
  }
};

module.exports = {
  loadProducts,
  saveProducts
};
