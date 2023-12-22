const passport = require("passport");
const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const usuario = mongoose.model('Usuario')

passport.use(new localStrategy({
    usernameField:'Email',
    passwordField:'Contraseña'
},async (Email,Contraseña,done)=>{
    try {
        const Usuario = await usuario.findOne({Email})
        if(!Usuario) return done(null,false,{
            message:'Usuario no Existente'
        });

        // Verificar usuario 
        const verficarContra = Usuario.compararContraseña(Contraseña);
        if(!verficarContra) return done(null,false,{
            message:'Contraseña Invalida'
        });

        // Email exista y passoword correcto
        return done(null,Usuario);
    } catch (error) {
        // Usuario no existe
        return done(null,false,{
            message:'Esa cuenta no existe'
        });
    }
} ));

    // Serealizar usuario
    passport.serializeUser((Usuario,callback) => {
        callback(null,Usuario);
    })
    // Deserializar usuario
    passport.deserializeUser((Usuario,callback) => {
        callback(null,Usuario);
    });

    // Exportar
    module.exports = passport;
