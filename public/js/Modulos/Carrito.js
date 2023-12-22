//Importar Funciones
import { CantidadCarrito } from "./miniCarrito";
import { calcularTotal } from "./miniCarrito";
import { EliminarProducto } from "./miniCarrito";
import { actualizarInputCarrito } from "./miniCarrito";
import { CarritoVacio } from "./miniCarrito";
const Carrito = document.querySelector('.TablaCarrito');
const Comprar = document.querySelector('.FormularioCompra')
const TablaDireccion = document.querySelector('.TablaDireccion');
const UrlLocal = window.location.origin;

if(Carrito && TablaDireccion){
    Comprar.addEventListener('submit',checkout)
}

if(localStorage.getItem('productosCarrito')){
    TomarLocalStorage();
}

function checkout(e){
    e.preventDefault()
    pasarOrdenBack(e)
}


function TomarLocalStorage (){
    const tbodyTabla = document.querySelector('tbody');
    const Productos = JSON.parse(localStorage.getItem('productosCarrito'));
    const Direccion = JSON.parse(localStorage.getItem('direccion'));
    if(Productos.length == 0){
        CarritoVacio();
    }else{
        CompletarDireccion(Direccion)
        Productos.forEach(Producto => {
            if(Carrito){
                CompletarCarrito(Producto,tbodyTabla);
                llenarCarritoMiniStorage(Producto)
            }else{
                llenarCarritoMiniStorage(Producto)
            }
        });
    }
    document.querySelectorAll('.BtnEliminar').forEach(btnEliminar => {
        btnEliminar.addEventListener('click',EliminarProducto);
    })
}

function pasarOrdenBack(e){
    const Productos = Carrito.querySelectorAll('.ProductoIn');
    let arrProductos = [];
    Productos.forEach(producto =>{
        const Nombre = producto.querySelector('#Titulo').textContent;
        const Cantidad = producto.querySelector('#Cantidad').value;
        const id = producto.getAttribute('data-id')

        const productoJunto = {
            Nombre,
            id,
            Cantidad
        }
        arrProductos.push(productoJunto);
    })
    // Tomar Direccion
    const Direccion = TablaDireccion.querySelector('.DireccionIn'),
    Calle = Direccion.querySelector('.CartDireccion').textContent,
    CP = Direccion.querySelector('.CartCP').textContent,
    Telefono = Direccion.querySelector('.CartTelefono').textContent,
    TipoEnvio = JSON.parse(localStorage.getItem('TipoEntrega'));

    const arrDireccion = {
        Calle,
        CP,
        Telefono
    }

    const Conjunto = {
        Productos : arrProductos,
        Direccion : arrDireccion,
        TipoEnvio
    }
    if(arrProductos.length == 0){
        console.log('Carrito Vacio')
    }else{
        fetch(`${UrlLocal}/checkout`,{
            method:'POST',
            headers:{
                'Access-Control-Allow-Origins':'*',
                'Content-Type':'application/json'
            },
            body:JSON.stringify(Conjunto),
        })
        .then(function(config){
            return config.json();
        }).then(function(res){
            location.href = res
        })
    }
}

function CompletarDireccion(Direccion){
    // Pasar Direccion a la tabla
    const tablaDireccionBody =document.querySelector('.TablaDireccion tbody');
    if(tablaDireccionBody){
        const {Apellido,Calle,Ciudad,Numeracion,Telefono,CP} = Direccion
        // Tabla de Direccion
        const TablaDireccion = document.createElement('TR');
        TablaDireccion.classList.add('DireccionIn')
        TablaDireccion.innerHTML = `<td class="CartNombre"> ${Direccion.Nombre} ${Apellido} </td> 
        <td class="CartTelefono"> ${Telefono} </td>
        <td class="CartDireccion"> ${Calle} ${Numeracion} </td>
        <td class="CartCiudad"> ${Ciudad} </td>
        <td class="CartCP"> ${CP} </td>
         `
         tablaDireccionBody.append(TablaDireccion);
    }
}

function CompletarCarrito(Producto,tbodyTabla){
    const {Nombre,Precio,Cantidad,Imagen,id} = Producto;

    // Tabla de Producto
    const TablaProducto = document.createElement('TR');
    TablaProducto.setAttribute('data-id',id);
    TablaProducto.classList.add('ProductoIn');
    const PrecioElemento = Precio.replace('$','')

    TablaProducto.innerHTML = `<td class="CartImg"><img class="ImagenTabla" id="Imagen" src="${Imagen}"> </td>
    <td class"CartTitulo" id="Titulo">${Nombre} </td>
    <td class="Precio" id="Precio">$${PrecioElemento}</td>
    <td class="CartCant"><input id="Cantidad" class="CantidadCarrito" type="number" name="Cantidad" min="1" value=${Cantidad}> </td>
    <td class="CartBtn"> <button class="Boton BtnEliminar"> <span>Eliminar </span>  </button>
    <i class="fa-solid fa-circle-minus BtnEliminar BtnMovil"    
    </td> 
    <td class="TotalPrecio">$${PrecioElemento * Cantidad } </td>`
    tbodyTabla.append(TablaProducto);
} 

function llenarCarritoMiniStorage(ProductoLocal){
    const {Nombre,Precio,Cantidad,Imagen,id} = ProductoLocal;
    const DivCarrito = document.querySelector('.CarritoContenido');


    const Producto = document.createElement('DIV');
    Producto.classList.add('ProductosCarrito');
    Producto.setAttribute('data-id',id);
    Producto.innerHTML = `
    <img class="Imagen" id="Imagen" src='${Imagen}'>
    <div>
        <h3 class="ProductoNombre EnCarrito" id="Titulo">${Nombre}</h3>
        <p class="PrecioProducto" id="Precio">${Precio}</p>
        <input class="CantidadCarrito" type="number" placeholder='Cantidad' min='1' value="${Cantidad}">
    </div>
    <i class="fa fa-circle-xmark EliminarProducto"></i>`
    DivCarrito.append(Producto); 

    if(Producto){
        CantidadCarrito();
        calcularTotal();

        document.querySelectorAll('.CantidadCarrito').forEach(inputCantidad => {
            inputCantidad.addEventListener('click',actualizarInputCarrito)
        })
        document.querySelectorAll('.EliminarProducto').forEach(btnEliminar => {
            btnEliminar.addEventListener('click',EliminarProducto);
        })
    }
}


export default Carrito;