import express from "express";
import Usuarios from "../model/usuarios.js";
import Productos from "../model/productos.js";
import jwt from "jsonwebtoken"

const router = express.Router();

router.get('/login', (req, res)=>{
  res.render("login.html")
})

router.post('/login', async (req, res)=>{ //Portada con post
  const p = await Productos.findOne({category:"men's clothing"}).lean()
  const p1 = await Productos.findOne({category:"women's clothing"}).lean()
  const p2 = await Productos.findOne({category:"jewelery"}).lean()
  const p3 = await Productos.findOne({category:"electronics"}).lean()
  const { username, password} = req.body;
  const user = await Usuarios.findOne({ username });

  if (!user || user.password !== password) { 
    res.render("login.html")
  } else {
    const token = jwt.sign({username: user.username, admin:user.admin}, process.env.SECRET_KEY)
    
    res.cookie("access_token", token, {            // cookie en el response
      httpOnly: true,
      secure: process.env.IN === 'production'      // en producción, solo con https
    }).render("portada", { usuario: user.username , admin: user.admin, p, p1, p2, p3});
  }
});

router.get('/logout', async (req, res) => {
  res.clearCookie('access_token').redirect('portada');
});
  
export default router;