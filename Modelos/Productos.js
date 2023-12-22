const mongoose = require('mongoose');

const ProductosSchema = new mongoose.Schema({
    Titulo:{
        type:String,
        require:'El Titulo del producto es obligatorio'
    },
    Precio:{
        type:mongoose.Decimal128,
        require:'El Precio del producto es obligatorio'
    },
    Cantidad:{
        type:Number
    },
    Imagen:{
        type:String
    }
})

module.exports = mongoose.model('Productos',ProductosSchema);