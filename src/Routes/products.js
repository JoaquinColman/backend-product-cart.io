const express = require('express');
const router = express.Router();
const fs = require('fs').promises; // Importar fs/promises para operaciones asíncronas
const path = require('path'); // Para manejar rutas de archivos

// Definir la ruta al archivo products.json dentro de la carpeta data
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Inicializar el array de productos
let products = [];

// Función para cargar productos desde products.json
const loadProducts = async () => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    products = JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si el archivo no existe, inicializar con un array vacío y crear el archivo
      products = [];
      await saveProducts();
    } else {
      console.error('Error al leer products.json:', error);
    }
  }
};

// Función para guardar productos en products.json
const saveProducts = async () => {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al escribir en products.json:', error);
  }
};

// Cargar los productos al iniciar el servidor
loadProducts();

// Ruta GET para obtener todos los productos
router.get('/', async (req, res) => {
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params; // Obtener el ID del producto desde los parámetros de la URL
  const product = products.find(p => p.id === pid);

  if (!product) {
    return res.status(404).send({ error: 'Product not found' }); // Si no se encuentra el producto, retornar error 404
  }

  res.status(200).json(product); // Enviar el producto como respuesta
});
// Ruta POST para agregar un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  // Validar que todos los campos obligatorios estén presentes
  if (!title || !description || !code || price === undefined || stock === undefined || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Generar un ID único basado en el máximo ID existente
  let newId;
  if (products.length === 0) {
    newId = 1;
  } else {
    const maxId = Math.max(...products.map(p => parseInt(p.id, 10)));
    newId = maxId + 1;
  }

  const newProduct = {
    id: String(newId), // Asegurarse de que el ID sea una cadena
    title,
    description,
    code,
    price,
    stock,
    category,
    status: true, // Status por defecto es true
    thumbnails: thumbnails || [] // thumbnails es opcional
  };

  products.push(newProduct); // Agregar el nuevo producto al array

  await saveProducts(); // Guardar los cambios en products.json

  res.status(201).json(newProduct); // Enviar respuesta con el producto agregado
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

// Ruta DELETE para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params; // Obtener el ID del producto desde los parámetros de la URL
  const productIndex = products.findIndex(p => p.id === pid); // Buscar el índice del producto

  if (productIndex === -1) {
    return res.status(404).send({ error: 'Product not found' }); // Si no se encuentra el producto, retornar error 404
  }

  products.splice(productIndex, 1); // Eliminar el producto del array

  await saveProducts(); // Guardar los cambios en products.json

  res.status(200).send({ message: 'Product deleted successfully' }); // Confirmar eliminación
});

module.exports = router; 



