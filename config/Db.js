const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://viciconteezequiel:Bocala122014@tiendacluster.nvt3qcw.mongodb.net/TiendaVirtual',{useNewUrlParser:true});

mongoose.connection.on('error',(error) =>{
    console.log(error);
})

// Importar Modelos
require('../Modelos/Usuarios');
require('../Modelos/Productos');
require('../Modelos/Direcciones');
require('../Modelos/Ordenes');

