const UsuarioModel = require("../models/usuario.schema")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registroUsuario, recuperoContraseniaUsuario } = require("../helpers/mensajes")
const CarritoModel = require("../models/carrito.schema")
const FavModel = require("../models/favoritos.schema")

const nuevoUsuario = async (body) => {
  try {
    const usuarioExiste = await UsuarioModel.findOne({ nombreUsuario: body.nombreUsuario })
    
    if (usuarioExiste) {
      return 400
    }
    if (body.rol) {
      return 409
    }

    let salt = bcrypt.genSaltSync();
    body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);

    registroUsuario(body.emailUsuario)
    const usuario = new UsuarioModel(body)
    const carrito = new CarritoModel({idUsuario: usuario._id})
    const favoritos = new FavModel({idUsuario: usuario._id})

    usuario.idCarrito = carrito._id
    usuario.idFavoritos = favoritos._id

    await carrito.save()
    await favoritos.save()
    await usuario.save()
    
    return 201
  } catch (error) {
    console.log(error)
  }
}

const inicioSesion = async (body) => {
  try {

    const usuarioExiste = await UsuarioModel.findOne({ nombreUsuario: body.nombreUsuario })

    if (!usuarioExiste) {
      return { code: 400 }
    }

    const verificacionContrasenia = bcrypt.compareSync(body.contrasenia, usuarioExiste.contrasenia)

    if (verificacionContrasenia) {

      const payload = {
        _id: usuarioExiste._id,
        rol: usuarioExiste.rol,
        bloqueado: usuarioExiste.bloqueado,
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET)

      return {
        code: 200,
        token
      }
    } else {
      return { code: 400 }
    }

  } catch (error) {
    console.log(error)
  }
}

const emailRecuperoContraseña = async (body) =>{
  try {
    const usuarioExiste = await UsuarioModel.findOne({ emailUsuario: body.emailUsuario})
    if (usuarioExiste) {
      const payload = {
        emailUsuario: body.emailUsuario
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})
      usuarioExiste.tokenContrasenia = token
      await usuarioExiste.save()
      recuperoContraseniaUsuario(body.emailUsuario, token)
    }
    return {msg: 'Si el email corresponde a un usuario registrado deberias recibir un correo en tu casilla para reestablecer la contraseña'}
  } catch (error) {
    console.log(error)
  }
}

const reestablecerContraseña = async (body, token) =>{
  try {
    const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    const result = await UsuarioModel.findOne({emailUsuario: tokenDecodificado.emailUsuario})

    if(result.tokenContrasenia === token){
      let salt = bcrypt.genSaltSync();
      body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);
      result.contrasenia = body.contrasenia
      result.tokenContrasenia = null
      await result.save()
      return {code: 200}
    } else{
      return {code: 400}
    }
  } catch (error) {
    console.log(error)
  }
}

const obtenerTodosLosUsuarios = async () => {
  try {
    const usuarios = await UsuarioModel.find()
    return usuarios
  } catch (error) {
    console.log(error)
  }
}

const obtenerUnUsuario = async (idUsuario) => {
  try {
    const usuario = await UsuarioModel.findOne({ _id: idUsuario })
    return usuario
  } catch (error) {
    console.log(error)
  }
}

const bajaUsuarioFisica = async (idUsuario) => {

  await UsuarioModel.findByIdAndDelete({ _id: idUsuario })
  return 200
}

const bajaUsuarioLogica = async (idUsuario) => {
  const usuario = await UsuarioModel.findOne({ _id: idUsuario })
  usuario.bloqueado = !usuario.bloqueado

  const actualizarUsuario = await UsuarioModel.findByIdAndUpdate({ _id: idUsuario }, usuario, { new: true })
  return actualizarUsuario
}


module.exports = {
  nuevoUsuario,
  inicioSesion,
  emailRecuperoContraseña,
  reestablecerContraseña,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  bajaUsuarioFisica,
  bajaUsuarioLogica
}