import mongoose from "mongoose";
 
const ProductosSchema = new mongoose.Schema({
  "id": {
    "type": "Number",
    "unique": true
  },
  "title": {
    "type": String,
    match: /^[A-Z]/, // Empezar con mayuscula
  },
  "price": {
    "type": Number,
  },
  "description": {
    "type": String,
  }
})
const Productos = mongoose.model("productos", ProductosSchema);
export default Productos