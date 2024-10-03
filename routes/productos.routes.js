const express = require('express')
const { obtenerUnProductoPorIdOTodos, crearProducto, editarProductoPorId, eliminarProductoPorId, agregarImagenProductoPorId, buscarProductoPorTermino, agregarProductoAlCarrito, borrarProductoDelCarrito, agregarProductoAlFavoritos, borrarProductoFavoritos, mercadoPago } = require('../controllers/productos.controllers')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const {validateFields} = require('../middlewares/validateFields')


/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: nombre del producto
 *        descripcion:
 *          type: string
 *          description: descripción del producto
 *        precio:
 *          type: number
 *          description: precio del producto
 *        imagen:
 *          type: string
 *          description: URL de la imagen del producto
 *      required:
 *          - nombre
 *          - descripcion
 *          - precio
 *      example:
 *          nombre: Termómetro Digital
 *          descripcion: Dispositivo para medir la temperatura corporal con precisión
 *          precio: 11.99
*/

/**
 * @swagger
 * components:
 *  schemas:
 *    Fav:
 *      type: object
 *      properties:
 *        idUsuario:
 *          type: string
 *          description: ID del usuario al que pertenece la lista de favoritos
 *        productos:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Product'
 *          description: Array de productos que son favoritos del usuario
 *      required:
 *        - idUsuario
 *        - productos
 *      example:
 *        idUsuario: "1234567890"
 *        productos:
 *          - nombre: Termómetro Digital
 *            descripcion: Dispositivo para medir la temperatura corporal con precisión
 *            precio: 11.99
 *            imagen: "https://example.com/images/termometro.png"
 *          - nombre: Ibuprofeno 400mg
 *            descripcion: Medicamento para el alivio del dolor y la inflamación
 *            precio: 8.99
 *            imagen: "https://example.com/images/ibuprofeno.png"
 */
/**
 * @swagger
 * components:
 *  schemas:
 *    Cart:
 *      type: object
 *      properties:
 *        idUsuario:
 *          type: string
 *          description: ID del usuario al que pertenece la lista del carrito
 *        productos:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Product'
 *          description: Array de productos que van al carrito del usuario
 *      required:
 *        - idUsuario
 *        - productos
 *      example:
 *        idUsuario: "1234567890"
 *        productos:
 *          - nombre: Termómetro Digital
 *            descripcion: Dispositivo para medir la temperatura corporal con precisión
 *            precio: 11.99
 *            imagen: "https://example.com/images/termometro.png"
 *          - nombre: Ibuprofeno 400mg
 *            descripcion: Medicamento para el alivio del dolor y la inflamación
 *            precio: 8.99
 *            imagen: "https://example.com/images/ibuprofeno.png"
 */

/* GET - Obtener*/
/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener un producto por id o varios productos si no se proporciona un id
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: El ID del producto que se quiere obtener
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de productos a devolver (solo cuando no se proporciona un ID)
 *       - in: query
 *         name: to
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Desplazamiento (solo cuando no se proporciona un ID)
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
 *                     nombre:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     precio:
 *                       type: number
 *                 - type: object
 *                   properties:
 *                     productos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                           precio:
 *                             type: number
 *                     cantidadTotal:
 *                       type: integer
 *       500:
 *         description: Error del servidor
 */
router.get('/', obtenerUnProductoPorIdOTodos)
/**
 * @swagger
 * /api/productos/buscar:
 *   get:
 *     summary: Busca productos por término en nombre o descripción
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: termino
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda para encontrar productos por nombre o descripción
 *     responses:
 *       200:
 *         description: Éxito. Devuelve una lista de productos que coinciden con el término de búsqueda.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     example: "Paracetamol"
 *                   descripcion:
 *                     type: string
 *                     example: "Analgésico y antipirético"
 *                   precio:
 *                     type: number
 *                     example: 50.0
 *                   imagen:
 *                     type: string
 *                     example: "/images/paracetamol.png"
 *       500:
 *         description: Error del servidor
 */
router.get('/buscar', buscarProductoPorTermino)
/* POST - Crear */
/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     security:
 *       - authHeader: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre del producto
 *                 example: "Ibuprofeno"
 *               descripcion:
 *                 type: string
 *                 description: La descripción del producto
 *                 example: "Analgésico antiinflamatorio"
 *               precio:
 *                 type: number
 *                 description: El precio del producto
 *                 example: 25.5
 *               imagen:
 *                 type: string
 *                 description: URL de la imagen del producto
 *                 example: "/images/ibuprofeno.png"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 precio:
 *                   type: number
 *                 imagen:
 *                   type: string
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "campo NOMBRE vacio"
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
router.post('/', [
  check('nombre', 'campo NOMBRE vacio').not().isEmpty(),
  check('precio', 'campo PRECIO vacio').not().isEmpty(),
  check('descripcion', 'campo DESCRIPCION vacio').not().isEmpty(),
  validateFields
], auth('admin'), crearProducto)

