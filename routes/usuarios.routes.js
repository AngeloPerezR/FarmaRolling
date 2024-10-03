const { Router } = require('express')
const router = Router()
const { registrarUsuario, obtenerTodosLosUsuarios, obtenerUnUsuario, bajaFisicaUsuario, bajaLogicaUsuario, iniciarSesionUsuario, emailRecupero, recuperoContrasenia } = require('../controllers/usuarios.controllers')
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const { validateFields } = require('../middlewares/validateFields')

/**
 * @swagger
 *   components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          nombreUsuario:
 *            type: string
 *            description: Nombre de usuario con el que inician sesión
 *          emailUsuario:
 *            type: string
 *            description: Correo electronico del usuario
 *          contrasenia:
 *            type: string
 *            description: Contraseña del usuario
 *          tokenContrasenia:
 *            type: string
 *            description: Token que se genera cuando el usuario necesita reestablecer su contraseña
 *          rol:
 *            type: string
 *            description: El tipo de usuario que es, puede ser "usuario" o "admin", por defecto es "usuario"
 *          bloqueado:
 *            type: boolean
 *            description: El estado del usuario para definir si puede o no ingresar a la aplicación
 *          idCarrito:
 *            type: string
 *            description: ID del carrito que se genera cuando se registra el usuario
 *          idFavoritos:
 *            type: string
 *            description: ID del favorito que se genera cuando se registra el usuario
 *        required:
 *            - nombreUsuario
 *            - emailUsuario
 *            - contrasenia
 *        example:
 *            nombreUsuario: JoseHernandez
 *            emailUsuario: josehernandez@gmail.com
 *            contrasenia: Asdf1234
 */

// POST - REGISTRO

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Registro de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreUsuario:
 *                 type: string
 *                 description: Nombre con el que el usuario se registra
 *                 example: "ValeLorenzo33"
 *               emailUsuario:
 *                 type: string
 *                 description: Email con el que el usuario se registra
 *                 example: "valelorenzo@gmail.com"
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña con el que el usuario se registra
 *                 example: "Contraseñadeejemplo"
 *     responses:
 *      201:
 *        description: Usuario registrado con exito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 _id:
 *                   type: string
 *                 nombreUsuario:
 *                   type: string
 *                 emailUsuario:                  
 *                   type: string
 *                 contrasenia:
 *                   type: string
 *                 tokenContrasenia:
 *                   type: string
 *                 rol:                      
 *                   type: string
 *                 bloqueado:
 *                   type: boolean
 *                 idCarrito:
 *                   type: string
 *                 idFavoritos:
 *                   type: string
 *      409:
 *        description: La solicitud de registro se envio con un "Rol" y este por defecto es "User"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "Rol por defecto es 'Usuario'"
 *      400:
 *        description: El usuario ya existe
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "Ya existe un usuario registrado con ese correo"
 *      500:
 *        description: "Error del servidor"
 */

router.post('/', [
  check('nombreUsuario', 'Campo USUARIO esta vacio').not().isEmpty(),
  check('nombreUsuario', 'min:5 caracteres y max: 40 caracteres').isLength({ min: 5, max: 40 }),
  check('emailUsuario', 'CamFpo EMAIL esta vacio o en un formato incorrecto').isEmail(),
  check('emailUsuario', 'min:5 caracteres y max: 40 caracteres').isLength({ min: 5, max: 40 }),
  check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty(),
  check('contrasenia', 'min: 8 caracteres y max: 50 caracteres').isLength({ min: 8, max: 50 }),
  validateFields
], registrarUsuario)

// POST - LOGIN

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreUsuario:
 *                 type: string
 *                 description: Nombre con el que el usuario se registra
 *                 example: "ValeLorenzo33"
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña con el que el usuario se registra
 *                 example: "Contraseñadeejemplo"
 *     responses:
 *      200:
 *        description: Usuario Logueado con exito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: Usuario logueado correctamente
 *                token:
 *                  type: string
 *                  example: "oasndfajasndf123kljasndf123njdfasdfn3123msdf"
 *      400:
 *        description: Usuario o contraseña incorrecto
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "Usuario y/o contraseña incorrecto"
 *      401:
 *        description: Usuario bloqueado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "Usuario bloqueado, comunicate con un administrador"
 *      500:
 *        description: "Error del servidor"
 */

router.post('/login', [
  check('nombreUsuario', 'Campo USUARIO esta vacio').not().isEmpty(),
  check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty(),
  validateFields
], iniciarSesionUsuario)

// POST - EMAIL PARA RECUPERO DE CONTRASEÑA

