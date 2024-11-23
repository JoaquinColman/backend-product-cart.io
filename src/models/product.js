
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, default: true },
  thumbnails: { type: [String], default: [] }
});

// Crear el modelo a partir del esquema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
