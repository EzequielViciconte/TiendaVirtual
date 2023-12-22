let Direccion;
import axios from "axios";
import Swal from "sweetalert2";

const BotonesMenu = document.querySelectorAll('.BotonMenDireccion');
const BotonesBorrar = document.querySelectorAll('#BtnEliminar');

BotonesMenu.forEach(BtnMenu => {
    BtnMenu.addEventListener('click',mostrarMenuDireccion);
});

BotonesBorrar.forEach(BtnBorrar => {
    BtnBorrar.addEventListener('click',e=>{
        const Direccion = e.target.parentElement.parentElement.parentElement.parentElement.parentElement
        const DireccionId = e.target.parentElement.dataset.id
        Swal.fire({
            title: 'Estas Seguro de eliminar?',
            text: "Una vez eliminado no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminalo!'
          }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/Direcciones/Eliminar/${DireccionId}`
                axios.delete(url,{params:{DireccionId}})
                    .then(function(respuesta){
                        Swal.fire(
                            'Eliminado!',
                            'Su direccion se elimino correctamente.',
                            'success'
                          )
                          Direccion.remove();
                    })
            }
          })
    })
})

// Funciones
function mostrarMenuDireccion(e){
    const ElementoPadre = e.target.parentElement
    const BotonesDireccion = ElementoPadre.lastElementChild;
    BotonesDireccion.classList.toggle('Invisible');
}

export default Direccion;