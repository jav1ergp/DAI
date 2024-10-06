import { MongoClient } from 'mongodb'

console.log( '🏁 seed.js ----------------->')

const USER_DB = process.env.USER_DB
const PASS    = process.env.PASS
  
const url    = `mongodb://${USER_DB}:${PASS}@localhost:27017`
const client = new MongoClient(url);

const dbName = 'myProject';
  
// función asíncrona
async function Inserta_datos_en_colección (colección, url) {
                                  
  try {
      const datos = await fetch(url).then(res => res.json())
      console.log(datos)

      await client.connect(); //Conexion bd
      const db = client.db(dbName);
      const col_users = db.collection(colección); //users y productos
      
      await col_users.insertMany(datos);
    
      // ... Insertar datos en la BD aquí
      return `${datos.length} datos traidos para ${colección}`

  } catch (err) {
      err.errorResponse += ` en fetch ${colección}`
      throw err    
  }
}

import axios from 'axios'; // Para hacer peticiones HTTP
import fs from 'fs'; // Trabajar con rchivos
import path from 'path'; // Rutas de archivos

async function descargarProductosConImagenes(apiUrl) {
  const imageFolder = path.join(process.cwd(), 'images'); // Usa el directorio actual de trabajo
  if (!fs.existsSync(imageFolder)) fs.mkdirSync(imageFolder); // Crear carpeta si no existe

  try {
    const { data: productos } = await axios.get(apiUrl); // Petición a la API

    productos.forEach(async (producto) => {
      const nombreArchivo = `${producto.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      const rutaCompleta = path.join(imageFolder, nombreArchivo);

      const writer = fs.createWriteStream(rutaCompleta);
      const imgResponse = await axios.get(producto.image, { responseType: 'stream' });

      imgResponse.data.pipe(writer);
      writer.on('finish', () => console.log(`Imagen de ${producto.title} guardada como ${nombreArchivo}`));
    });
  } catch (error) {
    console.error('Error al obtener productos o imágenes:', error);
  }
}
  
// Inserción consecutiva
Inserta_datos_en_colección('productos', 'https://fakestoreapi.com/products')
   .then((r)=>console.log(`Todo bien: ${r}`))                                 // OK
   .then(()=>Inserta_datos_en_colección('usuarios', 'https://fakestoreapi.com/users'))
   .then((r)=>console.log(`Todo bien: ${r}`))                                // OK
   .catch((err)=>console.error('Algo mal: ', err.errorResponse))             // error
  

console.log('Lo primero que pasa')
descargarProductosConImagenes('https://fakestoreapi.com/products');