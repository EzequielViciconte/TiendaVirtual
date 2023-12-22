const nodemailer = require('nodemailer');
const pug = require('pug');
const {google} = require('googleapis');
const {convert} = require('html-to-text')
const juice = require('juice');
const util = require('util');
const CLIENT_ID = '1072115686779-7ns7t2t7sv2fhn9jg2di64qq9h6u4pt5.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token:'1//04g7gf4OnU1EPCgYIARAAGAQSNwF-L9IrjG-DWKwl7v9pfwLa8GC8l302pPGxWKqKCWbeXuFVC3sZcxXm5WXgtlkh8f4t3a-PW1I'})

const accessToken = oAuth2Client.getAccessToken();

let Transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:'pruebatiendavirtual12@gmail.com',
        pass:'TiendaVirtual12',
        clientId:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:'1//04g7gf4OnU1EPCgYIARAAGAQSNwF-L9IrjG-DWKwl7v9pfwLa8GC8l302pPGxWKqKCWbeXuFVC3sZcxXm5WXgtlkh8f4t3a-PW1I'
        
    }
});

//Generar HTML
const generarHTML = (Archivo,opciones = {})=>{
    const html = pug.renderFile(__dirname + `/../views/Emails/${Archivo}.pug`,opciones)
    return juice(html);
}

exports.EnviarFactura = async(opciones)=>{
    const html = generarHTML(opciones.Archivo,opciones);
    const text = convert(html);
    const opcionesEmail = {
        from:'prueba<noresponder@prueba.com',
        to:opciones.usuario.Email,
        subject:opciones.subject,
        text,
        html,
        context:{
            ResetUrl:opciones.Archivo
        },
        attachments:[{
            filename:`${opciones.NombrePdf}.pdf`,
            path:__dirname + `/../public/Facturas/${opciones.NombrePdf}.pdf`,
            contentType:'application/pdf'
        }]
    }
    const sendMail = util.promisify(Transport.sendMail,Transport);
    return sendMail.call(Transport,opcionesEmail);
}