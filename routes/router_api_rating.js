import express from "express";
import Usuarios from "../model/usuarios.js";
import Productos from "../model/productos.js";
const router = express.Router();

router.get('/', async (req, res)=>{ 
    try {
        const desde = parseInt(req.query.desde) || 0;
        const hasta = parseInt(req.query.hasta) || 5;
    
        if (desde < 0 || hasta <= desde) {
          return res.status(400).json({ 
            error: true, 
            message: "'desde' debe ser >= a 0 y 'hasta' mayor que 'desde'" 
          });
        }
        const productos = await Productos.find().select("rating").skip(desde).limit(hasta - desde);
        res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const ide = req.params.id;

    try {
        const producto = await Productos.findById(ide).select("rating");
        console.log(producto);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: error.message });
    }
});


router.put('/:id', async (req, res)=>{
    const ide = req.params.id;
    const rate = req.body.rate;

    try {
        const { rating } = await Productos.findById(ide).select("rating");
        console.log('rating:', rating);
        if(!rating) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const new_rate = (rating.rate * rating.count + rate) / (rating.count + 1);
        const new_rating = {rate: new_rate, count: rating.count + 1};

        const producto  = await Productos.findByIdAndUpdate(ide, { rating:new_rating }, { new:true, runValidators:true });
        console.log('Producto actualizado:', producto);
        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: error.message });
    }
});
  
export default router;