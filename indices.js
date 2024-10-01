import { MongoClient } from 'mongodb'

const USER_DB = process.env.USER_DB
const PASS    = process.env.PASS
  
const url    = `mongodb://${USER_DB}:${PASS}@localhost:27017`
const client = new MongoClient(url);

const dbName = 'myProject';
const db = client.db(dbName)
const col_users = db.collection('users');
const col_productos = db.collection('productos');

// List the indexes on the collection and output them as an array
const indices_pro = await col_productos.listIndexes().toArray();
const indices_users = await col_usuarios.listIndexes().toArray();
// Print the list of indexes
console.log("Existing indexes:\n");

console.log(indices_pro)
console.log(indices_users)