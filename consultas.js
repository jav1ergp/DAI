import { MongoClient } from 'mongodb'

console.log( '🏁 consultas.js ----------------->')

const USER_DB = process.env.USER_DB
const PASS    = process.env.PASS
  
const url    = `mongodb://${USER_DB}:${PASS}@localhost:27017`
const client = new MongoClient(url);

const dbName = 'myProject';

async function Productos100(){
    await client.connect(); // Conexion db
    const db = client.db(dbName); 
    const col_productos = db.collection('productos'); // Coleccion productos

    const productos100 = await col_productos.find({price: {$gt: 100}}).toArray();
    console.log('Productos de mas de 100$: ', productos100);
    await client.close();
}

async function ProductosWinter() {
    await client.connect(); // Conexion db
    const db = client.db(dbName); 
    const col_productos = db.collection('productos'); // Coleccion productos

    const productos_winter = await col_productos.find({description: /winter/i}).sort({price: 1}).toArray();
    console.log('Productos que contienen winter en la descripcion, ordenados por precio: ', productos_winter);
    await client.close();
}

async function ProductosJoyeria() {
    await client.connect(); // Conexion db
    const db = client.db(dbName); 
    const col_productos = db.collection('productos'); // Coleccion productos

    const productos_joyeria = await col_productos.find({category: 'jewelery'}).sort({'rating.rate': 1}).toArray();
    console.log('Productos de joyeria ordenados por rating: ', productos_joyeria);
    await client.close();
}

async function TotalReseñas() {
    await client.connect(); // Conexion db
    const db = client.db(dbName); 
    const col_productos = db.collection('productos'); // Coleccion productos

    const reseñas = await col_productos.aggregate([
                            {$group: {_id:null, total_reseñas: {$sum: '$rating.count'} } }]).toArray() //suma
    console.log('Total de reseñas: ', reseñas);
    await client.close();
    
}

async function RatingMedio() {
    await client.connect(); // Conexion db
    const db = client.db(dbName); 
    const col_productos = db.collection('productos'); // Coleccion productos

    const rating_medio = await col_productos.aggregate([
                            {$group: {_id:'$category', media_rating: {$avg: '$rating.rate'} } }]).toArray() //media
    console.log('Puntuacion media por categoria: ', rating_medio);
    await client.close();
}

async function UsersSinDigitos() {
    await client.connect(); // Conexion db
    const db = client.db(dbName); 
    const col_productos = db.collection('usuarios'); // Coleccion productos

    const usuarios = await col_productos.find({password: {$not: /\d/ } }).toArray()
    console.log('Usuarios sin digitos en la contraseña: ', usuarios);
    await client.close();
}

UsersSinDigitos()
  .then(() => {
    console.log('Consulta realizada correctamente.');
  })
  .catch((err) => {
    console.error('Error al ejecutar la consulta:', err);
  });