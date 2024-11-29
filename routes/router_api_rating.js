import express from "express";
import Usuarios from "../model/usuarios.js";
import Productos from "../model/productos.js";
const router = express.Router();

router.get('/', async (req, res)=>{ 
    try {
        const desde = parseInt(req.query.desde) || 0;
        const hasta = parseInt(req.query.hasta) || 5;
    
        if (desde < 0 || hasta <= desde) { // error parametros 
            return res.status(400).json({ message: "'desde' debe ser >= a 0 y 'hasta' mayor que 'desde'" });
        }
        const productos = await Productos.find().select("rating").skip(desde).limit(hasta - desde);
        res.status(200).json(productos); // respuesta
    } catch (error) { // error server
        res.status(500).json({ error: true, message: error.message }); 
    }
});

router.get("/:id", async (req, res) => {
    const ide = req.params.id;
    try {
        const producto = await Productos.findById(ide).select("rating"); 
        if (!producto) {  
            return res.status(404).json({ message: "Producto no encontrado" }); // error parametros 
        }
        res.status(200).json(producto); // respuesta
    } catch (error) { // error server
        res.status(500).json({ error: true, message: error.message });
    }
});


router.put('/:id', async (req, res)=>{
    const ide = req.params.id;
    const rate = req.body.rate;
    try {
        const { rating } = await Productos.findById(ide).select("rating");
        if(!rating) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const new_rate = (rating.rate * rating.count + rate) / (rating.count + 1);
        const new_rating = {rate: new_rate, count: rating.count + 1};
        
        const producto  = await Productos.findByIdAndUpdate(ide, { rating:new_rating }, { new:true });
        res.json(producto); // respuesta
    } catch (error) { // error server
        res.status(500).json({ error: true, message: error.message });
    }
});
  
export default router;