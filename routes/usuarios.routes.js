const { Router } = require('express')
const { registrarUsuario, obtenerTodosLosUsuarios, obtenerUnUsuario, bajaFisicaUsuario, bajaLogicaUsuario, iniciarSesionUsuario } = require('../controllers/usuarios.controllers')
const router = Router()
const { check } = require('express-validator')
const auth = require('../middlewares/auth')

router.get('/', auth('admin'),obtenerTodosLosUsuarios)
router.get('/:idUsuario', [
/*   check('_id', 'Formato ID incorrecto').isMongoId() */
],auth('admin'), obtenerUnUsuario)
router.delete('/:idUsuario', auth('admin'),bajaFisicaUsuario)
router.put('/:idUsuario', auth('admin'),bajaLogicaUsuario)

module.exports = router