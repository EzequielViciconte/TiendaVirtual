exports.Home = (req,res)=>{
    res.render('Home',{
        Pagina:'Index',
        Header:'ContenedorHeader'
    });
}

exports.Productos = (req,res)=>{
    res.render('Productos')
}