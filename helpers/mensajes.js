const transporter = require('../helpers/nodemailer')


const registroUsuario = async (emailUsuario) => {
  const info = await transporter.sendMail({
    from: `Bienvenido a nuestra pagina!!!👻" <${process.env.GMAIL_USER}>`, // sender address
    to: emailUsuario, // list of receivers
    subject: "Bienvenido ✔", // Subject line
    html: `
    <div>
        <div style='display: flex; justify-content: center;'>
            <img src="https://images.vexels.com/content/234933/preview/bienvenida-badge-banner-8aaee8.png" alt="">
        </div>
        
        <div>
            <img src="https://www.shutterstock.com/image-photo/young-smiling-male-businessman-founder-600nw-2454061349.jpg" alt="" width="100%">
        </div>
    </div>
    `,
  });
}


const recuperoContraseniaUsuario = async (emailUsuario, token) => {
  const info = await transporter.sendMail({
    from: `FarmaRolling <${process.env.GMAIL_USER}>`, // sender address
    to: emailUsuario, // list of receivers
    subject: "Recupero de contraseña", // Subject line
    html: `
      <div style='text-aligne: center;'>
        <div>
            <p>Hace click en el siguiente boton para cambiar tu contraseña!<p/>
        </div>
        
        <div>
              <button style="background-color: #4CAF50; color: #ffffff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                <a href="ejemploDeRutaFront/${token}">
                  Cambiar contraseña
                </a>
              </button>        
        </div>
      </div>
    `,
  });
}

const envioDeOrdenDeCompra = async (emailUsuario, linkDePago) => {
  const info = await transporter.sendMail({
    from: `FarmaRolling <${process.env.GMAIL_USER}>`, // sender address
    to: emailUsuario, // list of receivers
    subject: "Orden de compra", // Subject line
    html: `
      <div style='text-aligne: center;'>
        <div>
            <p>Muchas gracias por tu compra!! Hace click en el siguiente enlace para realizar el pago!!<p/>
        </div>
        
        <div>
              <button style="background-color: #4CAF50; color: #ffffff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                <a href="${linkDePago}">
                  Finalizar compra
                </a>
              </button>        
        </div>
      </div>
    `,
  });
}

module.exports = {
  registroUsuario,
  recuperoContraseniaUsuario,
  envioDeOrdenDeCompra
}
