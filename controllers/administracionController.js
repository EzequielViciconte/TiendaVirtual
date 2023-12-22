const usuarios = require('../Modelos/Usuarios');
const Direcciones = require('../Modelos/Direcciones');

exports.MiCuenta = async (req,res,next)=>{
    res.render('mi-cuenta')
}

exports.formEditarDatos = async (req,res,next)=>{
    const usuario = await usuarios.findOne({_id:req.user._id});
    res.render('mis-datos'),{
        usuario
    };
}
exports.EditarDatos = async (req,res,next)=>{
    const datosUsuario = req.body
    const usuario = await usuarios.findOneAndUpdate({_id:req.user._id},
        datosUsuario,{
            new:true,
            runValidators:true
        });
        
        req.user.Nombre = req.body.Nombre
        req.user.Email = req.body.Email
        // Notificacion
        req.flash('correcto','Cambios guardados correctamente');
        // Redirect
        res.redirect(`/mi-cuenta`);
}
// Mis Direcciones
exports.Direcciones = async (req,res) => {
    const UsuarioId = req.user._id
    const direcciones = await Direcciones.find({
            UsuarioId
    })
    res.render('Direcciones',{
        direcciones
    })
}
exports.formAgregarDireccion = async (req,res) => {
    const usuarioId = req.user._id;
    res.render('AgregarDireccion',{
        usuarioId
    });
}
exports.AgregarDireccion = async (req,res) => {
    const Direccion = new Direcciones(req.body)

    try {
        await Direccion.save();
        // Mensaje flash y redireccionar
        req.flash('correcto','Direccion Guardada Correctamente');
        res.redirect('/direcciones');
    } catch (error) {
        req.flash('error','Todos los campos son obligatorios');
        res.redirect('/direcciones/Agregar');
    }
}

// Editar Direccion
exports.formEditarDireccion = async (req,res) => {
    const id = req.params.id;
    const usuarioId = req.user._id;
    const Direccion = await Direcciones.findOne({
        _id:id
    });

    res.render('EditarDireccion',{
        Direccion,
        usuarioId
    });
}
exports.EditarDireccion = async (req,res) => {
    const Datos = req.body;
    const id = req.params.id;

    try {
        await Direcciones.findByIdAndUpdate({_id:id},Datos);
        req.flash('correcto','Editado Correctamente');
        res.redirect('/Direcciones');
    } catch (error) {
        req.flash('error','Todos los campos son obligatorios');
        res.redirect(`/Direcciones/Editar/${id}`);
    }
}

exports.EliminarDireccion = async (req,res)=>{
    const {Id} = req.params
    const Resultado = await Direcciones.deleteOne({_id:Id});
    res.json(Resultado);
}


