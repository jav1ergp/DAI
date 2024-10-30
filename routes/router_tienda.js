import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

router.get('/portada', async (req, res)=>{
  try {
    const p = await Productos.findOne({category:"men's clothing"}).lean()
    const p1 = await Productos.findOne({category:"women's clothing"}).lean()
    const p2 = await Productos.findOne({category:"jewelery"}).lean()
    const p3 = await Productos.findOne({category:"electronics"}).lean()
    res.render('portada.html', { p, p1, p2, p3 })    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.get('/men_clothing', async (req, res) => {
  try {
    const productos = await Productos.find({ category: "men's clothing" }).lean(); // Obtenemos todos los productos de la categoría
    res.render('men_clothing.html', { productos });    // Renderizamos portada.html con los productos
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get('/women_clothing', async (req, res)=>{
  try {
    const productos = await Productos.find({category:"women's clothing"}).lean()
    res.render('women_clothing.html', { productos })    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.get('/jewelery', async (req, res)=>{
  try {
    const productos = await Productos.find({category:"jewelery"}).lean()
    res.render('jewelery.html', { productos })    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.get('/electronics', async (req, res)=>{
  try {
    const productos = await Productos.find({category:"electronics"}).lean()
    res.render('electronics.html', { productos })    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.post('/buscar', async (req, res) => {
  try {
    const query = req.body.busqueda;
    if (!query || query.length < 3) {
      return res.status(400).send({ err: "La busqueda tiene que tener al menos 3 caracteres" });
    }
    const productos = await Productos.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    res.render('resultados_busqueda.html', { productos, query }); 

  } catch (err) {
    res.status(500).send({err})
  }
})

router.get('/agregar_carrito/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productos = await Productos.findById(productId);

    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    if (productos) {
      req.session.cart.push(productos);
      return res.redirect('/ver_carrito');
    }
  } catch (err) {
    res.status(500).send({err})
  }
});


router.get('/ver_carrito', (req, res) => {
  const carrito = req.session.cart || [];
  const carrito_vacio = carrito.length === 0;
  let carrito_precio = 0

  for(let i = 0; i < carrito.length; i++){ // calcula el precio total del carrito
    const producto = carrito[i];
    carrito_precio += producto.price;  
  }

  res.render('ver_carrito.html', { carrito , carrito_precio , carrito_vacio });
});

// ... más rutas aquí
router.post('')

export default router