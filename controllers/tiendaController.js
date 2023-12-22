const productos = require('../Modelos/Productos');

exports.CrearTienda = async (req,res,next) => {
    const Productos = await productos.find();

    if(!Productos) return next();

    res.render('Tienda',{
        Productos
    })
}
exports.ProductoUrl = async (req,res,next) => {
    const Producto = await productos.findOne({Imagen:req.params.Url})
    res.render('Producto',{
        Producto
    })
}

// Editar Producto
exports.formEditarProducto = async (req,res,next)=>{
    const Producto = await productos.findOne({_id:req.params.id});
    
    if(!Producto) return next();
    
    // Render a la vista
    res.render('EditarProducto',{
        Producto
    });
}
exports.EditarProducto = async (req,res,next)=>{
    const productoActualizado = req.body;
    const Producto = await productos.findOneAndUpdate({_id:req.params.id},
        productoActualizado,{
            new:true,
            runValidators:true
        });

        // Notificacion
        req.flash('correcto','Cambios guardados correctamente');
        // Redirect
        res.redirect(`/Tienda/${Producto.Imagen}`);
}

