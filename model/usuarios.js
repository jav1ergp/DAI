import mongoose from "mongoose";

const UsuariosSchema = new mongoose.Schema({
    "username": {
      "type": "String",
      "unique": true,
    },
    "password": {
      "type": "String"
    },
    "admin": {
    "type": "Boolean",
    "default": false,
    "required": false
  }
})
const Usuarios = mongoose.model("usuarios", UsuariosSchema);
export default Usuarios;