/**
 * @swagger
 * /api/usuarios/emailRecupero:
 *   post:
 *     summary: Solicitud que envia un mail para reestablecer la contraseña
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailUsuario:
 *                 type: string
 *                 description: Email con el que el usuario se registro
 *                 example: "valelorenzo@gmail.com"
 *     responses:
 *      200:
 *        description: Email enviado con exito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "Si el email corresponde a un usuario registrado deberias recibir un correo en tu casilla para reestablecer la contraseña"
 *      500:
 *        description: "Error del servidor"
 */

router.post('/emailRecupero', [
  check('emailUsuario', 'Formato de email incorrecto').isEmail(),
  validateFields
], emailRecupero)

// POST - RUTA PARA CAMBIAR CONTRASEÑA

/**
 * @swagger
 * /api/usuarios/recuperoContrasenia:
 *   post:
 *     summary: Solicitud que cambia la contraseña del usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token que comparamos con el que se encuentra en la base de datos para validar el usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña con el que el usuario se registra
 *                 example: "Contraseñadeejemplo"
 *     responses:
 *      200:
 *        description: Cambio de contraseña exitoso
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "Se cambio la contraseña correctamente"
 *      400:
 *        description: Problema con la validacion del token
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "El token no coincide o expiro"
 *      500:
 *        description: "Error del servidor"
 */

router.post('/recuperoContrasenia', [
  check('contrasenia', 'Campo CONTRASEÑA esta vacio').not().isEmpty(),
  check('contrasenia', 'min: 8 caracteres y max: 50 caracteres').isLength({ min: 8, max: 50 }),
  check('token', 'No recibimos el token o ha expirado, solicite nuevamente el cambio de contraseña').not().isEmpty(),
  validateFields
], recuperoContrasenia)

// GET - TRAER TODOS LOS USUARIOS

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - authHeader: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve un producto o una lista paginada de productos.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombreUsuario:
 *                       type: string
 *                     emailUsuario:                  
 *                       type: string
 *                     contrasenia:
 *                       type: string
 *                     tokenContrasenia:
 *                       type: string
 *                     rol:                      
 *                       type: string
 *                     bloqueado:
 *                       type: boolean
 *                     idCarrito:
 *                       type: string
 *                     idFavoritos:
 *                       type: string
 *                 - type: object
 *                   properties:
 *                     usuarios:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombreUsuario:
 *                             type: string
 *                           emailUsuario:                  
 *                             type: string
 *                           contrasenia:
 *                             type: string
 *                           tokenContrasenia:
 *                             type: string
 *                           rol:                      
 *                             type: string
 *                           bloqueado:
 *                             type: boolean
 *                           idCarrito:
 *                             type: string
 *                           idFavoritos:
 *                             type: string
 *       401:
 *         description: Error de autenticación de acceso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "No tenes acceso"
 *       500:
 *         description: Error del servidor
 */

router.get('/', auth('admin'), obtenerTodosLosUsuarios)

// GET - TRAER UN USUARIO

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del usuario que se desea encontrar
 *     responses:
 *      200:
 *        description: Usuario encontrado con exito
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 _id:
 *                   type: string
 *                 nombreUsuario:
 *                   type: string
 *                 emailUsuario:                  
 *                   type: string
 *                 contrasenia:
 *                   type: string
 *                 tokenContrasenia:
 *                   type: string
 *                 rol:                      
 *                   type: string
 *                 bloqueado:
 *                   type: boolean
 *                 idCarrito:
 *                   type: string
 *                 idFavoritos:
 *                   type: string
 *      401:
 *        description: Error de autenticación de acceso
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                  example: "No tenes acceso"
 *      500:
 *        description: "Error del servidor"
 */

router.get('/:idUsuario', auth('admin'), obtenerUnUsuario)

// DELETE - ELIMINAR UN USUARIO

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   delete:
 *     summary: Eliminar un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del usuario que se va a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Usuario eliminado"
 *       401:
 *         description: Error de autenticación de acceso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "No tenes acceso"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error del servidor"
 */

router.delete('/:idUsuario', auth('admin'), bajaFisicaUsuario)

// PUT - BAJA LOGICA DE USUARIO

/**
 * @swagger
 * /api/usuarios/{idUsuario}:
 *   put:
 *     summary: Baja logica de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del usuario que se va a deshabilitar
 *     responses:
 *       200:
 *         description: Usuario deshabilitaado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Usuario deshabilitado"
 *       401:
 *         description: Error de autenticación de acceso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "No tenes acceso"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error del servidor"
 */

router.put('/:idUsuario', auth('admin'), bajaLogicaUsuario)

module.exports = router