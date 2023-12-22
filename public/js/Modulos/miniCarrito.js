import Swal from "sweetalert2";

const miniCarrito = document.querySelector('.BtnCarrito');
const BtnCerrar = document.querySelector('.CerrarCarrito');
const divCarrito = document.querySelector('.Carrito');
const Carrito = document.querySelector('.TablaCarrito');
miniCarrito.addEventListener('click',MostrarCarrito);
BtnCerrar.addEventListener('click',CerrarCarrito);

document.querySelectorAll('.BtnProductos').forEach(BtnAgregar => {
    BtnAgregar.addEventListener('click',agregarClickCarrito);
} )

const CarritoCont = document.querySelector('.CarritoContenido');

// Funciones
function agregarClickCarrito (e){
    const UrlActual = window.location.href;
    const UrlLocal = window.location.origin;
    const ProductoAct = window.location.pathname
    const ProductoNombre = ProductoAct.replace('/Tienda/','')

    const Boton = e.target.parentElement
    let Producto
    let Cantidad = 1

    if(UrlActual == `${UrlLocal}/Tienda/${ProductoNombre}`){
        Producto = Boton.parentElement.parentElement.parentElement.parentElement.parentElement
        Cantidad = Producto.querySelector('.CantidadCarrito').value
    }else{
        Producto = Boton.closest('.Productos');
    }

    const Nombre = Producto.querySelector('.ProductoNombre').textContent;
    const Imagen = Producto.querySelector('.ImagenProducto').src;
    const Precio = Producto.querySelector('.PrecioProducto').textContent;
    const id = Producto.getAttribute('data-id');

    añadirProductoCarrito(Nombre,Imagen,Precio,Cantidad,id);
    AlertaAñadido();
}



function MostrarCarrito (e) {
    e.preventDefault();
    divCarrito.classList.add('Visible');
}

function CerrarCarrito(){
    divCarrito.classList.remove('Visible')
}

// Funciones añadir carrito,aumentar cantidad,calcular total,etc
function añadirProductoCarrito (Nombre,Imagen,Precio,Cantidad,id) {
    const ElementosCarrito = CarritoCont.getElementsByClassName('EnCarrito');
    for(let i=0;i < ElementosCarrito.length;i++){
        if(ElementosCarrito[i].innerText == Nombre){
            let CantidadProducto = ElementosCarrito[i].parentElement.querySelector('.CantidadCarrito');
            CantidadProducto.value++;
            calcularTotal();
            const ProductoEnCarrito = getProductosCarrito();
            añadirLocalStorage('productosCarrito',ProductoEnCarrito);
            return;
        }
    }

    // Crear HTML Producto Carrito
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
    CarritoCont.append(Producto);

    CantidadCarrito();
    calcularTotal();

    document.querySelectorAll('.CantidadCarrito').forEach(inputCantidad => {
        inputCantidad.addEventListener('click',actualizarInputCarrito)
    })
    document.querySelectorAll('.EliminarProducto').forEach(btnEliminar => {
        btnEliminar.addEventListener('click',EliminarProducto);
    })

    const ProductoEnCarrito = getProductosCarrito();
    añadirLocalStorage('productosCarrito',ProductoEnCarrito);

}

function calcularTotal () {
    let Total = 0
    let TotalFinal = 0 
    let Productos;

    if(Carrito){
        Productos = document.querySelectorAll('.ProductoIn');
    }else{
        Productos = document.querySelectorAll('.ProductosCarrito');
    }
    

    Productos.forEach(producto =>{
        const ElementoPrecioProducto = producto.querySelector('#Precio');
        const PrecioProducto = Number(ElementoPrecioProducto.textContent.replace('$',''));
        const ElementoCantidadProducto = producto.querySelector('.CantidadCarrito');
        const CantidadCarrito = Number(ElementoCantidadProducto.value);

        Total= PrecioProducto * CantidadCarrito;
        TotalFinal = TotalFinal + Total;
        
        if(Carrito){
            const TotalPrecio = producto.querySelector('.TotalPrecio');
            TotalPrecio.textContent = `$ ${Total}`;
        }
    })

    ImprimirTotal(TotalFinal);
}

function ImprimirTotal (Total) {
    const divTotal = document.querySelector('.CarritoTotal');
    const CarritoTotal = document.querySelector('#Total');

    if(Carrito){
        CarritoTotal.innerHTML = `<p class="SubTotal"> $${Total} </p>`
    }else{
        divTotal.innerHTML = `<p class="SubTotal">SubTotal $ ${Total} </p>`
    }
}

function CantidadCarrito(){
    let Productos;
    Productos = document.querySelectorAll('.ProductosCarrito');
    if(Carrito){
        Productos = document.querySelectorAll('.ProductosIn');
    }
    const Cantidad = document.querySelector('.CantidadProductos')
    return Cantidad.textContent = Productos.length
}

function actualizarInputCarrito (e){
    calcularTotal();
    const ProductoEnCarrito = getProductosCarrito();
    añadirLocalStorage('productosCarrito',ProductoEnCarrito);
}

function EliminarProducto (e){
    let Producto;
    Producto = e.target.parentElement;
    if(Carrito){
        Producto = e.target.parentElement.parentElement.parentElement
    }
    Producto.remove();
    CantidadCarrito();
    const ProductoEnCarrito = getProductosCarrito();
    añadirLocalStorage('productosCarrito',ProductoEnCarrito);
    return calcularTotal();
}

// Crear el producto en carrito para mandarlo a localStorage
function getProductosCarrito() {
    let ProductosEnCarrito;
    if(Carrito){
        ProductosEnCarrito = document.querySelectorAll('.ProductoIn');
    }else{
        ProductosEnCarrito = document.querySelectorAll('.ProductosCarrito');
    }

    const arrProductosCarrito = [];

    ProductosEnCarrito.forEach(ProductoEnCarrito => {
        const Nombre = ProductoEnCarrito.querySelector('#Titulo').textContent;
        const Precio = ProductoEnCarrito.querySelector('#Precio').textContent;
        const CantidadElemento = ProductoEnCarrito.querySelector('.CantidadCarrito');
        const Cantidad = Number(CantidadElemento.value);
        const Imagen = ProductoEnCarrito.querySelector('#Imagen').src;
        const id = ProductoEnCarrito.getAttribute('data-id');

        const Producto = {
            Nombre:Nombre,
            Precio,
            Cantidad,
            Imagen,
            id
        }

        arrProductosCarrito.push(Producto)
    });
    return arrProductosCarrito;

}

function añadirLocalStorage(key,productos){
    return localStorage.setItem(key,JSON.stringify(productos));
}


function CarritoVacio (){
    const subtotalCar = document.querySelector('.SubtotalCar');
    return subtotalCar.innerHTML = '<h3> Carrito Vacio </h3>'
}

function AlertaAñadido() {
    Swal.fire({
        position:'top-center',
        icon:'success',
        title:'Producto Agregado correctamente',
        showCancelButton:false,
        timer:1200
    });
}

export{CantidadCarrito};
export{calcularTotal};
export{actualizarInputCarrito};
export{CarritoVacio};
export{EliminarProducto};
export default miniCarrito