const mongoose = require('mongoose');

const OrdenesSchema = new mongoose.Schema({
    Nombre:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Payment_id:{
        type:Number,
        unique:true,
        required:true
    },
    Status:{
        type:String,
        required:true
    },
    TipoEnvio:{
        type:Number,
        required:true
    },
    FechaCompra:Date,
    Payment_type:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Ordenes',OrdenesSchema);