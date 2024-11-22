import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/portada');
});

router.get('/portada', async (req, res)=>{
  try {
    const p = await Productos.findOne({category:"men's clothing"}).lean()
    const p1 = await Productos.findOne({category:"women's clothing"}).lean()
    const p2 = await Productos.findOne({category:"jewelery"}).lean()
    const p3 = await Productos.findOne({category:"electronics"}).lean()
    const usuario = req.username;
    const admin = req.admin;
    res.render('portada.html', { p, p1, p2, p3 , usuario , admin});    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.get('/men_clothing', async (req, res)=>{
  try {
    const usuario = req.username;
    const admin = req.admin;
    const productos = await Productos.find({ category: "men's clothing" }).lean(); // Obtenemos todos los productos de la categoría
    res.render('men_clothing.html', { productos , usuario , admin });    // Renderizamos portada.html con los productos
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.get('/women_clothing', async (req, res)=>{
  try {
    const usuario = req.username;
    const admin = req.admin;
    const productos = await Productos.find({category:"women's clothing"}).lean()
    res.render('women_clothing.html', { productos , usuario , admin });    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.get('/jewelery', async (req, res)=>{
  try {
    const usuario = req.username;
    const admin = req.admin;
    const productos = await Productos.find({category:"jewelery"}).lean()
    res.render('jewelery.html', { productos , usuario , admin });    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.get('/electronics', async (req, res)=>{
  try {
    const usuario = req.username;
    const admin = req.admin;
    const productos = await Productos.find({category:"electronics"}).lean()
    res.render('electronics.html', { productos , usuario , admin });    // ../views/portada.html, 
  } catch (err) {                                // se le pasa { productos:productos }
    res.status(500).send({err})
  }
})

router.post('/buscar', async (req, res)=>{
  try {
    const query = req.body.busqueda;
    const admin = req.admin;
    if (!query || query.length < 3) {
      return res.status(400).send({ err: "La busqueda tiene que tener al menos 3 caracteres" });
    }
    const productos = await Productos.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    res.render('resultados_busqueda.html', { productos, query , admin }); 

  } catch (err) {
    res.status(500).send({err})
  }
})

router.get('/agregar_carrito/:id', async (req, res)=>{
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

router.get('/editar_producto/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const producto = await Productos.findById(productId).lean();
    const admin = req.admin;  
    const usuario = req.username;

    if (!producto) {
      return res.status(404).send({ err: "Producto no encontrado" });
    }

    if (admin) {
      res.render('editar_producto.html', { producto, usuario, admin });
    } else {
      res.redirect('/portada');
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.post('/guardar_producto/:id', async(req, res) => {
  try {
    const _id = req.params.id; // url
    const { title, price, description } = req.body; // formulario

    const producto = await Productos.findByIdAndUpdate(_id, {title:title, price:price, description:description}, {new:true, runValidators:true})

    if (producto) {
      res.redirect('/portada');
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});


router.get('/ver_carrito', async (req, res)=>{
  const carrito = req.session.cart || [];
  const carrito_vacio = carrito.length === 0;
  let carrito_precio = 0
  const usuario = req.username
  for(let i = 0; i < carrito.length; i++){ // calcula el precio total del carrito
    const producto = carrito[i];
    carrito_precio += producto.price;  
  }

  res.render('ver_carrito.html', { carrito , carrito_precio , carrito_vacio , usuario });
});

// ... más rutas aquí
router.post('')

export default router