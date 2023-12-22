let checkout
const axios = require('axios')
const TipoEnvioSelect = document.querySelectorAll('.Radio');

if(TipoEnvioSelect){
    TipoEnvioSelect.forEach(Radio => {
        Radio.addEventListener('click',e=>{
            const Datos = e.target.value
            let Entrega = {
                'TipoEntrega': Datos
            }
            añadirLocalStorage('TipoEntrega',Entrega);
            VerificarTipoEnvio();
        })
    })
}


// Seleccionar Todos Los input
const Nombre = document.querySelector('.Nombre');
const Apellido = document.querySelector('.Apellido');
const Telefono = document.querySelector('.Telefono');
const Calle = document.querySelector('.Calle');
const Numeracion = document.querySelector('.Numeracion');
const Ciudad = document.querySelector('.Ciudad');
const Provincia = document.querySelector('.Provincia');
const CP = document.querySelector('.CP');
const Direccion = document.querySelector('.DireccionValor');

if(Direccion){
    Direccion.addEventListener('change',function(){
        VerificarDatos();
        const Seleccionado = this.options[Direccion.selectedIndex];
        LlenarCamposDireccion(Seleccionado);
    })
}


// Funciones
function LlenarCamposDireccion(Seleccionado){
    axios.get('/TomarDirecciones')
        .then(response => {
            const Direcciones = response.data
            Direcciones.forEach(DireccionInd => {
                if(DireccionInd._id == Seleccionado.value ){
                    console.log(DireccionInd)
                    let Direccion = {
                        'Nombre' : DireccionInd.Nombre,
                        'Apellido' : DireccionInd.Apellido,
                        'Telefono' : DireccionInd.Telefono,
                        'Calle' : DireccionInd.Direccion,
                        'Numeracion' : DireccionInd.Numeracion,
                        'Ciudad' : DireccionInd.Ciudad,
                        'Provincia' : DireccionInd.Provincia,
                        'CP' : DireccionInd.Provincia
                    }

                    Nombre.value = DireccionInd.Nombre
                    Apellido.value = DireccionInd.Apellido
                    Telefono.value = DireccionInd.Telefono
                    Calle.value = DireccionInd.Direccion
                    Numeracion.value = DireccionInd.Numeracion
                    Ciudad.value = DireccionInd.Ciudad
                    CP.value = DireccionInd.CodigoPostal
                    Provincia.value = DireccionInd.Provincia
                    añadirLocalStorage('direccion',Direccion)
                    VerificarDatos();
                }
            }) 
        })
}

// Verificar que esten todos los datos completos
function  VerificarDatos(){
const BtnSiguiente = document.querySelector('#BtnSiguiente');
if(Nombre.value == '' || Apellido.value == '' || Telefono.value == '' || Calle.value == '' ||Numeracion.value == '' || Ciudad.value == '' || CP.value == '' || Provincia.value == ''){
    BtnSiguiente.href = ''
}else{
    BtnSiguiente.href = 'Tipo-Envio'
}
}

function VerificarTipoEnvio(){
    if(TipoEnvioSelect[0].checked || TipoEnvioSelect[1].checked){
        const BtnCaja = document.querySelector('#BtnCaja');
        BtnCaja.href = '/pasarela';
    }
}


function añadirLocalStorage(key,direccion){
    return localStorage.setItem(key,JSON.stringify(direccion))
}

export default checkout;