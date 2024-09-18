const { Router } = require('express')
const router = Router()
const { registrarUsuario, obtenerTodosLosUsuarios, obtenerUnUsuario, bajaFisicaUsuario, bajaLogicaUsuario, iniciarSesionUsuario, emailRecupero, recuperoContrasenia } = require('../controllers/usuarios.controllers')
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const {validateFields} = require('../middlewares/validateFields')

router.post('/', [
  check('nombreUsuario', 'Campo USUARIO esta vacio').not().isEmpty(),
  check('nombreUsuario', 'min:5 caracteres y max: 40 caracteres').isLength({min:5, max: 40}),
  check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty(),
  check('contrasenia', 'min: 8 caracteres y max: 50 caracteres').isLength({min:8, max: 50}),
  validateFields
/*   check('nombreUsuario', 'Formato incorrecto: Tiene que ser un email').isEmail() */
], registrarUsuario)
router.post('/login', [
  check('nombreUsuario', 'Campo USUARIO esta vacio').not().isEmpty(),
  check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty(),
  validateFields
], iniciarSesionUsuario)

router.post('/emailRecupero', [
  check('emailUsuario', 'Formato de email incorrecto').isEmail(),
  validateFields
], emailRecupero)

router.post('/recuperoContrasenia', [
  check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty(),
  check('contrasenia', 'min: 8 caracteres y max: 50 caracteres').isLength({min:8, max: 50}),
  check('token', 'No recibimos el token o ha expirado, solicite nuevamente el cambio de contraseña').not().isEmpty(),
  validateFields
], recuperoContrasenia)

router.get('/', auth('admin'),obtenerTodosLosUsuarios)
router.get('/:idUsuario', [
/*   check('_id', 'Formato ID incorrecto').isMongoId() */
],auth('admin'), obtenerUnUsuario)
router.delete('/:idUsuario', auth('admin'),bajaFisicaUsuario)
router.put('/:idUsuario', auth('admin'),bajaLogicaUsuario)

module.exports = router