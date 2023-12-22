const DireccionBD = require('../Modelos/Direcciones')
const Usuarios = require('../Modelos/Usuarios');
const ProductosBD = require('../Modelos/Productos');
const enviarEmail = require('../handlers/email')
const Ordenes = require('../Modelos/Ordenes');
const PDF = require('pdfkit-construct');
const Crypto = require('crypto')
const fs = require('fs')

//Importar Merado Pago
const {MercadoPagoConfig,Preference} = require('mercadopago');

//Agregar Credenciales
const client = new MercadoPagoConfig({accessToken:'TEST-6750348148530075-112820-421b21ce12f0cba0d02c388040736a28-707192335'})

var preference = {
    body:{
        items:[],
        back_urls:{},
        payer:{},
        shipments:{
            "cost":0,
            "mode":'not_specified'
        },
        auto_return:'approved',
        payment_methods:{
            "installments":1
        },
        statement_descriptor:"TecnoCelus"
    }
}

exports.mostrarCarrito =  (req,res)=>{
    res.render('Carrito');
}

exports.DatosdeCompra = async(req,res)=>{
    const UsuarioId = req.user._id;
    const Direcciones = await DireccionBD.find({
        UsuarioId
    })

    const {Nombre,Email} = req.user;
    res.render('DatosEntrega',{
        Direcciones,
        Nombre,
        Email
    })
}

exports.TomarDirecciones = async(req,res)=>{
    const Direcciones = await DireccionBD.find();
    res.send(Direcciones);
}

exports.TipoEnvio = async(req,res)=>{
    res.render('TipoEnvio')
}

//** Pasarela de Pago */
exports.PasareladePago = (req,res)=>{
    res.render('PasarelaDePago')
}


exports.mostrarCheckoutMP = async (req,res,next)=> {
    const Productos = req.body.Productos;
    const Direccion = req.body.Direccion;
    const TipoEnvio = req.body.TipoEnvio;

    const Email = req.session.passport.user.Email;
    const usuario = await Usuarios.findOne({Email});
    const productoBD = await ProductosBD.find();


    for(let i = 0;i < Productos.length;i++){
        const id = Productos[i].id;
        let Precio;
        productoBD.forEach(productoBD => {
            if(id == productoBD._id){
                Precio = productoBD.Precio
            }
        });

        preference.body.items.push({
            title:Productos[i].Nombre,
            unit_price:Number(Precio),
            currency_id: 'ARS',
            quantity: Number(Productos[i].Cantidad)
        });

        preference.body.payer = {
            "name": usuario.Nombre,
            "Email":usuario.Email,
            "phone":{
                "area_code":'11',
                "number":Number(Direccion.Telefono)
            },
            "address":{
                "street_name":Direccion.Calle,
                "zip_code": Direccion.CP
            }
        }

        preference.shipments = {
            'id': TipoEnvio.TipoEntrega
        }
    }
    const UrlLocal =  req.protocol

    preference.body.back_urls = {
        "success":`${UrlLocal}://localhost:3000/success`,
        "failure":`${UrlLocal}://localhost:3000/rejected`,
        "pending":`${UrlLocal}://localhost:3000/feedback`,
    }

    if(preference.body.items.length == 0){
        res.redirect('/');
        return next();
    }

    const result = new Preference(client);
    await result.create(preference).then((result)=> res.json(result.sandbox_init_point))

}

exports.FinalizarCompra = async (req,res,next)=>{
    const Datos = req.query;
    const Comprador = req.user;
    const TipoEnvio = preference.shipments.id;

    if(Datos.status == 'null'){
        res.redirect('/');
        preference.items = [];
        return next();
    }

    let order = ({
        Nombre:Comprador.Nombre,
        email:Comprador.Email,
        Payment_id: Datos.payment_id,
        Status:Datos.status,
        TipoEnvio,
        FechaCompra:new Date(),
        Payment_type:Datos.payment_type
    });

    try {
        await Ordenes.create(order)
    } catch (error) {
        console.log(error);
    }

    var options = {weekday:'long',year:"numeric",month:'long',day:"numeric"}
    const Productos = preference.body.items;
    const Direccion = preference.body.payer.address.street_name;
    
    let Total = 0;
    let TotalFinal = 0;
    Productos.forEach(Producto =>{
        const Precio = Number(Producto.unit_price);
        const Cantidad = Number(Producto.quantity);
        Total = Precio * Cantidad;
        TotalFinal = TotalFinal + Precio * Cantidad; 
    })

    //** Crear PDF  Factura **/
    const doc = new PDF();

    doc.setDocumentHeader({
        height:'20'
    },()=>{
        doc.fontSize(14).text('Tienda Virtual Factura',{
            width:420,
            align:'center'
        });
        doc.fontSize(12);
        doc.text(`Nombre:${Comprador.Nombre}`,{
            width:420,
            align:'left'
        });
        doc.text(`Email:${Comprador.Email}`,{
            width:420,
            align:'left'
        });
        doc.text(`Direccion:${Direccion}`,{
            width:420,
            align:'left'
        });
        doc.text(`Fecha de Compra:${new Date().toLocaleDateString("es-es",options)}`,{
            width:420,
            align:'left'
        });
    });

    doc.addTable([
        {key:'title',label:'Producto',align:'left'},
        {key:'unit_price',label:'Precio Unit',align:'left'},
        {key:'quantity',label:'Cantidad',align:'left'}
    ],Productos,{
        border:null,
        width:'fill_body',
        striped:true,
        cellsPadding:10,
        marginLeft:45,
        marginRight:45,
        headAlign:'center'
    });

    doc.setDocumentFooter({
        height:'30'
    },()=>{
        doc.fontSize(15).text(`Total:$${TotalFinal}`)
    });

    doc.render();

    const NombrePdf = `Factura${Crypto.randomBytes(5).toString('hex')}`;
    doc.pipe(fs.createWriteStream(`./public/Facturas/${NombrePdf}.pdf`))

    doc.end();

    // Enviar notificacion por email
    await enviarEmail.EnviarFactura({
        usuario:Comprador,
        subject:'Orden de Compra',
        NombrePdf,
        Archivo:'OrdendeCompra'
    })

    


}
