const mongoose = require('mongoose');
const usuario = mongoose.model('Usuario');

exports.formCrearUsuario = (req, res) => {
    res.render('crear-usuario')

};

exports.validarRegistro = (req,res,next)=>{
    req.sanitizeBody('Nombre').escape()
    req.sanitizeBody('Email').escape()
    req.sanitizeBody('Contraseña').escape()

    req.checkBody('Nombre','El Nombre es Obligatorio').notEmpty();
    req.checkBody('Email','El Email no pude ir vacio').notEmpty();
    req.checkBody('Contraseña','La Contraseña es Obligatoria').notEmpty();

    const errores = req.validationErrors();
  

    if(errores){
        req.flash('error',errores.map(error => error.msg));
        res.redirect('/crear-cuenta');
    }else{
        next();
    }
    return;
}

exports.CrearUsuario = async (req,res,next) => {
    const Usuario = new usuario(req.body);
    try {
        await Usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error)
        res.redirect('/crear-cuenta');
    }

}

exports.formIniciarSesion = (req,res)=>{
    res.render('iniciar-sesion');
}
