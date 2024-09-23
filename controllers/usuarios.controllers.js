const logger = require('../helpers/logger')
const serviceUsuario = require('../services/usuarios.sevices')


const registrarUsuario = async (req, res) => {
  try {
    const result = await serviceUsuario.nuevoUsuario(req.body)
    if (result === 201) {
      res.status(201).json({ msg: 'Usuario registrado con exito' })
    }else if(result === 409){
      res.status(409).json({msg:'Error al crear: Rol incorrecto. Solo se puede ser usuario o admin'})
    }
  } catch (error) {
        res.status(500).json(error)
  }
}

const iniciarSesionUsuario = async (req, res) => {
  try {
    const result = await serviceUsuario.inicioSesion(req.body)

    if (result.code === 400) {
      res.status(400).json({ msg: 'Usuario y/o contraseña incorrecto' })
    } else {
      res.status(200).json({ msg: 'Usuario inicio sesion', token: result.token })
    }
  } catch (error) {
        res.status(500).json(error)
  }
}

const emailRecupero = async (req, res) =>{
  try {
    const result = await serviceUsuario.emailRecuperoContraseña(req.body)    
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

const recuperoContrasenia = async (req, res) =>{
  try {
    const result = await serviceUsuario.reestablecerContraseña(req.body, req.query.token)

    if(result.code === 200){
      res.status(200).json({msg: 'Contraseña actualizada'})
    } else{
      res.status(400).json({msg: 'Hubo un problema con el cambio de contraseña, intente nuevamente'})
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await serviceUsuario.obtenerTodosLosUsuarios()
    res.status(200).json(usuarios)
  } catch (error) {
        res.status(500).json(error)
  }
}

const obtenerUnUsuario = async (req, res) => {
  try {
  const usuario = await serviceUsuario.obtenerUnUsuario(req.params.idUsuario)
    res.status(200).json({ msg: 'Usuario encontrado', usuario })
  } catch (error) {
        res.status(500).json(error)
  }
}

const bajaFisicaUsuario = async (req, res) => {
  try {
    const res = await serviceUsuario.bajaUsuarioFisica(req.params.idUsuario)
    if (res === 200) {
      res.status(200).json({ msg: 'Usuario borrado con exito' })
    }
  } catch (error) {
        res.status(500).json(error)
  }
}

const bajaLogicaUsuario = async (req, res) => {
  try {
    const usuario = await serviceUsuario.bajaUsuarioLogica(req.params.idUsuario)
    res.status(200).json({ usuario })
  } catch (error) {
        res.status(500).json(error)
  }
}

module.exports = {
  registrarUsuario,
  iniciarSesionUsuario,
  emailRecupero,
  recuperoContrasenia,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  bajaFisicaUsuario,
  bajaLogicaUsuario
}