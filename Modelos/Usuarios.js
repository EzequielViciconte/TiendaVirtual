const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
    Email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true
    },
    Nombre:{
        type:String,
        require:'Agrega tu Nombre'
    },
    Contraseña:{
        type:String,
        required:true,
        trim:true
    },
    Token:String,
    expira:Date,
    Imagen:String
})

// Enviar alerta cuando el usuario este registrado
UsuarioSchema.post('save',function(error,doc,next){
    if(error.code === 11000){
        next('Ese correo esta Registrado');
    }else{
        next(error);
    }
})

// Metodo para Encriptado las contraseñas
UsuarioSchema.pre('save', async function(next){
    // Si ya esta Encriptado
    if(!this.isModified('Contraseña')){
        return next();
    }
    // Si no esta Encriptado
    const hash = await bcrypt.hash(this.Contraseña,12)
    this.Contraseña = hash;
    next();
})

// Autenticar Usuario
UsuarioSchema.methods = {
    compararContraseña: function(Contraseña) {
        return bcrypt.compareSync(Contraseña, this.Contraseña)
    }
};

module.exports = mongoose.model('Usuario',UsuarioSchema);