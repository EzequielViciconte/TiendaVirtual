let Producto;
//Imagenes Cont
const Imagenes = document.querySelectorAll('.SliderImg');
const divCambiarImg = document.querySelector('.CambiarFoto');
Imagenes.forEach(Imagen => {
    const btnCambiar = document.createElement('DIV');
    btnCambiar.classList.add('BtnCambiar');
    btnCambiar.dataset.src = Imagen.src;
    divCambiarImg.appendChild(btnCambiar);
})

const divBtnCambiar = document.querySelectorAll('.BtnCambiar');
divBtnCambiar.forEach(BtnCambiar =>{
    BtnCambiar.addEventListener('click',() =>{
        const srcImagenElegida = BtnCambiar.dataset.src;
        const Img = document.querySelector('.Imagen .show');
        Img.src = srcImagenElegida; 
    })
})

export default Producto;

