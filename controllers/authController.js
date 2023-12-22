const passport = require('passport');
const Crypto = require('crypto');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario')

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos Campos son Obligatorios'
})

// Verificar Usuario
exports.usuarioAutenticado = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    // Sino  esta autenticado,redirigir a iniciar sesion
    return res.redirect('/iniciar-sesion');
}

// Cerrar Sesion
exports.cerrarSesion = (req,res,next) => {
    req.logout((function(err){
        if(err){
            return next(err);
        }
    }))
    req.flash('correcto','Cerraste sesion correctamente');
    res.redirect('/iniciar-sesion');
    next();
}

// Formulario para restablecer Contraseña
exports.formRestContraseña = (req,res) => {
    res.render('restablecer-contraseña');
}

exports.EnviarToken = async (req,res,next)=> {
    const Email = req.body.Email;
    const usuario = await Usuario.findOne({Email})

    if(!usuario){
        req.flash('error','Usuario no Encontrado');
        return res.redirect('/iniciar-sesion');
    }

    // Usuario existe ,generar token 
    usuario.Token = Crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 36000000;

    // Gurdar en BD
    usuario.save();
    
    
    const ResetUrl = `http://${req.headers.host}/restablecer-contraseña/${usuario.Token}`;
    console.log(ResetUrl);

    // Todo Correcto yo que me alegro
    req.flash('correcto','Revisa tu casilla de Email!');
    res.redirect('/iniciar-sesion');
}

exports.ValidarToken = async (req,res) => {
    const Token = req.params.Token;
    const usuario = await Usuario.findOne({Token});

    // Si no existe Usuario
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/restablecer');
    }

    // Formulario para generar Contraseña Nueva
    res.render('resetPassword');
}

exports.ActualizarContraseña = async(req,res) =>{
    // Verificar El token Segun fecha de Expiracion
    const usuario = await Usuario.findOne({
        Token:req.params.Token,
        expira:{$gt:Date.now()}
    });

    // Verificar que el usuario exista
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/restablecer');
    }

    // Blanqueando los elementos de BD
    usuario.Token = null
    usuario.expira = null
    usuario.Contraseña = req.body.Contraseña

    // Guardar Nueva Contraseña
    await usuario.save();

    req.flash('correcto','Tu contraseña se ha cambiado correctamente');
    res.redirect('/iniciar-sesion');
}