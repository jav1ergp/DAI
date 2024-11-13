// tienda.js 
import express   from "express"
import nunjucks  from "nunjucks"
import session from "express-session"
import connectDB from "./model/db.js"
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
connectDB()

const app = express()

const IN = process.env.IN || 'development'

nunjucks.configure('views', {         // directorio 'views' para las plantillas html
	autoescape: true,
	noCache:    IN == 'development',   // true para desarrollo, sin cache
	watch:      IN == 'development',   // reinicio con Ctrl-S
	express: app
})
app.set('view engine', 'html')

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))     // directorio public para archivos

app.use(session({
	secret: 'my-secret',      // a secret string used to sign the session ID cookie
	resave: false,            // don't save session if unmodified
	saveUninitialized: false  // don't create session until something stored
}))

app.use((req, res, next) => {  
	const carrito = req.session.cart || [];
	res.locals.carrito_vacio = carrito.length === 0; //variable para comprobar si esta vacio el carrito
	res.locals.usuario = req.username || null; //variable para comprobar si hay un usuario logeado
	next();
});

app.use(cookieParser())

// middleware de
const autentificación = (req, res, next) => {
	const token = req.cookies.access_token;
	if (token) {
		const data = jwt.verify(token, process.env.SECRET_KEY);
		req.username = data.username  // username en el request
		req.admin = data.admin // admin
	}
	next()
}
app.use(autentificación)
  
// Las demas rutas con código en el directorio routes
import TiendaRouter from "./routes/router_tienda.js"
app.use("/", TiendaRouter);
import LoginRouter from "./routes/router_usuarios.js"
app.use("/", LoginRouter);
//app.use("/api/ratings", ApiRatingsRouter)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en  http://localhost:${PORT}`);
})