/**
 * @swagger
 * /api/productos/crearPago:
 *   post:
 *     summary: Crea un pago con Mercado Pago basado en el carrito del usuario.
 *     tags: [Pagos]
 *     security:
 *       - authHeader: []
 *     responses:
 *       200:
 *         description: Pago creado exitosamente con Mercado Pago.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "https://www.mercadopago.com/checkout/v1/redirect?preference-id=123456789"
 *       400:
 *         description: Error en la solicitud (por ejemplo, carrito vacío o ID de usuario no válido).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Carrito vacío o no se pudo procesar el pago."
 *       401:
 *         description: Error de autenticación de acceso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "No tenes acceso"
 *       500:
 *         description: Error del servidor durante el procesamiento del pago.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Error en el servidor al intentar crear el pago."
 */

router.post('/crearPago', auth('usuario'), mercadoPago)

/**
 * @swagger
 * /api/productos/agregarProductoCarrito/{idProducto}:
 *   post:
 *     summary: Agregar un producto al carrito de compras
 *     tags: [Carrito]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto que se desea agregar al carrito
 *     responses:
 *       200:
 *         description: Producto agregado correctamente al carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Producto cargado correctamente en el carrito"
 *       202:
 *         description: El producto ya existe en el carrito asi que se suma uno en cantidad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Se aumento la cantidad del producto"
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
router.post('/agregarProductoCarrito/:idProducto', auth('usuario'), agregarProductoAlCarrito)
/**
 * @swagger
 * /api/productos/quitarProductoCarrito/{idProducto}:
 *   post:
 *     summary: Eliminar un producto del carrito de compras
 *     tags: [Carrito]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto que se desea eliminar del carrito
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente del carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Producto eliminado correctamente del carrito"
 *       202:
 *         description: Se elimina una unidad del producto que se encuentra en el carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Se redujo una unidad del producto seleccionado"
 *       400:
 *         description: El producto no se encontró en el carrito o hubo un error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "No se encontro el producto que buscas"
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
router.post('/quitarProductoCarrito/:idProducto', auth('usuario'), borrarProductoDelCarrito)

/**
 * @swagger
 * /api/productos/agregarProductoFav/{idProducto}:
 *   post:
 *     summary: Agregar un producto a favoritos
 *     tags: [Favoritos]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto que se desea agregar a favoritos
 *     responses:
 *       200:
 *         description: Producto cargado correctamente a Favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Producto cargado correctamente a Favoritos"
 *       400:
 *         description: El producto ya existe en el favoritos o hubo un error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Producto ya existe en Favoritos"
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
router.post('/agregarProductoFav/:idProducto', auth('usuario'), agregarProductoAlFavoritos)
/**
 * @swagger
 * /api/productos/quitarProductoFav/{idProducto}:
 *   post:
 *     summary: Quitar un producto de favoritos del usuario
 *     tags: [Favoritos]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto que se desea eliminar de favoritos
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente de Favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Producto eliminado correctamente de Favoritos"
 *       400:
 *         description: El producto no existe en favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "No se encontro el producto que buscas"
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
router.post('/quitarProductoFav/:idProducto', auth('usuario'), borrarProductoFavoritos)
/**
 * @swagger
 * /api/productos/agregarImagen/{idProducto}:
 *   post:
 *     summary: Agregar una imagen a un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto al que se va a agregar la imagen
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: La imagen del producto en formato JPG, PNG o JPEG
 *     responses:
 *       200:
 *         description: Imagen agregada correctamente al producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Se agrego la imagen correctamente"
 *       400:
 *         description: Formato de imagen incorrecto o error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Formato incorrecto"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Error del servidor"
 */
router.post('/agregarImagen/:idProducto', auth('admin'), multer.single('imagen'),agregarImagenProductoPorId)

/* PUT - Editar */
/**
 * @swagger
 * /api/productos/{idProducto}:
 *   put:
 *     summary: Editar un producto existente
 *     tags: [Productos]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto que se va a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre del producto
 *                 example: "Ibuprofeno"
 *               descripcion:
 *                 type: string
 *                 description: La descripción del producto
 *                 example: "Analgésico antiinflamatorio"
 *               precio:
 *                 type: number
 *                 description: El precio del producto
 *                 example: 25.5
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 precio:
 *                   type: number
 *                 imagen:
 *                   type: string
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "campo NOMBRE vacio"
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
router.put('/:idProducto',
  [
    check('nombre', 'campo NOMBRE vacio').not().isEmpty(),
    check('precio', 'campo PRECIO vacio').not().isEmpty(),
    check('descripcion', 'campo DESCRIPCION vacio').not().isEmpty(),
    validateFields
  ], auth('admin'), editarProductoPorId)

/* DELETE  - Borrar */
/**
 * @swagger
 * /api/productos/{idProducto}:
 *   delete:
 *     summary: Eliminar un producto existente
 *     tags: [Productos]
 *     security:
 *       - authHeader: []
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto que se va a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Producto eliminado"
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
router.delete('/:idProducto', auth('admin'), eliminarProductoPorId)

module.exports = router
