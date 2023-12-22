const express = require('express');
const router = express.Router();

// Importar Controlador
const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')
const tiendaController = require('../controllers/tiendaController');
const administracionController = require('../controllers/administracionController');
const checkoutController = require('../controllers/checkoutController');

module.exports = function (){
    // Ruta Home
    router.get('/',homeController.Home );

    /*** Seccion Cuentas ***/
    // Crear Usuario
    router.get('/crear-cuenta',usuariosController.formCrearUsuario);
    router.post('/crear-cuenta',usuariosController.validarRegistro,
    usuariosController.CrearUsuario);
    // Iniciar Sesion
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion',authController.autenticarUsuario)

    // Cerrar Sesion
    router.get('/cerrar-sesion',
    authController.usuarioAutenticado,
    authController.cerrarSesion);

    // Formulario para restablecer Contraseña
    router.get('/reestablecer',authController.formRestContraseña);

    // Enviar Token
    router.post('/restablecer',authController.EnviarToken)
    router.get('/restablecer-password/:Token',authController.ValidarToken);
    router.post('/restablecer-password/:Token',authController.ActualizarContraseña);

    // Mi cuenta
    router.get('/mi-cuenta',administracionController.MiCuenta)
    router.get('/mis-datos',administracionController.formEditarDatos)
    router.post('/mis-datos',administracionController.EditarDatos)

    // Mis Direcciones
    router.get('/direcciones',administracionController.Direcciones);
    router.get('/direcciones/Agregar',administracionController.formAgregarDireccion);
    router.post('/Direcciones/Agregar',administracionController.AgregarDireccion);

    // Editar Direccion
    router.get('/direcciones/Editar/:id',administracionController.formEditarDireccion)
    router.post('/direcciones/Editar/:id',administracionController.EditarDireccion)

    // Eliminar Direccion
    router.delete('/direcciones/Eliminar/:Id',administracionController.EliminarDireccion)

    // Seccion Tienda
    router.get('/Tienda',tiendaController.CrearTienda);
    router.get('/Tienda/:Url',tiendaController.ProductoUrl);

    // Editar Producto
    router.get('/Producto/Editar/:id',tiendaController.formEditarProducto);
    router.post('/Producto/Editar/:id',tiendaController.EditarProducto)

    // Seccion Carrito
    router.get('/carrito',checkoutController.mostrarCarrito)

    // Seccion Checkout
    router.get('/Datos-Compra',
    authController.usuarioAutenticado,
    checkoutController.DatosdeCompra
    )

    router.get('/TomarDirecciones',
    authController.usuarioAutenticado,
    checkoutController.TomarDirecciones
    )

    router.get('/Tipo-Envio',
    authController.usuarioAutenticado,
    checkoutController.TipoEnvio
    );
    //**** Pasarela de pago */
    router.get('/pasarela',
    authController.usuarioAutenticado,
    checkoutController.PasareladePago)


    //*** Checkout  ***/
    router.post('/checkout',
    authController.usuarioAutenticado,
    checkoutController.mostrarCheckoutMP)

    // Tipo de valores de pago

    router.get('/success',
    authController.usuarioAutenticado,
    checkoutController.FinalizarCompra
    )
    router.get('/rejected',
    authController.usuarioAutenticado,
    checkoutController.FinalizarCompra
    )

    return router;
}