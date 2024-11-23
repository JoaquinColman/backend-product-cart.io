
const Cart = require('../models/cart');  


const loadCarts = async () => {
  try {
    return await Cart.find().populate('products.product');  
  } catch (error) {
    console.error('Error al obtener carritos desde MongoDB:', error);
    throw error;
  }
};


const saveCart = async (cart) => {
  try {
    return await cart.save();  
  } catch (error) {
    console.error('Error al guardar carrito en MongoDB:', error);
    throw error;
  }
};


const createCart = async () => {
  const newCart = new Cart({ products: [] }); 
  return await saveCart(newCart);
};

module.exports = {
  loadCarts,
  saveCart,
  createCart
};

