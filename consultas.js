import { MongoClient } from 'mongodb';

console.log('🏁 consultas.js ----------------->');

const USER_DB = process.env.USER_DB
const PASS    = process.env.PASS

const url    = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);
const dbName = 'myProject';

async function conectarDB() {
    try {
        await client.connect(); // Conectar a la base de datos
        console.log('Conexión exitosa a la base de datos.');
        return client.db(dbName);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
}

async function cerrarDB() {
    await client.close(); // Cerrar la conexión a la base de datos
    console.log('Conexión cerrada.');
}

async function Productos100(db) {
    const col_productos = db.collection('productos'); // Colección productos
    const productos100 = await col_productos.find({ price: { $gt: 100 } }).toArray();
    console.log('Productos de más de 100$: ', productos100);
}

async function ProductosWinter(db) {
    const col_productos = db.collection('productos'); // Colección productos
    const productos_winter = await col_productos.find({ description: /winter/i }).sort({ price: 1 }).toArray();
    console.log('Productos que contienen winter en la descripción, ordenados por precio: ', productos_winter);
}

async function ProductosJoyeria(db) {
    const col_productos = db.collection('productos'); // Colección productos
    const productos_joyeria = await col_productos.find({ category: 'jewelery' }).sort({ 'rating.rate': 1 }).toArray();
    console.log('Productos de joyería ordenados por rating: ', productos_joyeria);
}

async function TotalReseñas(db) {
    const col_productos = db.collection('productos'); // Colección productos
    const reseñas = await col_productos.aggregate([{ $group: { _id: null, total_reseñas: { $sum: '$rating.count' } } }]).toArray();
    console.log('Total de reseñas: ', reseñas);
}

async function RatingMedio(db) {
    const col_productos = db.collection('productos'); // Colección productos
    const rating_medio = await col_productos.aggregate([{ $group: { _id: '$category', media_rating: { $avg: '$rating.rate' } } }]).toArray();
    console.log('Puntuación media por categoría: ', rating_medio);
}

async function UsersSinDigitos(db) {
    const col_productos = db.collection('usuarios'); // Colección usuarios
    const usuarios = await col_productos.find({ password: { $not: /\d/ } }).toArray();
    console.log('Usuarios sin dígitos en la contraseña: ', usuarios);
}

async function main() {
    const db = await conectarDB(); // Conectar a la base de datos

    try {
        await Productos100(db);
        await ProductosWinter(db);
        await ProductosJoyeria(db);
        await TotalReseñas(db);
        await RatingMedio(db);
        await UsersSinDigitos(db);
    } catch (error) {
        console.error("Error al ejecutar las consultas:", error);
    } finally {
        await cerrarDB(); // Cerrar la conexión al final
    }
}

main();
